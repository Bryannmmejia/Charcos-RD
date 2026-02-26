import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { vehicleLabels } from '@/constants/vehicles';
import { useVehicleStore } from '@/store/vehicleStore';
import { RootStackParamList } from '@/types/navigation';
import { VehicleType } from '@/types/report';

type Props = NativeStackScreenProps<RootStackParamList, 'VehicleProfile'>;

export const VehicleProfileScreen = ({ navigation }: Props) => {
  const vehicleType = useVehicleStore((state) => state.vehicleType);
  const setVehicleType = useVehicleStore((state) => state.setVehicleType);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecciona tu vehículo</Text>
      {(Object.keys(vehicleLabels) as VehicleType[]).map((type) => (
        <Pressable
          key={type}
          style={[styles.item, vehicleType === type && styles.selected]}
          onPress={() => setVehicleType(type)}
        >
          <Text style={styles.itemText}>{vehicleLabels[type]}</Text>
        </Pressable>
      ))}

      <Text style={styles.tip}>
        Recomendaciones personalizadas activas para: <Text style={styles.tipHighlight}>{vehicleLabels[vehicleType]}</Text>
      </Text>

      <Pressable style={styles.save} onPress={() => navigation.goBack()}>
        <Text style={styles.saveText}>Guardar</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617', padding: 16 },
  title: { color: '#f8fafc', fontSize: 22, fontWeight: '800', marginBottom: 14 },
  item: { backgroundColor: '#1e293b', padding: 14, borderRadius: 10, marginBottom: 10 },
  selected: { borderWidth: 1, borderColor: '#22c55e' },
  itemText: { color: '#e2e8f0', fontWeight: '600' },
  tip: { color: '#cbd5e1', marginTop: 8, marginBottom: 22 },
  tipHighlight: { color: '#facc15', fontWeight: '700' },
  save: { backgroundColor: '#2563eb', borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  saveText: { color: '#f8fafc', fontWeight: '700' }
});
