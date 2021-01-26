'use strict'

require('dotenv').config()
const Stripe = require('stripe')
const stripe = Stripe(process.env.STRIPE_TEST_SECRET_KEY)

module.exports = async (req, res) => {

    const session = await stripe.checkout.sessions.retrieve(req.body.session_id)
    const customer = await stripe.customers.retrieve(session.customer)

    res.json({
        id: session.id,
        customer: customer
    })

}
