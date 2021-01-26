'use strict'

require('dotenv').config()
const Stripe = require('stripe')
const stripe = Stripe(process.env.STRIPE_TEST_SECRET_KEY)

module.exports = async (req, res) => {

    const products = await stripe.products.list()

    console.log(
        products.data
    )

    res.json({ products: products.data })

}
