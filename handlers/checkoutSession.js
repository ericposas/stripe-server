'use strict'

require('dotenv').config()
const Stripe = require('stripe')
const stripe = Stripe(process.env.STRIPE_TEST_SECRET_KEY)

module.exports = async (req, res) => {

    console.log(
        req.body.email
    )

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        customer_email: req.body?.email ? req.body.email : null,
        line_items: req.body.line_items,
        mode: 'subscription',
        success_url: 'http://localhost:8000/success?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: 'http://localhost:8000/',
    })

    res.json(session)

}
