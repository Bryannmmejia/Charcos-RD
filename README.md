# Charcos RD (MVP)

Aplicación móvil estilo Waze, enfocada en alertas de inundaciones y charcos para República Dominicana.

## Funcionalidades incluidas

- 🗺️ **Mapa interactivo** con marcadores por nivel de agua (verde, amarillo, rojo).
- 🌧️ **Reportes comunitarios** con:
  - Ubicación GPS exacta.
  - Nivel del agua.
  - Hora del reporte.
  - Tipo de vehículo recomendado.
- 👥 **Validación comunitaria** (confirmar/rechazar reporte).
- ⏳ **Expiración automática** de reportes tras 2 horas.
- 🚘 **Perfil de vehículo** para avisos personalizados.
- ☁️ **Integración de clima en tiempo real** y modo alerta con lluvia.
- 🌙 **Modo oscuro** y diseño minimalista.

## Stack técnico

- **React Native + Expo + TypeScript**
- **Firebase Firestore** para reportes en tiempo real
- **expo-location** para geolocalización
- **react-native-maps** para la visualización del mapa
- **Zustand** para estado local/global

## Configuración rápida

1. Instala dependencias:

```bash
npm install
```

2. Configura variables de entorno para Firebase (ejemplo en `.env`):

```env
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
```

3. Ejecuta la app:

```bash
npm run start
```

## Próximos pasos sugeridos

- Navegación GPS con voz (Google Directions/Mapbox).
- Push notifications reales con Firebase Cloud Messaging.
- Carga de fotos opcionales con Firebase Storage.
- Sistema de reputación de usuarios y anti-spam.
- Motor de rutas que evite reportes rojos de alta confiabilidad.
