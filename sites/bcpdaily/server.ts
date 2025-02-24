import type { BunRequest } from 'bun'
import path from 'path'
import * as bcp from './src/bcp'
import seo from './src/seo.json'

import { formatDate } from 'date-fns'
import Handlebars from 'handlebars'
const TZ_OFFSET = -4 * 60 * 60 * 1000

const port = Bun.env.PORT || 9000

console.log('Serving on port', port)

const serveStatic = (basePath: string) => {
  console.log('Serving static files from', basePath)
  return async function (req: BunRequest) {
    console.log('Request for file', req.url)
    const trimLeftRegex = new RegExp(`^/${basePath}/?`)
    let filePath = path.join(
      basePath,
      new URL(req.url).pathname.replace(trimLeftRegex, '')
    )

    const file = Bun.file(filePath)
    if (!(await file.exists())) {
      console.log(`File not found ${filePath}`)
      return new Response('Not found', { status: 404 })
    }
    // Does not currently work
    if ((await file.stat()).isDirectory()) {
      filePath = path.join(filePath, 'index.html')
    }

    console.log('Serving file', filePath)

    return new Response(file)
  }
}

const buildReply = async (date: Date) => {
  date.setTime(date.getTime() + TZ_OFFSET)
  const { readings, year, season, week, day } = await bcp.getDailyReadings(date)
  const params = {
    seo,
    readings,
    readingsJSON: JSON.stringify(readings, null, 2),
    year,
    season,
    week,
    day,
    date: formatDate(date, 'EEEE, d MMMM yyyy'),
  }

  const template = await Bun.file('./src/pages/index.hbs').text()
  const compiledTemplate = Handlebars.compile(template)
  return compiledTemplate(params)
}

const server = Bun.serve({
  development: Bun.env.BUN_ENV === 'dev',
  port,
  routes: {
    '/public/*': serveStatic('public'),
    '/': async () => {
      const today = new Date()
      const reply = await buildReply(today)

      return new Response(reply, {
        headers: {
          'Content-Type': 'text/html',
        },
      })
    },
  },
  error: (err) => {
    console.error(err)
    return new Response('Internal server error', { status: 500 })
  },
})
