import { formatDate } from 'date-fns'

type Temperature = {
  value: number
  unit: string
}

export type Weather = {
  time: number
  lat: number
  lon: number
  current: {
    temperature: Temperature
    description: string
    icon: string
  }
  today: {
    description: string
    day: Temperature
    night: Temperature
    high: Temperature
    low: Temperature
    uvi: number
    chanceOfRain: number
    timeOfRain: string | null
  }
}

type APIWeather = Array<{
  id: number
  main: string
  description: string
  icon: string
}>

type APITimeFrame = {
  dt: number
  sunrise: number
  sunset: number
  temp: number
  feels_like: number
  pressure: number
  humidity: number
  dew_point: number
  uvi: number
  clouds: number
  visibility: number
  wind_speed: number
  wind_deg: number
  wind_gust: number
  weather: APIWeather
}

type APIHourly = APITimeFrame & {
  pop: number
}

type APIDaily = Omit<APITimeFrame, 'temp' | 'feelsLike' | 'description'> & {
  temp: {
    day: number
    min: number
    max: number
    night: number
    eve: number
    morn: number
  }
  feelsLike: {
    day: number
    night: number
    eve: number
    morn: number
  }
  summary: string
  pop: number
}

const weatherCache: Map<string, Weather> = new Map()

const KELVIN_OFFSET = 273.15

const convertTemp = (kelvin: number): Temperature => ({
  value: (kelvin - KELVIN_OFFSET) * (9 / 5) + 32,
  unit: 'F',
})

export class WeatherService {
  #apiKey: string
  lat: number
  lon: number

  constructor(apiKey: string, lat: number, lon: number) {
    this.#apiKey = apiKey
    this.lat = lat
    this.lon = lon
  }

  url() {
    return `https://api.openweathermap.org/data/3.0/onecall?lat=${this.lat}&lon=${this.lon}&lang=en&exclude=minutely&appid=${this.#apiKey}`
  }

  async getWeather(): Promise<Weather> {
    const now = Date.now()
    const cacheKey = `${this.lat},${this.lon}`
    const storedWeather = weatherCache.get(cacheKey)

    if (storedWeather && now - storedWeather.time < 30 * 60 * 1000) {
      return storedWeather
    }

    const response = await fetch(this.url())
    const data: {
      current: APITimeFrame
      daily: APIDaily[]
      hourly: APIHourly[]
    } = await response.json()

    const { current, daily, hourly } = data
    const currentWeather = current.weather[0]
    const today = daily[0]

    const timeOfRainDt = hourly.slice(0, 12).find((hour) => hour.pop > 0)?.dt
    const timeOfRain = timeOfRainDt
      ? formatDate(new Date(timeOfRainDt * 1000), 'HH:mm')
      : null

    const weather = {
      time: now,
      lat: this.lat,
      lon: this.lon,
      current: {
        temperature: convertTemp(current.temp),
        description: currentWeather.description,
        icon: currentWeather.icon,
      },
      today: {
        description: today.summary,
        day: convertTemp(today.temp.day),
        night: convertTemp(today.temp.night),
        high: convertTemp(today.temp.max),
        low: convertTemp(today.temp.min),
        uvi: today.uvi,
        chanceOfRain: today.pop,
        timeOfRain,
      },
    }

    weatherCache.set(cacheKey, weather)
    return weather
  }
}
