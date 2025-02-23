/**
 * This is the main Node.js server script for your project
 */

const path = require("path")
const bcp = require("./src/bcp")
const formatDate = require('date-fns/format')
const TZ_OFFSET = -4 * 60 * 60 * 1000;

// Require the fastify framework and instantiate it
const fastify = require("fastify")({
  // Set this to true for detailed logging:
  logger: false,
})

// Setup our static files
fastify.register(require("fastify-static"), {
  root: path.join(__dirname, "public"),
  prefix: "/", // optional: default '/'
})

// point-of-view is a templating manager for fastify
fastify.register(require("point-of-view"), {
  engine: {
    handlebars: require("handlebars"),
  },
})

// Load and parse SEO data
const seo = require("./src/seo.json")
if (seo.url === "glitch-default") {
  seo.url = `https://${process.env.PROJECT_DOMAIN}.glitch.me`
}

/**
 * Our home page route
 *
 * Returns src/pages/index.hbs with data built into it
 */
fastify.get("/", async function (request, reply) {
  // params is an object we'll pass to our handlebars template
  const today = new Date()
  today.setTime(today.getTime() + TZ_OFFSET)
  const { readings, year, season, week, day } = await bcp.getDailyReadings(
    today
  )
  const params = {
    seo,
    readings,
    readingsJSON: JSON.stringify(readings, null, 2),
    year,
    season,
    week,
    day,
    date: formatDate(today, 'EEEE, d MMMM yyyy')
  }

  // The Handlebars code will be able to access the parameter values and build them into the page
  reply.view("/src/pages/index.hbs", params)
})

fastify.get("/date/:year(^\\d{4})/:month(^\\d{2})/:day(^\\d{2})/", async function (request, reply) {
  // params is an object we'll pass to our handlebars template
  const date = new Date(request.params.year, parseInt(request.params.month, 10) - 1, request.params.day)
  const { readings, year, season, week, day } = await bcp.getDailyReadings(
    date
  )
  const params = {
    seo,
    readings,
    readingsJSON: JSON.stringify(readings, null, 2),
    year,
    season,
    week,
    day,
    date: formatDate(date, 'EEEE, d MMMM yyyy')
  }

  // The Handlebars code will be able to access the parameter values and build them into the page
  reply.view("/src/pages/index.hbs", params)
})

// Run the server and report out to the logs
fastify.listen(process.env.PORT, "0.0.0.0", function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  console.log(`Your app is listening on ${address}`)
  fastify.log.info(`server listening on ${address}`)
})
