import { endOfDay, formatDate, startOfDay } from 'date-fns'
import { getWeather } from './src/weather'
import {
  cndCalendarId,
  getCalendarEvents,
  kidsCalendarId,
} from './src/calendar'
import type { ResponseBody } from './src/types'
import { transformResponseBodyToSyncsignTemplate } from './src/syncsign'
import { info } from './src/logger'

const config = {
  defaultLat: 36.074,
  defaultLng: -78.894,
  timezone: 'America/New_York',
  calendars: [
    ['Clinton', cndCalendarId],
    ['Kids', kidsCalendarId],
  ],
}

const buildResponseBody: () => Promise<ResponseBody> = async () => {
  const now = new Date()
  const startDate = startOfDay(now)
  const endDate = endOfDay(now)
  const currentTime = now

  // Get all events for today from Google Calendar
  // Get current weather
  const weather = await getWeather(config.defaultLat, config.defaultLng)

  const calendars = await Promise.all(
    config.calendars.map(async ([name, calendarId]) => ({
      name,
      events: await getCalendarEvents(calendarId, startDate, endDate),
    }))
  )

  return {
    currentTime,
    date: formatDate(now, 'EEE, d MMM yyyy'),
    weather,
    calendars,
  }
}

const port = Bun.env.PORT || 9000

console.log('Serving on port', port)

const server = Bun.serve({
  development: Bun.env.BUN_ENV === 'dev',
  port,
  routes: {
    '/': {
      GET: async () => {
        console.log('GET /')
        const body = await buildResponseBody()
        return Response.json(body)
      },
    },
    '/renders/node/:nodeId': {
      GET: async (req) => {
        info(`GET /renders/node/${req.params.nodeId}`)

        const nodeId = req.params.nodeId
        const renderId = Bun.randomUUIDv7()

        info(
          'Generating SyncSign template for node',
          nodeId,
          'using render id',
          renderId
        )
        const body = await buildResponseBody()
        const content = transformResponseBodyToSyncsignTemplate(body)
        return Response.json({
          code: 200,
          data: [
            {
              renderId,
              nodeId,
              isRendered: false,
              content,
            },
          ],
        })
      },
    },
    '/renders/id/:renderId': async (req) => {
      info(`PUT /renders/id/${req.params.renderId}`)
      return Response.json({ code: 204 })
    },
  },
})
