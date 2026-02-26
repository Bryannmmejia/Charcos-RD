import React from 'react';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { HomeScreen } from '@/screens/HomeScreen';
import { ReportScreen } from '@/screens/ReportScreen';
import { VehicleProfileScreen } from '@/screens/VehicleProfileScreen';
import { useSettingsStore } from '@/store/settingsStore';

import { RootStackParamList } from '@/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const darkMode = useSettingsStore((state) => state.darkMode);

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={darkMode ? DarkTheme : DefaultTheme}>
        <StatusBar style={darkMode ? 'light' : 'dark'} />
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Charcos RD' }} />
          <Stack.Screen name="Report" component={ReportScreen} options={{ title: 'Reportar charco' }} />
          <Stack.Screen name="VehicleProfile" component={VehicleProfileScreen} options={{ title: 'Mi vehículo' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
