'use strict'

require('dotenv').config()
const Stripe = require('stripe')
const stripe = Stripe(process.env.STRIPE_TEST_SECRET_KEY)

module.exports = async (req, res) => {

    if (req.body.shoppingCart && req.body.stripe && req.body.paymentMethodChosen) {

        let { body: { shoppingCart, stripe: stripeObject, paymentMethodChosen: payment_method } } = req
    
        let products = [], prices = [] //, productDescriptions = []
        for (let item of shoppingCart) {
            let price = await stripe.prices.retrieve(item.price)
            prices.push(price)
            let product = await stripe.products.retrieve(price.product) 
            products.push(product)
            // productDescriptions.push(product.name)
        }

        // check for subscriptions..
        let subscriptions = products.map(product => {
            let matches = product.name.match(/subscription/ig)
            if (matches) {
                return product?.metadata?.price_id
            }
        })

        // group pt training
        let ptTrainings = products.map(product => {
            let matches = product.name.match(/personal training/gi)
            if (matches) {
                return product?.metadata?.price_id
            }
        })

        // for (let sub of subscriptions) {
        //     if (sub !== undefined) {
        //         await stripe.subscriptions.create({
        //             customer: stripeObject.customer.id,
        //             items: [
        //                 { price: sub }
        //             ],
        //             default_payment_method: payment_method.id
        //         })
        //     }
        // }
        
        // create a paymentIntent instead of a charge
        // console.log(prices)
        // let amount = prices.length > 1 ? prices.reduce((a, b) => a.unit_amount + b.unit_amount) : prices[0].unit_amount
        let priceObjects = prices
        .filter(priceObj => priceObj.type === 'one_time')
        .map(obj => obj.unit_amount)

        let oneTimeCharge = priceObjects.length > 0 ?
        priceObjects.reduce((a, b) => a + b) : priceObjects[0]

        // console.log(
        //     oneTimeCharge
        // )

        let productDescriptions = prices
        .filter(priceObj => {
            console.log(priceObj)
            return priceObj.type === 'one_time'
        })
        .map(obj => obj.nickname)

        // console.log( oneTimeCharge )

        let intent_id, client_secret
        if (oneTimeCharge) {
            let paymentIntent = await stripe.paymentIntents.create({
                amount: oneTimeCharge,
                currency: 'usd',
                description: productDescriptions.join(', '),
                payment_method: payment_method.id,
                customer: stripeObject.customer.id
            })
            intent_id = paymentIntent.intent_id
            client_secret = paymentIntent.client_secret
        }
    
        let data = {
            subscriptionsData: {
                subscriptions: subscriptions ? subscriptions : false,
                stripeObject,
                paymentMethodChosen: payment_method
            }
        }
        if (oneTimeCharge) {
            data.intent_id = intent_id
            data.client_secret = client_secret
        }
        
        res.send( data )

    }

}