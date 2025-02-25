import type { calendar_v3 } from '@googleapis/calendar'

export interface CalendarEvent {
  allDayEvent: boolean
  summary?: string | null
  start?: calendar_v3.Schema$EventDateTime
  end?: calendar_v3.Schema$EventDateTime
}

export interface ResponseBody {
  currentTime: Date
  date: string
  weather: any
  calendars: {
    name: string
    events: CalendarEvent[]
  }[]
}
