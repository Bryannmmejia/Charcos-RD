import React, { useMemo } from 'react';
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
  const confidence = useMemo(() => {
    const total = report.confirms + report.rejects;
    if (total === 0) return 50;
    return Math.round((report.confirms / total) * 100);
  }, [report.confirms, report.rejects]);

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <WaterLevelBadge level={report.waterLevel} />
        <Text style={styles.confidence}>Confiabilidad {confidence}%</Text>
      </View>
      <Text style={styles.meta}>📍 {report.latitude.toFixed(5)}, {report.longitude.toFixed(5)}</Text>
      <Text style={styles.meta}>🕒 Reportado a las {date}</Text>
      <Text style={styles.meta}>🚘 Recomendado: {report.recommendedVehicles.map((type) => vehicleLabels[type]).join(', ')}</Text>
      {report.comment ? <Text style={styles.comment}>“{report.comment}”</Text> : null}
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
    backgroundColor: '#111a33',
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1f2a44'
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  confidence: {
    color: '#93c5fd',
    fontWeight: '700'
  },
  meta: {
    color: '#cbd5e1',
    marginBottom: 4
  },
  comment: {
    color: '#f1f5f9',
    marginTop: 4,
    marginBottom: 8,
    fontStyle: 'italic'
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
