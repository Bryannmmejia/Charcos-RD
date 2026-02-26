import React, { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import * as Location from 'expo-location';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { createReport } from '@/services/reportsService';
import { vehicleLabels } from '@/constants/vehicles';
import { RootStackParamList } from '@/types/navigation';
import { VehicleType, WaterLevel } from '@/types/report';

type Props = NativeStackScreenProps<RootStackParamList, 'Report'>;

const levels: { key: WaterLevel; label: string; helper: string; icon: keyof typeof MaterialCommunityIcons.glyphMap }[] = [
  { key: 'green', label: '🟢 Verde', helper: 'Cruce seguro', icon: 'water-check' },
  { key: 'yellow', label: '🟡 Amarillo', helper: 'Cruce con precaución', icon: 'water-alert' },
  { key: 'red', label: '🔴 Rojo', helper: 'No cruzar', icon: 'water-remove' }
];

const vehicleIcons: Record<VehicleType, keyof typeof MaterialCommunityIcons.glyphMap> = {
  'carro-bajo': 'car-sports',
  jeepeta: 'car-estate',
  camion: 'truck',
  motor: 'motorbike'
};

export const ReportScreen = ({ navigation }: Props) => {
  const [waterLevel, setWaterLevel] = useState<WaterLevel>('yellow');
  const [selectedVehicles, setSelectedVehicles] = useState<VehicleType[]>(['jeepeta']);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const summary = useMemo(() => selectedVehicles.map((item) => vehicleLabels[item]).join(', '), [selectedVehicles]);

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
        recommendedVehicles: selectedVehicles,
        comment: comment.trim() || undefined
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
      <Text style={styles.title}>Reporta inundación o charco</Text>
      <Text style={styles.subtitle}>Comparte el nivel de agua para ayudar a otros conductores.</Text>

      <Text style={styles.sectionTitle}>Nivel del agua</Text>
      <View style={styles.levelRow}>
        {levels.map((level) => (
          <Pressable
            key={level.key}
            onPress={() => setWaterLevel(level.key)}
            style={[styles.levelCard, waterLevel === level.key && styles.selectedLevel]}
          >
            <MaterialCommunityIcons name={level.icon} size={24} color="#e2e8f0" />
            <Text style={styles.levelLabel}>{level.label}</Text>
            <Text style={styles.levelHelper}>{level.helper}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Vehículos recomendados</Text>
      <View style={styles.grid}>
        {(Object.keys(vehicleLabels) as VehicleType[]).map((vehicle) => (
          <Pressable
            key={vehicle}
            onPress={() => toggleVehicle(vehicle)}
            style={[styles.vehicleItem, selectedVehicles.includes(vehicle) && styles.selectedVehicle]}
          >
            <MaterialCommunityIcons name={vehicleIcons[vehicle]} size={22} color="#dbeafe" />
            <Text style={styles.vehicleText}>{vehicleLabels[vehicle]}</Text>
          </Pressable>
        ))}
      </View>

      <TextInput
        value={comment}
        onChangeText={setComment}
        style={styles.input}
        placeholder="Comentario opcional (ej. carril izquierdo está libre)"
        placeholderTextColor="#64748b"
      />

      <Text style={styles.summary}>Recomendado para: {summary}</Text>
      <Text style={styles.note}>Foto opcional: lista para integrar con Firebase Storage en la siguiente iteración.</Text>

      <View style={styles.footerRow}>
        <Pressable style={styles.cancel} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Cancelar</Text>
        </Pressable>
        <Pressable style={[styles.submit, isLoading && styles.disabled]} disabled={isLoading} onPress={submit}>
          <Text style={styles.submitText}>{isLoading ? 'Enviando...' : 'Enviar reporte'}</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b1228', padding: 16 },
  title: { color: '#f8fafc', fontWeight: '800', fontSize: 28 },
  subtitle: { color: '#94a3b8', marginTop: 4, marginBottom: 16 },
  sectionTitle: { color: '#e2e8f0', fontWeight: '700', fontSize: 16, marginBottom: 10 },
  levelRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  levelCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#334155'
  },
  selectedLevel: { borderColor: '#60a5fa', backgroundColor: '#1d4ed833' },
  levelLabel: { color: '#f8fafc', fontWeight: '700', marginTop: 8 },
  levelHelper: { color: '#cbd5e1', fontSize: 12, marginTop: 4 },
  grid: { gap: 10, marginBottom: 16 },
  vehicleItem: {
    backgroundColor: '#1e293b',
    padding: 12,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#334155'
  },
  selectedVehicle: { borderColor: '#22c55e', backgroundColor: '#14532d66' },
  vehicleText: { color: '#e2e8f0', fontWeight: '600' },
  input: {
    backgroundColor: '#111827',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: '#f8fafc',
    marginBottom: 12
  },
  summary: { color: '#cbd5e1', marginBottom: 8 },
  note: { color: '#94a3b8', marginBottom: 16, fontStyle: 'italic' },
  footerRow: { flexDirection: 'row', gap: 10 },
  cancel: {
    flex: 1,
    backgroundColor: '#1e293b',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center'
  },
  cancelText: { color: '#e2e8f0', fontWeight: '700' },
  submit: { flex: 1.4, backgroundColor: '#2563eb', paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  disabled: { opacity: 0.6 },
  submitText: { color: '#f8fafc', fontWeight: '700' }
});
