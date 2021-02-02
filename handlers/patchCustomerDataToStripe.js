'use strict'

require('dotenv').config()
const fetch = require('node-fetch')
const Stripe = require('stripe')
const stripe = Stripe(process.env.STRIPE_TEST_SECRET_KEY)

module.exports = async (req, res) => {

    if (req.body.userData && req.body.customer) {
        let { userData: { name, email, phone }, customer } = req.body
        try {
            // let apiResult = await fetch(`${process.env.AUTH0_JWT_API_URL}${}`)
            let apiResult = await stripe.customers.update(
                customer,
                {
                    name,
                    phone
                }
            )
            console.log(
                apiResult
            )
            res.json({
                msg: 'posted to Stripe customer',
                apiResult
            })
        } catch (err) {
            console.log(err)
            res.json({
                msg: 'error occurred posting to Stripe customer',
                error: err
            })
        }
    }
}