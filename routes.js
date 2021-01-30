'use strict'
// const simple = require('./handlers/simple')
// const configured = require('./handlers/configured')
const checkoutSession = require('./handlers/checkoutSession')
const getProduct = require('./handlers/getProduct')
const getListOfProducts = require('./handlers/getListOfProducts')
const getCheckoutSessionData = require('./handlers/getCheckoutSessionData')
// const postStudentData = require('./handlers/postStudentData')
// const bodyParser = require('body-parser')
// const urlencodedParser = bodyParser.urlencoded({ extended: true })
const jsonParser = require('express').json()
const fetch = require('node-fetch')
const { json } = require('body-parser')
const Stripe = require('stripe')
const stripe = Stripe(process.env.STRIPE_TEST_SECRET_KEY)
require('dotenv').config()

module.exports = function (app, opts) {
  // Setup routes, middleware, and handlers
  // app.get('/configured', configured(opts))
  
  // Stripe
  app.post('/create-checkout-session', jsonParser, checkoutSession)
  app.post('/get-products', jsonParser, getProduct)
  app.get('/get-list-of-products', jsonParser, getListOfProducts)
  app.post('/get-checkout-session', jsonParser, getCheckoutSessionData)
  // app.post('/post-student-data', jsonParser, postStudentData)
  // app.post('/get-payment-methods/:customer', jsonParser, async (req, res) => {
    
  //   if (req.body.stripe && req.params.customer) {
  //     let { params: { customer } } = req
  //     let { body: { stripe: stripeObject } } = req
  //     // console.log(stripeObject)
  //     let paymentMethods = Object.keys(stripeObject.paymentMethods).map(key => stripeObject.paymentMethods[key])
      
  //     console.log(paymentMethods)

  //     res.json({ customer, paymentMethods })
  //   } else {
  //     res.json({ msg: 'no stripe object found in req body' })
  //   }

  // })
  // we need to, with the API, manually create Stripe customers
  // so that we can track charges to the correct people's accounts
  app.post('/create-stripe-customer', jsonParser, async (req, res) => {
    
    console.log(req.body)

    let custExist = await stripe.customers.list({
      email: req.body.email
    })

    // console.log(custExist)
    // res.json(custExist)

    if (!req.body?.email) {
      res.json({
        error: 'no email in body'
      })
    }

    if (!custExist.data[0]) {
      let customer = await stripe.customers.create({
        email: req.body.email
      })
      res.json({ value: true, msg: 'Stripe customer created!', customer })
    } else {
      res.json({ value: false, msg: 'Customer already exists!', customer: custExist.data[0] })
    }

  })
  app.post('/attach-payment-method', jsonParser, async (req, res) => {

    console.log(
      req.body
    )
    
    if (req.body?.paymentMethod?.id) {
      let pmtMethodExist = await stripe.paymentMethods.retrieve(
        req.body.paymentMethod.id
      )
      // res.json({ customer: pmtMethodExist.customer })
      // res.json({ bool: pmtMethodExist.customer === null })
      
      if (pmtMethodExist.customer === null) {
        if (req.body?.paymentMethod && req.body?.customer) {
          const { paymentMethod:{ id }, customer: { id: customer } } = req.body
          const paymentMethodAttachResult = await stripe.paymentMethods.attach(
            id,
            {
              customer
            }
          )
          res.json({
            msg: 'saving new payment method..',
            paymentMethodAttachResult
          })
        } else {
          res.json({ msg: 'no payment method in request body' })
        }
      } else {
        res.json({ msg: 'payment method already exists, skipping creation' })
      }
    }

    

  })
  
  // Auth0 
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
