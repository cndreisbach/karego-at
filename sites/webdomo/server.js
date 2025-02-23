/**
 * This is the main Node.js server script for your project
 * Check out the two endpoints this back-end API provides in fastify.get and fastify.post below
 */

const path = require('path')
const { formatDate } = require('date-fns/format')

const getGreetingData = require('./src/greeting')
const getWeatherData = require('./src/weather')
const getCountdownsData = require('./src/countdowns')
const config = require('./config')

const fastify = require('fastify')({
  logger: true,
})

// Setup our static files
fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, 'public'),
  prefix: '/public/', // optional: default '/'
})

// point-of-view is a templating manager for fastify
fastify.register(require('@fastify/view'), {
  engine: {
    pug: require('pug'),
  },
})

fastify.get('/', function (request, reply) {
  const now = new Date()

  const params = {
    seo,
    formattedDate: formatDate(now, 'iii MMM do'),
    bookmarkGroups1: config.bookmarkGroups1,
    bookmarkGroups2: config.bookmarkGroups2,
    ...getGreetingData(),
    ...getCountdownsData(),
    footer: {
      git_sha: process.env.CAPROVER_GIT_COMMIT_SHA,
    },
  }

  // The Handlebars code will be able to access the parameter values and build them into the page
  reply.view('/src/pages/index.pug', params)
})

fastify.get('/_/greeting/', function (request, reply) {
  const params = getGreetingData()
  reply.view('/src/pages/partials/greeting.pug', params)
})

fastify.get('/_/weather/', async function (request, reply) {
  const params = await getWeatherData()
  return reply.view('/src/pages/partials/weather.pug', params)
})

// Run the server and report out to the logs
// A HEAD request to the /example endpoint will automatically respond with the same headers as the GET request.
fastify.listen(
  { port: process.env.PORT, host: '0.0.0.0' },
  function (err, address) {
    if (err) {
      fastify.log.error(err)
      process.exit(1)
    }
    console.log(`Your app is listening on ${address}`)
    fastify.log.info(`server listening on ${address}`)
  }
)
