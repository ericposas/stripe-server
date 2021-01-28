'use strict'

require('dotenv').config()
const Stripe = require('stripe')
const stripe = Stripe(process.env.STRIPE_TEST_SECRET_KEY)

module.exports = async (req, res) => {

    const session = await stripe.checkout.sessions.retrieve(req.body.session_id)
    const customer = await stripe.customers.retrieve(session.customer)
    const subscription = await stripe.subscriptions.retrieve(session.subscription)
    
    console.log(
        session
    )

    res.json({
        session,
        customer,
        subscription
    })

}
