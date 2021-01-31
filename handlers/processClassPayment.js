'use strict'

require('dotenv').config()
const Stripe = require('stripe')
const stripe = Stripe(process.env.STRIPE_TEST_SECRET_KEY)

module.exports = async (req, res) => {

    if (req.body.shoppingCart && req.body.stripe && req.body.paymentMethodChosen) {

        let { body: { shoppingCart, stripe: stripeObject, paymentMethodChosen: payment_method } } = req
    
        let products = [], prices = [], productDescriptions = []
        for (let item of shoppingCart) {
            let price = await stripe.prices.retrieve(item.price)
            prices.push(price)
            let product = await stripe.products.retrieve(price.product) 
            products.push(product)
            productDescriptions.push(product.name)
        }

        // check for subscriptions..
        let subscriptions = products.map(product => {
            let matches = product.name.match(/subscription/ig)
            if (matches) {
                return product?.metadata?.price_id
            }
        })

        console.log(subscriptions)

        for (let sub of subscriptions) {
            if (sub !== undefined) {
                await stripe.subscriptions.create({
                    customer: stripeObject.customer.id,
                    items: [
                        { price: sub }
                    ],
                    default_payment_method: payment_method.id
                })
            }
        }
        
        // create a paymentIntent instead of a charge
        let amount = prices.length > 1 ? prices.reduce((a, b) => a.unit_amount + b.unit_amount) : prices[0].unit_amount
        let paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            description: productDescriptions.join(', '),
            payment_method: payment_method.id,
            customer: stripeObject.customer.id
        })
    
        let { id: intent_id, client_secret } = paymentIntent
        
        // console.log(
        //     intent_id,
        //     client_secret 
        // )
    
        res.send({
            intent_id,
            client_secret
        })

    }

}