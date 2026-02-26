import React, { useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '@/types/navigation';
import { ReportCard } from '@/components/ReportCard';
import { fetchWeather } from '@/services/weatherService';
import { subscribeReports } from '@/services/reportsService';
import { useReportStore } from '@/store/reportStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useVehicleStore } from '@/store/vehicleStore';

const SANTO_DOMINGO = {
  latitude: 18.4861,
  longitude: -69.9312,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08
};

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export const HomeScreen = ({ navigation }: Props) => {
  const { reports, hydrateReports, voteReport, pruneExpiredReports } = useReportStore();
  const [location, setLocation] = useState(SANTO_DOMINGO);
  const [weatherText, setWeatherText] = useState('Cargando clima...');
  const vehicle = useVehicleStore((state) => state.vehicleType);
  const setRainingAlert = useSettingsStore((state) => state.setRainingAlert);
  const rainingAlert = useSettingsStore((state) => state.rainingAlert);

  useEffect(() => {
    const unsubscribe = subscribeReports(hydrateReports);
    pruneExpiredReports();
    return unsubscribe;
  }, [hydrateReports, pruneExpiredReports]);

  useEffect(() => {
    const bootstrap = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso requerido', 'Se necesita GPS para optimizar rutas en tiempo real.');
        return;
      }

      const current = await Location.getCurrentPositionAsync({});
      const next = {
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05
      };
      setLocation(next);

      try {
        const weather = await fetchWeather(next.latitude, next.longitude);
        const isRaining = (weather?.rain ?? 0) > 0;
        setRainingAlert(isRaining);
        setWeatherText(`🌦️ ${weather?.temperature_2m ?? '--'}°C · lluvia ${weather?.rain ?? 0} mm`);
      } catch {
        setWeatherText('No se pudo cargar el clima actual');
      }
    };

    bootstrap();
  }, [setRainingAlert]);

  const nearbyRedAlerts = useMemo(
    () => reports.filter((r) => r.waterLevel === 'red').length,
    [reports]
  );

  useEffect(() => {
    if (nearbyRedAlerts > 0 && rainingAlert) {
      Alert.alert('Alerta de inundación', `Hay ${nearbyRedAlerts} reportes rojos cerca de tu ruta.`);
    }
  }, [nearbyRedAlerts, rainingAlert]);

  const vehicleWarning = useMemo(() => {
    const hasRisk = reports.some((report) => report.waterLevel !== 'green');
    if (!hasRisk) return 'Ruta despejada para tu vehículo.';

    if (vehicle === 'carro-bajo') return '⚠️ Carro bajo: evita zonas en amarillo y rojo.';
    if (vehicle === 'motor') return '⚠️ Motor: extrema precaución con charcos profundos.';
    return '⚠️ Hay zonas con acumulación de agua en tu alrededor.';
  }, [reports, vehicle]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Charcos RD</Text>
        <Text style={styles.subtitle}>{weatherText}</Text>
        <Text style={styles.warning}>{vehicleWarning}</Text>
      </View>

      <MapView style={styles.map} initialRegion={location} region={location}>
        {reports.map((report) => (
          <Marker
            key={report.id}
            coordinate={{ latitude: report.latitude, longitude: report.longitude }}
            pinColor={report.waterLevel === 'red' ? '#ef4444' : report.waterLevel === 'yellow' ? '#eab308' : '#22c55e'}
            title={`Nivel ${report.waterLevel}`}
            description={`Confirmaciones: ${report.confirms}`}
          />
        ))}
      </MapView>

      <View style={styles.actions}>
        <Pressable style={styles.actionButton} onPress={() => navigation.navigate('Report')}>
          <Text style={styles.actionLabel}>+ Reportar charco</Text>
        </Pressable>
        <Pressable style={styles.actionButton} onPress={() => navigation.navigate('VehicleProfile')}>
          <Text style={styles.actionLabel}>Mi vehículo</Text>
        </Pressable>
      </View>

      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ReportCard report={item} onVote={voteReport} />}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  header: { padding: 16, paddingBottom: 8 },
  title: { color: '#f8fafc', fontSize: 24, fontWeight: '800' },
  subtitle: { color: '#cbd5e1', marginTop: 4 },
  warning: { color: '#facc15', marginTop: 6, fontWeight: '600' },
  map: { height: 260, marginHorizontal: 16, borderRadius: 14 },
  actions: { flexDirection: 'row', gap: 10, margin: 16 },
  actionButton: { backgroundColor: '#1d4ed8', borderRadius: 10, paddingVertical: 10, flex: 1, alignItems: 'center' },
  actionLabel: { color: '#f8fafc', fontWeight: '700' },
  list: { paddingHorizontal: 16, paddingBottom: 18 }
});
