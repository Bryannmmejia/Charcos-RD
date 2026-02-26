import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

import { levelColors } from '@/constants/vehicles';
import { WaterLevel } from '@/types/report';

const labels: Record<WaterLevel, string> = {
  green: '🟢 Se cruza sin riesgo',
  yellow: '🟡 Cruzar con precaución',
  red: '🔴 No cruzar'
};

export const WaterLevelBadge = ({ level }: { level: WaterLevel }) => (
  <View style={[styles.badge, { backgroundColor: levelColors[level] }]}>
    <Text style={styles.text}>{labels[level]}</Text>
  </View>
);

const styles = StyleSheet.create({
  badge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 8
  },
  text: {
    color: '#0f172a',
    fontWeight: '700',
    fontSize: 12
  }
});
