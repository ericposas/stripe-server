'use strict'

require('dotenv').config()
const Stripe = require('stripe')
const stripe = Stripe(process.env.STRIPE_TEST_SECRET_KEY)

module.exports = async (req, res) => {

    if (req.body && req.body.email) {
        let custExist = await stripe.customers.list({
            email: req.body.email
        })
    
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
    }

}