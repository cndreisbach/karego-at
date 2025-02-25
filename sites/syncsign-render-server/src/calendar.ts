import { calendar, auth, calendar_v3 } from '@googleapis/calendar'
import { formatRFC3339 } from 'date-fns'
import type { CalendarEvent } from './types'

function getGAuth() {
  if (process.env['GOOGLE_APPLICATION_CREDENTIALS']) {
    return new auth.GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
    })
  }

  const credsEnvVar = process.env['KAREGO_GOOGLE_CREDS']
  if (!credsEnvVar) {
    throw new Error(
      'The $KAREGO_GOOGLE_CREDS environment variable was not found!'
    )
  }
  const credentials = JSON.parse(credsEnvVar)

  return new auth.GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
    credentials: credentials,
  })
}

const gCal = calendar({
  version: 'v3',
  auth: getGAuth(),
})

export const cndCalendarId = 'crnixon@gmail.com'
export const kidsCalendarId =
  '837cd294d29557b4f24d1749e2a7b8121cfafb3ae2f2efaf78305d1d83deaaad@group.calendar.google.com'

async function getCalendarEventData(
  calendarId: string,
  startTime: Date,
  endTime: Date
): Promise<calendar_v3.Schema$Events> {
  const timeMin = formatRFC3339(startTime)
  const timeMax = formatRFC3339(endTime)

  const response = await gCal.events.list({
    calendarId,
    timeMin,
    timeMax,
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  })

  return response.data
}

function formatCalendarEvents(
  events: calendar_v3.Schema$Event[]
): CalendarEvent[] {
  return (events || []).map((event) => {
    const allDayEvent = Boolean(!event.start?.dateTime && event.start?.date)
    return {
      allDayEvent,
      summary: event.summary,
      start: event.start,
      end: event.end,
    }
  })
}

export async function getCalendarEvents(
  calendarId: string,
  startTime: Date,
  endTime: Date
) {
  let { items: events } = await getCalendarEventData(
    calendarId,
    startTime,
    endTime
  )

  return formatCalendarEvents(
    (await getCalendarEventData(calendarId, startTime, endTime)).items || []
  )
}

export function sortCalendarEvents(events: CalendarEvent[]) {
  return events.toSorted((a, b) => {
    const aStart = (a.start?.dateTime || a.start?.date) as string
    const bStart = (b.start?.dateTime || b.start?.date) as string

    return aStart.localeCompare(bStart)
  })
}
