const {
  use12HourTime,
  defaultLat,
  defaultLng,
  greetings,
  name,
  timezone
} = require('../config')
const SunCalc = require('suncalc')
const { MINUTES } = require('./util')
const { toZonedTime } = require('date-fns-tz')

const greetingForTime = (now) => {
  const times = SunCalc.getTimes(now, defaultLat, defaultLng)

  let greeting
  if (now < times.dawn) {
    greeting = greetings.beforeDawn
  } else if (now < times.solarNoon) {
    greeting = greetings.morning
  } else if (now < times.sunsetStart) {
    greeting = greetings.afternoon
  } else if (now < times.night + 60 * MINUTES) {
    // night + 1 hr
    greeting = greetings.evening
  } else {
    greeting = greetings.night
  }

  return greeting
}

const formattedTime = (now) => {
  now = toZonedTime(now, timezone)
  return now.toLocaleTimeString([], {
    hour12: use12HourTime,
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getGreetingData = () => {
  const now = new Date()
  return {
    greeting: `${greetingForTime(now)}, ${name}!`,
    formattedTime: formattedTime(now)
  }
}

module.exports = getGreetingData
