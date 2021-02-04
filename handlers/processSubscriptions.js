'use strict'

require('dotenv').config()
const Stripe = require('stripe')
const stripe = Stripe(process.env.STRIPE_TEST_SECRET_KEY)

module.exports = async (req, res) => {

    console.log(
        req.body
    )

    if (req.body.subscriptions && req.body.stripeObject && req.body.paymentMethodChosen) {

        let { subscriptions, stripeObject, paymentMethodChosen: payment_method } = req.body

        try {
            let subscriptionsResult
            for (let sub of subscriptions) {
                if (sub !== undefined && sub !== null) {
                    subscriptionsResult = await stripe.subscriptions.create({
                        customer: stripeObject.customer.id,
                        items: [
                            { price: sub }
                        ],
                        default_payment_method: payment_method.id
                    })
                }
            }
    
            console.log(
                subscriptionsResult
            )
    
            res.json( subscriptionsResult )

        } catch (err) {
            console.log(err)
            res.json(err)
        }

    } else {
        res.json({ msg: 'no subscriptionsData sent in body' })
    }

}