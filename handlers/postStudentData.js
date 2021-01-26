'use strict'

// require('dotenv').config()
// const Stripe = require('stripe')
// const stripe = Stripe(process.env.STRIPE_TEST_SECRET_KEY)

const mongoose = require('mongoose')
const Customer = mongoose.model('Customer', new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    // password: {
    //     type: String,
    //     required: true
    // }
}))

module.exports = async (req, res) => {

    // post data to mongo db 
    const { firstName, lastName, email } = req.body



    res.json(
        req.body
    )

}
