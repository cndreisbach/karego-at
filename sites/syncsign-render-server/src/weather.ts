import { WeatherService } from '@karego-at/weather'

export const getWeather = async (latitude: number, longitude: number) => {
  const weatherService = new WeatherService(
    process.env.WEATHER_API_KEY || '',
    latitude,
    longitude
  )

  return weatherService.getWeather()
}

export const weatherIconMap: Record<string, string> = {
  // Icons returned are Unicode characters for https://erikflowers.github.io/weather-icons/
  // 01d / 01n - clear sky
  // 02d / 02n - few clouds
  // 03d / 03n - scattered clouds
  // 04d / 04n - broken clouds
  // 09d / 09n - shower rain
  // 10d / 10n - rain
  // 11d / 11n - thunderstorm
  // 13d / 13n - snow
  // 50d / 50n - mist
  '01d': '\uf00d',
  '02d': '\uf002',
  '03d': '\uf041',
  '04d': '\uf013',
  '09d': '\uf009',
  '10d': '\uf008',
  '11d': '\uf010',
  '13d': '\uf01b',
  '50d': '\uf014',
  '01n': '\uf02e',
  '02n': '\uf031',
  '03n': '\uf041',
  '04n': '\uf013',
  '09n': '\uf029',
  '10n': '\uf028',
  '11n': '\uf02c',
  '13n': '\uf02a',
  '50n': '\uf014',
}
