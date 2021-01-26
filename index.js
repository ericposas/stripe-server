'use strict'
const express = require('express')
const httpErrors = require('http-errors')
const pino = require('pino')
const pinoHttp = require('pino-http')
const mongoose = require('mongoose')
const jwt = require('express-jwt')
const jwks = require('jwks-rsa')

module.exports = function main (options, cb) {
  // Set default options
  const ready = cb || function () {}
  const opts = Object.assign({
    // Default options
  }, options)

  const logger = pino()

  // Server state
  let server
  let serverStarted = false
  let serverClosing = false

  // Setup error handling
  function unhandledError (err) {
    // Log the errors
    logger.error(err)

    // Only clean up once
    if (serverClosing) {
      return
    }
    serverClosing = true

    // If server has started, close it down
    if (serverStarted) {
      server.close(function () {
        process.exit(1)
      })
    }
  }
  process.on('uncaughtException', unhandledError)
  process.on('unhandledRejection', unhandledError)

  // Create the express app
  const app = express()


  // Common middleware
  // app.use(/* ... */)
  app.use(pinoHttp({ logger }))
      
  // Register routes
  // @NOTE: require here because this ensures that even syntax errors
  // or other startup related errors are caught logged and debuggable.
  // Alternativly, you could setup external log handling for startup
  // errors and handle them outside the node process.  I find this is
  // better because it works out of the box even in local development.
  require('./routes')(app, opts)

  // app.use(require('body-parser'))

  app.use('/', express.static(__dirname + '/public'))
  app.use('*', express.static(__dirname + '/public'))
  // app.use('/success', express.static(__dirname + '/public'))

  // Common error handlers
  app.use(function fourOhFourHandler (req, res, next) {
    next(httpErrors(404, `Route not found: ${req.url}`))
  })
  app.use(function fiveHundredHandler (err, req, res, next) {
    if (err.status >= 500) {
      logger.error(err)
    }
    res.status(err.status || 500).json({
      messages: [{
        code: err.code || 'InternalServerError',
        message: err.message
      }]
    })
  })

  const jwtCheck = jwt({
        secret: jwks.expressJwtSecret({
            cache: true,
            rateLimit: true,
            jwksRequestsPerMinute: 5,
            jwksUri: 'https://gymwebapp.us.auth0.com/.well-known/jwks.json'
      }),
      audience: 'https://gymwebapp.us.auth0.com/',
      issuer: 'https://gymwebapp.us.auth0.com/',
      algorithms: ['RS256']
  })

  app.use(jwtCheck)

  // Connect to MongoDB, then
  mongoose.connect(`mongodb+srv://root:${process.env.MONGO_DB_PASSWORD}@cluster0.taijg.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`, { useNewUrlParser: true })
  mongoose.connection.once('open', () => {
    // Start server
    server = app.listen(opts.port, opts.host, function (err) {
      if (err) {
        return ready(err, app, server)
      }

      // If some other error means we should close
      if (serverClosing) {
        return ready(new Error('Server was closed before it could start'))
      }

      serverStarted = true
      const addr = server.address()
      logger.info(`Started at ${opts.host || addr.host || 'localhost'}:${addr.port}`)
      ready(err, app, server)
    })
  })
}

