import type { calendar_v3 } from '@googleapis/calendar'
import type { Weather } from '@karego-at/weather'
export interface CalendarEvent {
  allDayEvent: boolean
  summary?: string | null
  start?: calendar_v3.Schema$EventDateTime
  end?: calendar_v3.Schema$EventDateTime
}

export interface ResponseBody {
  currentTime: Date
  date: string
  weather: Weather
  calendars: {
    name: string
    events: CalendarEvent[]
  }[]
}
