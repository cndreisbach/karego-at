import { formatDate, parseISO } from 'date-fns'
import type { ResponseBody } from './types'

// width = 800, height = 480

type TemplateColor = 'WHITE' | 'BLACK' | 'RED'
type TemplateFont =
  | 'ROBOTO_SLAB_24'
  | 'ROBOTO_SLAB_48'
  | 'ROBOTO_CONDENSED_24'
  | 'KAUSHAN_SCRIPT_20'
  | 'KAUSHAN_SCRIPT_32'
  | 'DDIN_CONDENSED_16'
  | 'DDIN_CONDENSED_24'
  | 'DDIN_CONDENSED_32'
  | 'DDIN_CONDENSED_48'
  | 'DDIN_CONDENSED_64'
  | 'DDIN_16'
  | 'DDIN_24'
  | 'DDIN_32'
  | 'DDIN_48'
  | 'DDIN_64'
  | 'DDIN_128'
  | 'SRIRACHA_24'
  | 'YANONE_KAFFEESATZ_24_B'
  | 'YANONE_KAFFEESATZ_44_B'
  | 'ICON_WEATHER'

interface TemplateRectangleData {
  strokeThickness: number
  strokeColor?: TemplateColor
  fillColor?: TemplateColor
  block: {
    x: number
    y: number
    w: number
    h: number
  }
}

interface TemplateBackground {
  bgColor: TemplateColor
  enableButtonZone: boolean
  rectangle?: TemplateRectangleData
}

interface TemplateTextItem {
  type: 'TEXT'
  data: {
    text: string
    id?: string
    textColor?: TemplateColor
    backgroundColor?: TemplateColor
    font: TemplateFont
    textAlign?: 'LEFT' | 'CENTER' | 'RIGHT'
    lineSpace?: number
    block: {
      x: number
      y: number
      w: number
      h: number
    }
    offset?: {
      x: number
      y: number
    }
  }
}

export function textItem(
  text: string,
  font: TemplateFont,
  block: { x: number; y: number; w: number; h: number },
  data: {
    textColor?: TemplateColor
    backgroundColor?: TemplateColor
    textAlign?: 'LEFT' | 'CENTER' | 'RIGHT'
    lineSpace?: number
    offset?: {
      x: number
      y: number
    }
  } = {}
): TemplateTextItem {
  return {
    type: 'TEXT',
    data: {
      text,
      font,
      block,
      ...data,
    },
  }
}

interface TemplateRectangleItem {
  type: 'RECTANGLE'
  data: TemplateRectangleData
}

function rectangleItem(
  block: { x: number; y: number; w: number; h: number },
  strokeThickness = 1,
  strokeColor: TemplateColor = 'BLACK',
  fillColor: TemplateColor = 'WHITE'
): TemplateRectangleItem {
  return {
    type: 'RECTANGLE',
    data: {
      block,
      strokeThickness,
      strokeColor,
      fillColor,
    },
  }
}

interface TemplateQRCodeItem {
  type: 'QRCODE'
  data: {
    text: string
    position: {
      x: number
      y: number
    }
    // The magnification of the original size (default = 4).
    // 2-6
    scale?: number
    // Determines the original size of the QR code (default = 2).
    // The width and height of a QR code are always equal (it is
    // square) and are equal to (4 * version + 17) * scale
    // 1-10
    version?: number
    eccLevel?: 'LOW' | 'MEDIUM' | 'QUARTILE' | 'HIGH'
  }
}

type TemplateItem =
  | TemplateTextItem
  | TemplateRectangleItem
  | TemplateQRCodeItem

interface SyncsignTemplate {
  background?: TemplateBackground
  items: TemplateItem[]
}

const u = (x: number) => x * 8

export const makeCalendarEventTextItems = (
  position: number,
  event: {
    calendar: string
    summary: string
    allDayEvent: boolean
    start: string
    end: string
  }
) => {
  const x = u(52)
  const y = u(2 + position * 8)

  const items = [
    textItem(
      event.calendar,
      'ROBOTO_CONDENSED_24',
      {
        x,
        y,
        w: u(9),
        h: u(4),
      },
      {
        backgroundColor: 'RED',
        textColor: 'WHITE',
        textAlign: 'CENTER',
      }
    ),
    textItem(event.summary, 'ROBOTO_CONDENSED_24', {
      x: x + u(10),
      y,
      w: u(39),
      h: u(4),
    }),
  ]

  if (event.allDayEvent) {
    items.push(
      textItem('All day', 'ROBOTO_CONDENSED_24', {
        x: x + u(10),
        y: y + u(4),
        w: u(39),
        h: u(3),
      })
    )
  } else {
    const formattedStart = formatDate(parseISO(event.start), 'HH:mm')
    const formattedEnd = formatDate(parseISO(event.end), 'HH:mm')

    items.push(
      textItem(`${formattedStart} - ${formattedEnd}`, 'ROBOTO_CONDENSED_24', {
        x: x + u(10),
        y: y + u(4),
        w: u(39),
        h: u(3),
      })
    )
  }

  return items
}

export const transformResponseBodyToSyncsignTemplate = (
  body: ResponseBody
): SyncsignTemplate => {
  const { date, weather, calendars } = body

  const calendarEvents = calendars.flatMap(({ name, events }) =>
    events.map((event) => ({
      calendar: name,
      summary: event.summary || '',
      allDayEvent: event.allDayEvent,
      start: event.start?.dateTime || '',
      end: event.end?.dateTime || '',
    }))
  )

  const calendarItems = calendarEvents.flatMap((event, index) =>
    makeCalendarEventTextItems(index, event)
  )

  return {
    background: {
      bgColor: 'WHITE',
      enableButtonZone: false,
    },
    items: [
      // rectangleItem(
      //   {
      //     x: u(0),
      //     y: u(0),
      //     w: u(50),
      //     h: u(60),
      //   },
      //   4
      // ),
      textItem(date, 'DDIN_48', {
        x: u(1),
        y: u(1),
        w: u(48),
        h: u(7),
      }),
      textItem(weather.icon, 'ICON_WEATHER', {
        x: u(1),
        y: u(8),
        w: u(8),
        h: u(8),
      }),
      textItem(
        `${weather.value}°${weather.unit} ${weather.description}`,
        'DDIN_CONDENSED_32',
        {
          x: u(9),
          y: u(10),
          w: u(40),
          h: u(5),
        }
      ),
      ...calendarItems,
    ],
  }
}
