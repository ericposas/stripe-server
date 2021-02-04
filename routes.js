'use strict'

// const checkoutSession = require('./handlers/checkoutSession')
const getProduct = require('./handlers/getProduct')
const getListOfProducts = require('./handlers/getListOfProducts')
const getCheckoutSessionData = require('./handlers/getCheckoutSessionData')
const jsonParser = require('express').json()
const setupClassPayment = require('./handlers/setupClassPayment')
const attachPaymentMethodToCustomer = require('./handlers/attachPaymentMethodToCustomer')
const createStripeCustomer = require('./handlers/createStripeCustomer')
const patchCustomerDataToStripe = require('./handlers/patchCustomerDataToStripe')
const stripeWebHook = require('./handlers/webhook')
const { clientToken } = require('./handlers/getAuthToken')
const postUserAddressData = require('./handlers/postUserAddressData')
const processSubscriptions = require('./handlers/processSubscriptions')
// const bodyParser = require('body-parser')
// const validateAddressRoute = require('./handlers/validateAddressRoute')
require('dotenv').config()

module.exports = function (app, opts) {

  // Stripe
  // app.post('/create-checkout-session', jsonParser, checkoutSession)
  app.patch('/update-user-data-to-stripe', jsonParser, patchCustomerDataToStripe)
  app.post('/get-products', jsonParser, getProduct)
  app.get('/get-list-of-products', jsonParser, getListOfProducts)
  app.post('/get-checkout-session', jsonParser, getCheckoutSessionData)
  app.post('/setup-payment-for-classes', jsonParser, setupClassPayment)
  app.post('/create-stripe-customer', jsonParser, createStripeCustomer)
  app.post('/attach-payment-method', jsonParser, attachPaymentMethodToCustomer)
  app.post('/post-user-address-data', jsonParser, postUserAddressData)
  app.post('/process-subscriptions', jsonParser, processSubscriptions)
  // Stripe Webhooks
  app.post('/stripe-webhook', jsonParser, stripeWebHook)
  
  // Auth0 
  app.post('/retrieve-api-token', jsonParser, clientToken)

}
