import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { vehicleLabels } from '@/constants/vehicles';
import { useVehicleStore } from '@/store/vehicleStore';
import { RootStackParamList } from '@/types/navigation';
import { VehicleType } from '@/types/report';

type Props = NativeStackScreenProps<RootStackParamList, 'VehicleProfile'>;

const vehicleIcons: Record<VehicleType, keyof typeof MaterialCommunityIcons.glyphMap> = {
  'carro-bajo': 'car-sports',
  jeepeta: 'car-estate',
  camion: 'truck',
  motor: 'motorbike'
};

export const VehicleProfileScreen = ({ navigation }: Props) => {
  const vehicleType = useVehicleStore((state) => state.vehicleType);
  const setVehicleType = useVehicleStore((state) => state.setVehicleType);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Elige tu tipo de vehículo</Text>
      <Text style={styles.subtitle}>Usamos este dato para alertas personalizadas ante inundaciones.</Text>

      {(Object.keys(vehicleLabels) as VehicleType[]).map((type) => (
        <Pressable
          key={type}
          style={[styles.item, vehicleType === type && styles.selected]}
          onPress={() => setVehicleType(type)}
        >
          <MaterialCommunityIcons name={vehicleIcons[type]} size={22} color="#dbeafe" />
          <Text style={styles.itemText}>{vehicleLabels[type]}</Text>
        </Pressable>
      ))}

      <Text style={styles.tip}>
        Recomendaciones activas para: <Text style={styles.tipHighlight}>{vehicleLabels[vehicleType]}</Text>
      </Text>

      <Pressable style={styles.save} onPress={() => navigation.goBack()}>
        <Text style={styles.saveText}>Guardar perfil</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617', padding: 16 },
  title: { color: '#f8fafc', fontSize: 28, fontWeight: '800', marginBottom: 4 },
  subtitle: { color: '#94a3b8', marginBottom: 16 },
  item: {
    backgroundColor: '#1e293b',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#334155'
  },
  selected: { borderColor: '#22c55e', backgroundColor: '#14532d55' },
  itemText: { color: '#e2e8f0', fontWeight: '600', fontSize: 16 },
  tip: { color: '#cbd5e1', marginTop: 8, marginBottom: 22 },
  tipHighlight: { color: '#facc15', fontWeight: '700' },
  save: { backgroundColor: '#2563eb', borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  saveText: { color: '#f8fafc', fontWeight: '700' }
});
