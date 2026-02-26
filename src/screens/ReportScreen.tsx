import React, { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import * as Location from 'expo-location';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { createReport } from '@/services/reportsService';
import { vehicleLabels } from '@/constants/vehicles';
import { VehicleType, WaterLevel } from '@/types/report';
import { RootStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Report'>;

const levels: { key: WaterLevel; label: string }[] = [
  { key: 'green', label: '🟢 Verde' },
  { key: 'yellow', label: '🟡 Amarillo' },
  { key: 'red', label: '🔴 Rojo' }
];

export const ReportScreen = ({ navigation }: Props) => {
  const [waterLevel, setWaterLevel] = useState<WaterLevel>('yellow');
  const [selectedVehicles, setSelectedVehicles] = useState<VehicleType[]>(['jeepeta']);
  const [isLoading, setIsLoading] = useState(false);

  const summary = useMemo(
    () => selectedVehicles.map((item) => vehicleLabels[item]).join(', '),
    [selectedVehicles]
  );

  const toggleVehicle = (vehicle: VehicleType) => {
    setSelectedVehicles((prev) =>
      prev.includes(vehicle) ? prev.filter((item) => item !== vehicle) : [...prev, vehicle]
    );
  };

  const submit = async () => {
    if (selectedVehicles.length === 0) {
      Alert.alert('Selecciona un vehículo', 'Indica al menos un tipo de vehículo recomendado.');
      return;
    }

    setIsLoading(true);
    try {
      const location = await Location.getCurrentPositionAsync({});
      await createReport({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        waterLevel,
        recommendedVehicles: selectedVehicles
      });
      Alert.alert('Reporte enviado', 'Gracias por ayudar a la comunidad vial.');
      navigation.goBack();
    } catch {
      Alert.alert('Error', 'No se pudo enviar el reporte en este momento.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nivel de agua</Text>
      <View style={styles.row}>
        {levels.map((level) => (
          <Pressable
            key={level.key}
            onPress={() => setWaterLevel(level.key)}
            style={[styles.pill, waterLevel === level.key && styles.selectedPill]}
          >
            <Text style={styles.pillText}>{level.label}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.title}>Vehículos recomendados</Text>
      <View style={styles.grid}>
        {(Object.keys(vehicleLabels) as VehicleType[]).map((vehicle) => (
          <Pressable
            key={vehicle}
            onPress={() => toggleVehicle(vehicle)}
            style={[styles.vehicleItem, selectedVehicles.includes(vehicle) && styles.selectedVehicle]}
          >
            <Text style={styles.vehicleText}>{vehicleLabels[vehicle]}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.summary}>Recomendado para: {summary}</Text>
      <Text style={styles.note}>Foto opcional: lista para integrar con Firebase Storage en la siguiente iteración.</Text>

      <Pressable style={[styles.submit, isLoading && styles.disabled]} disabled={isLoading} onPress={submit}>
        <Text style={styles.submitText}>{isLoading ? 'Enviando...' : 'Publicar reporte'}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 16 },
  title: { color: '#f8fafc', fontWeight: '700', fontSize: 18, marginBottom: 12 },
  row: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  pill: { backgroundColor: '#1e293b', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 },
  selectedPill: { borderWidth: 1, borderColor: '#38bdf8' },
  pillText: { color: '#f1f5f9', fontWeight: '600' },
  grid: { gap: 10, marginBottom: 16 },
  vehicleItem: { backgroundColor: '#1e293b', padding: 12, borderRadius: 10 },
  selectedVehicle: { borderColor: '#22c55e', borderWidth: 1 },
  vehicleText: { color: '#e2e8f0' },
  summary: { color: '#cbd5e1', marginBottom: 12 },
  note: { color: '#94a3b8', marginBottom: 16, fontStyle: 'italic' },
  submit: { backgroundColor: '#2563eb', paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  disabled: { opacity: 0.6 },
  submitText: { color: '#f8fafc', fontWeight: '700' }
});
