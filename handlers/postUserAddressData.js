'use strict'

require('dotenv').config()
const Stripe = require('stripe')
const stripe = Stripe(process.env.STRIPE_TEST_SECRET_KEY)

module.exports = async (req, res) => {

    if (req.body.user && req.body.street && req.body.city &&
        req.body.state && req.body.zip) {

            let {
                user: {
                    user_metadata: {
                        stripe: {
                            customer: {
                                id: stripeCustomer
                            }
                        }
                    }
                },
                street,
                city,
                state,
                zip
            } = req.body

            try {
                let response = await stripe.customers.update(
                    stripeCustomer,
                    {
                        address: {
                            line1: street,
                            city,
                            state,
                            postal_code: zip
                        }
                    }
                )
                console.log( response )
                res.json( response )
                
            } catch (error) {
                console.log( error )
                res.json( error )
            
            }

    }

}