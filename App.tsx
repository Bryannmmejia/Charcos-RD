import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { HomeScreen } from '@/screens/HomeScreen';
import { ReportScreen } from '@/screens/ReportScreen';
import { VehicleProfileScreen } from '@/screens/VehicleProfileScreen';

import { RootStackParamList } from '@/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

const customDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#020617',
    card: '#0b1228',
    border: '#1e293b',
    primary: '#3b82f6',
    text: '#f8fafc'
  }
};

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer theme={customDarkTheme}>
        <StatusBar style="light" />
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Report" component={ReportScreen} options={{ title: 'Reportar inundación' }} />
          <Stack.Screen name="VehicleProfile" component={VehicleProfileScreen} options={{ title: 'Mi vehículo' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
