'use strict'

// const checkoutSession = require('./handlers/checkoutSession')
const getProduct = require('./handlers/getProduct')
const getListOfProducts = require('./handlers/getListOfProducts')
const getCheckoutSessionData = require('./handlers/getCheckoutSessionData')
const jsonParser = require('express').json()
const processClassPayment = require('./handlers/processClassPayment')
const attachPaymentMethodToCustomer = require('./handlers/attachPaymentMethodToCustomer')
const createStripeCustomer = require('./handlers/createStripeCustomer')
const { clientToken } = require('./handlers/getAuthToken')
require('dotenv').config()

module.exports = function (app, opts) {

  // Stripe
  // app.post('/create-checkout-session', jsonParser, checkoutSession)
  app.post('/get-products', jsonParser, getProduct)
  app.get('/get-list-of-products', jsonParser, getListOfProducts)
  app.post('/get-checkout-session', jsonParser, getCheckoutSessionData)
  app.post('/process-payment-for-classes', jsonParser, processClassPayment)
  app.post('/create-stripe-customer', jsonParser, createStripeCustomer)
  app.post('/attach-payment-method', jsonParser, attachPaymentMethodToCustomer)
  
  // Auth0 
  app.post('/retrieve-api-token', jsonParser, clientToken)

}
