import React, { useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '@/types/navigation';
import { ReportCard } from '@/components/ReportCard';
import { fetchWeather } from '@/services/weatherService';
import { subscribeReports, voteOnReport } from '@/services/reportsService';
import { useReportStore } from '@/store/reportStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useVehicleStore } from '@/store/vehicleStore';
import { vehicleLabels } from '@/constants/vehicles';

const SANTO_DOMINGO = {
  latitude: 18.4861,
  longitude: -69.9312,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08
};

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export const HomeScreen = ({ navigation }: Props) => {
  const { reports, hydrateReports, pruneExpiredReports } = useReportStore();
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

  const nearbyRedAlerts = useMemo(() => reports.filter((r) => r.waterLevel === 'red').length, [reports]);

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

  const onVote = async (id: string, type: 'confirm' | 'reject') => {
    const report = reports.find((item) => item.id === id);
    if (!report) return;

    try {
      await voteOnReport(id, type, { confirms: report.confirms, rejects: report.rejects });
    } catch {
      Alert.alert('Error', 'No se pudo registrar tu validación. Intenta de nuevo.');
    }
  };

  return (
    <View style={styles.container}>
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

      <View style={styles.searchBar}>
        <MaterialCommunityIcons name="magnify" color="#cbd5e1" size={20} />
        <Text style={styles.searchText}>Buscar destino en República Dominicana</Text>
      </View>

      <View style={styles.topRightButtons}>
        <Pressable style={styles.smallFab} onPress={() => navigation.navigate('VehicleProfile')}>
          <MaterialCommunityIcons name="car-cog" color="#e2e8f0" size={20} />
        </Pressable>
      </View>

      <Pressable style={styles.reportFab} onPress={() => navigation.navigate('Report')}>
        <MaterialCommunityIcons name="water" color="#e0f2fe" size={28} />
      </Pressable>

      <View style={styles.bottomSheet}>
        <Text style={styles.tripText}>12 min · 5.2 km</Text>
        <Text style={styles.weather}>{weatherText}</Text>
        <Text style={styles.warning}>{vehicleWarning}</Text>
        <Text style={styles.vehicle}>Vehículo: {vehicleLabels[vehicle]}</Text>

        <FlatList
          data={reports}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ReportCard report={item} onVote={onVote} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text style={styles.empty}>Sin reportes recientes. Sé el primero en reportar.</Text>}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  searchBar: {
    position: 'absolute',
    top: 52,
    left: 16,
    right: 72,
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#23304b'
  },
  searchText: { color: '#cbd5e1', fontWeight: '600' },
  topRightButtons: {
    position: 'absolute',
    top: 52,
    right: 16,
    gap: 10
  },
  smallFab: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#23304b'
  },
  reportFab: {
    position: 'absolute',
    right: 20,
    bottom: 320,
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#1d4ed8',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#38bdf8',
    shadowOpacity: 0.45,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6
  },
  bottomSheet: {
    position: 'absolute',
    left: 10,
    right: 10,
    bottom: 12,
    maxHeight: '50%',
    backgroundColor: 'rgba(2, 6, 23, 0.93)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1e293b',
    paddingTop: 14,
    paddingHorizontal: 14,
    paddingBottom: 8
  },
  tripText: { color: '#f8fafc', fontSize: 30, fontWeight: '800' },
  weather: { color: '#93c5fd', marginTop: 4 },
  warning: { color: '#facc15', marginTop: 6, fontWeight: '600' },
  vehicle: { color: '#e2e8f0', marginTop: 2, marginBottom: 8 },
  list: { paddingBottom: 8 },
  empty: { color: '#cbd5e1', marginVertical: 16 }
});
