import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { vehicleLabels } from '@/constants/vehicles';
import { FloodReport } from '@/types/report';
import { WaterLevelBadge } from '@/components/WaterLevelBadge';

interface Props {
  report: FloodReport;
  onVote: (id: string, type: 'confirm' | 'reject') => void;
}

export const ReportCard = ({ report, onVote }: Props) => {
  const date = new Date(report.createdAt).toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit' });

  return (
    <View style={styles.card}>
      <WaterLevelBadge level={report.waterLevel} />
      <Text style={styles.meta}>📍 {report.latitude.toFixed(5)}, {report.longitude.toFixed(5)}</Text>
      <Text style={styles.meta}>🕒 Reportado a las {date}</Text>
      <Text style={styles.meta}>🚘 Recomendado: {report.recommendedVehicles.map((type) => vehicleLabels[type]).join(', ')}</Text>
      <View style={styles.actions}>
        <Pressable style={[styles.button, styles.confirm]} onPress={() => onVote(report.id, 'confirm')}>
          <Text style={styles.buttonText}>Confirmar ({report.confirms})</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.reject]} onPress={() => onVote(report.id, 'reject')}>
          <Text style={styles.buttonText}>Rechazar ({report.rejects})</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1e293b',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12
  },
  meta: {
    color: '#cbd5e1',
    marginBottom: 4
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8
  },
  button: {
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center'
  },
  confirm: {
    backgroundColor: '#166534'
  },
  reject: {
    backgroundColor: '#7f1d1d'
  },
  buttonText: {
    color: '#f8fafc',
    fontWeight: '600'
  }
});
