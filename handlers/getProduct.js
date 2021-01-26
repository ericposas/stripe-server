'use strict'

require('dotenv').config()
const Stripe = require('stripe')
const stripe = Stripe(process.env.STRIPE_TEST_SECRET_KEY)

module.exports = async (req, res) => {

    console.log(
        req.body
    )

    const product = await stripe.products.retrieve(
        req.body.prod_id
    )

    console.log(
        product
    )

    res.json({ product: product })

}
