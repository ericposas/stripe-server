'use strict'
// const simple = require('./handlers/simple')
// const configured = require('./handlers/configured')
const checkoutSession = require('./handlers/checkoutSession')
const getProduct = require('./handlers/getProduct')
const getListOfProducts = require('./handlers/getListOfProducts')
const getCheckoutSessionData = require('./handlers/getCheckoutSessionData')
const postStudentData = require('./handlers/postStudentData')
// const bodyParser = require('body-parser')
// const urlencodedParser = bodyParser.urlencoded({ extended: true })
const jsonParser = require('express').json()
const fetch = require('node-fetch')
require('dotenv').config()

module.exports = function (app, opts) {
  // Setup routes, middleware, and handlers
  // app.get('/configured', configured(opts))
  app.post('/create-checkout-session', jsonParser, checkoutSession)
  app.post('/get-products', jsonParser, getProduct)
  app.get('/get-list-of-products', jsonParser, getListOfProducts)
  app.post('/get-checkout-session', jsonParser, getCheckoutSessionData)
  app.post('/post-student-data', jsonParser, postStudentData)
  app.post('/retrieve-api-token', jsonParser, (req, res) => {
    let url = 'https://gymwebapp.us.auth0.com/oauth/token'
    let options = {
      method: 'POST',
      url: 'https://gymwebapp.us.auth0.com/oauth/token',
      headers: { 'content-type': 'application/json' },
      body: `{
        "client_id":"${process.env.AUTH0_JWT_CONFIG_CLIENT_ID}",
        "client_secret":"${process.env.AUTH0_JWT_CONFIG_CLIENT_SECRET}",
        "audience":"https://gymwebapp.us.auth0.com/api/v2/",
        "grant_type":"client_credentials"
      }`
    }

    fetch(url, options)
    .then(response => response.json())
    .then(body => {
      res.json(body)
    })
    .catch(err => console.log(err))
  })
}
