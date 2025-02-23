const { MINUTES } = require('./util')
const {
  weather: weatherConfig,
  language,
  defaultLat,
  defaultLng,
} = require('../config')
const { format: formatDate } = require('date-fns/format')
const fetch = require('node-fetch')

const KELVIN = 273.15
const STORE_KEY = 'storedWeather'

const store = new Map()

const getWeather = async (latitude, longitude) => {
  const now = Date.now()
  const storedWeather = store.get(STORE_KEY)

  if (
    storedWeather &&
    storedWeather.lat === latitude &&
    storedWeather.lng === longitude &&
    storedWeather.time &&
    now - storedWeather.time < 5 * MINUTES
  ) {
    return storedWeather.results
  }

  const api = `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&lang=${language}&exclude=minutely,hourly&appid=${process.env.WEATHER_API_KEY}`
  const response = await fetch(api)
  const data = await response.json()
  const celsius = Math.floor(data.current.temp - KELVIN)
  const results = {
    temperature: {
      unit: weatherConfig.unit,
    },
  }
  results.temperature.value =
    results.unit === 'C' ? celsius : (celsius * 9) / 5 + 32
  results.description = data.current.weather[0].description
  results.iconId = data.current.weather[0].icon

  const weatherToStore = {
    lat: latitude,
    lng: longitude,
    time: now,
    results,
  }

  store.set(STORE_KEY, weatherToStore)

  return results
}

const weatherIconMap = {
  '01d': 'sun',
  '01n': 'moon',
  '02d': 'cloud-sun',
  '02n': 'cloud-moon',
  '03d': 'cloud',
  '03n': 'cloud',
  '04d': 'cloudy',
  '04n': 'cloudy',
  '09d': 'cloud-rain',
  '09n': 'cloud-rain',
  '10d': 'cloud-rain',
  '10n': 'cloud-rain',
  '11d': 'cloud-lightning',
  '11n': 'cloud-lightning',
  '50d': 'wind',
  '50n': 'wind',
}

const getWeatherData = async () => {
  const weather = await getWeather(defaultLat, defaultLng)
  const now = new Date()

  return {
    weather,
    weatherIcon: weatherIconMap[weather.iconId] || 'cloud-off',
    weatherConfig,
    formattedDate: formatDate(now, 'iii MMM do'),
  }
}

module.exports = getWeatherData
