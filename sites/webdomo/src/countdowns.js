const { countdowns } = require('../config')
const { parseISO } = require('date-fns/parseISO')
const { intervalToDuration } = require('date-fns/intervalToDuration')
const { formatDuration } = require('date-fns/formatDuration')

const getCountdownsData = () => {
  const now = new Date()
  const output = []

  for (const countdown of countdowns) {
    const countdownDate = parseISO(countdown.date)
    let start = now
    let end = countdownDate

    if (now > countdownDate) {
      start = countdownDate
      end = now
    }
    const duration = intervalToDuration({ start, end })

    output.push({
      duration:
        formatDuration({
          years: duration.years,
          months: duration.months,
          days: duration.days
        }) || '0 days',
      title: `${countdownDate > now ? 'until' : 'since'} ${countdown.title}`
    })
  }

  return {
    countdowns: output
  }
}

module.exports = getCountdownsData
