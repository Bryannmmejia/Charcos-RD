interface WeatherResponse {
  current?: {
    temperature_2m: number;
    rain: number;
    weather_code: number;
  };
}

export const fetchWeather = async (lat: number, lng: number) => {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lng),
    current: 'temperature_2m,rain,weather_code'
  });

  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);
  if (!response.ok) {
    throw new Error('No se pudo obtener el clima actual');
  }

  const data = (await response.json()) as WeatherResponse;
  return data.current;
};
