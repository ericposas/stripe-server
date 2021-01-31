'use strict'

require('dotenv').config()
const Stripe = require('stripe')
const stripe = Stripe(process.env.STRIPE_TEST_SECRET_KEY)

module.exports = async (req, res) => {

    console.log(
        req.body
    )

    if (req.body?.paymentMethod?.id) {
        let pmtMethodExist = await stripe.paymentMethods.retrieve(
        req.body.paymentMethod.id
        )

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

}
