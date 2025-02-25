import { MINUTES } from './util'

const store = new Map()
const STORE_KEY = 'storedWeather'
const KELVIN = 273.15
const TIME_TO_CACHE_WEATHER = 30 * MINUTES

const weatherConfig = {
  icons: 'Nord',
  unit: 'F',
}

export const getWeather = async (latitude: number, longitude: number) => {
  const now = Date.now()
  const storedWeather = store.get(STORE_KEY)

  if (
    storedWeather &&
    storedWeather.lat === latitude &&
    storedWeather.lng === longitude &&
    storedWeather.time &&
    now - storedWeather.time < TIME_TO_CACHE_WEATHER
  ) {
    return storedWeather.results
  }

  const api = `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&lang=en&exclude=minutely,hourly&appid=${process.env.WEATHER_API_KEY}`
  const response = await fetch(api)
  const data = await response.json()
  const celsius = Math.floor(data.current.temp - KELVIN)
  const currentWeather = data.current.weather[0]
  const weatherId = currentWeather.id
  const icon = iconMap[currentWeather.icon]
  const results: {
    icon: string
    unit: string
    value?: number
    description?: string
  } = {
    icon,
    unit: weatherConfig.unit,
  }
  results.value = results.unit === 'C' ? celsius : (celsius * 9) / 5 + 32
  results.description = currentWeather.description

  const weatherToStore = {
    lat: latitude,
    lng: longitude,
    time: now,
    results,
  }

  store.set(STORE_KEY, weatherToStore)

  return results
}

const iconMap: Record<string, string> = {
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
