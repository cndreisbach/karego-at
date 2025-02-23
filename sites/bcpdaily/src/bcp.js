const lectionary = require('daily-office-lectionary')
const dateFormat = require('date-fns/format')
const dateSub = require('date-fns/sub')
const dateAdd = require('date-fns/add')
const differenceInWeeks = require('date-fns/differenceInWeeks')
const nextSunday = require('date-fns/nextSunday')
const previousSunday = require('date-fns/previousSunday')
const nextMonday = require('date-fns/nextMonday')

const getAdvent = year => {
  //in javascript months are zero-indexed. january is 0, december is 11
  const xmasEve = new Date(year, 11, 24)
  return dateSub(xmasEve, { weeks: 3, days: xmasEve.getDay() })
}

const getEaster = year => {
  // https://en.wikipedia.org/wiki/Date_of_Easter#Anonymous_Gregorian_algorithm
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b - 8) / 25)
  const g = Math.floor((8 * b + 13) / 25)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 19 * l) / 433)
  const n = Math.floor((h + l - 7 * m + 90) / 25)
  const p = (h + l - 7 * m + 33 * n + 19) % 32

  return new Date(year, 3, p)
}

const getPentecost = year => {
  return dateAdd(getEaster(year), { weeks: 7 })
}

const getLent = year => {
  const easter = getEaster(year)
  return dateSub(easter, { weeks: 6, days: 4 })
}

const getDailyReadingYear = date => {
  const year = date.getFullYear()
  const advent = getAdvent(year)
  if (date >= advent) {
    return year % 2 == 0 ? 'Year One' : 'Year Two'
  } else {
    return year % 2 == 0 ? 'Year Two' : 'Year One'
  }
}

const getSeason = date => {
  const year = date.getFullYear()
  const xmas = new Date(year, 11, 25)
  const epiphany = new Date(year, 0, 6)

  if (date < epiphany || date >= xmas) {
    return 'Christmas'
  } else if (date < getLent(year)) {
    return 'Epiphany'
  } else if (date < getEaster(year)) {
    return 'Lent'
  } else if (date <= getPentecost(year)) {
    return 'Easter'
  } else if (date < getAdvent(year)) {
    return 'The Season after Pentecost'
  } else if (date < xmas) {
    return 'Advent'
  }
}

const getWeek = date => {
  const year = date.getFullYear()

  const season = getSeason(date)

  if (season === 'Advent') {
    const advent = getAdvent(year)
    const weeksSinceAdvent = differenceInWeeks(date, advent)
    return `Week of ${weeksSinceAdvent + 1} Advent`
  }

  if (season === 'Christmas') {
    return 'Christmas Day and Following'
  }

  if (season === 'Epiphany') {
    const firstSundayAfterEpiphany = nextSunday(new Date(year, 0, 6))
    const lent = getLent(year)

    if (date < firstSundayAfterEpiphany) {
      return 'The Epiphany and Following'
    }

    if (date >= previousSunday(lent)) {
      return 'Week of Last Epiphany'
    }

    const weeksSinceFSAEpiphany = differenceInWeeks(
      date,
      firstSundayAfterEpiphany
    )

    return `Week of ${weeksSinceFSAEpiphany + 1} Epiphany`
  }

  if (season === 'Lent') {
    const lent = getLent(year)
    const sundayAfterLent = nextSunday(lent)
    if (date < sundayAfterLent) {
      return 'Ash Wednesday and Following'
    }

    const easter = getEaster(year)
    if (date >= previousSunday(easter)) {
      return 'Holy Week'
    }

    const weeksSinceFSALent = differenceInWeeks(date, sundayAfterLent)

    return `Week of ${weeksSinceFSALent + 1} Lent`
  }

  if (season === 'Easter') {
    const sundayAfterEaster = nextSunday(getEaster(year))
    if (date < sundayAfterEaster) {
      return 'Easter Week'
    }

    if (date >= getPentecost(year)) {
      return 'Pentecost'
    }

    const weeksSinceFSAEaster = differenceInWeeks(date, sundayAfterEaster)
    return `Week of ${weeksSinceFSAEaster + 2} Easter`
  }

  if (season === 'The Season after Pentecost') {
    const startOfProperWeeks = nextSunday(getPentecost(year))
    // for whatever reason, Proper doesn't start until Monday

    if (date < nextMonday(startOfProperWeeks)) {
      return
    }

    const properWeek = differenceInWeeks(date, startOfProperWeeks) + 1
    return `Proper ${properWeek}`
  }
}

const getDailyReadings = async (date) => {
  const year = getDailyReadingYear(date)
  const season = getSeason(date)
  const week = getWeek(date)
  const day = dateFormat(date, 'eeee')

  const readings = await lectionary.get({
    year,
    season,
    week,
    day
  })  

  return { readings, year, season, week, day }
}

module.exports = {
  getDailyReadingYear, getSeason, getWeek, getDailyReadings
}