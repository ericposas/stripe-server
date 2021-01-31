'use strict'

require('dotenv').config()
const fetch = require('node-fetch')

const getAPIToken = async (req, res) => {
    let url = 'https://gymwebapp.us.auth0.com/oauth/token'
    let options = {
        method: 'POST',
        url: 'https://gymwebapp.us.auth0.com/oauth/token',
        headers: { 'content-type': 'application/json' },
        body: `{
        "client_id":"${process.env.AUTH0_JWT_CONFIG_CLIENT_ID}",
        "client_secret":"${process.env.AUTH0_JWT_CONFIG_CLIENT_SECRET}",
        "audience":"https://gymwebapp.us.auth0.com/api/v2/",
        "grant_type":"client_credentials"
        }`
    }
    fetch(url, options)
    .then(response => response.json())
    .then(body => {
        if (res) {
            res.json(body)
        } else {
            return body
        }
    })
    .catch(err => console.log(err))
}

module.exports = {
    serverToken: () => getAPIToken(),
    clientToken: (req, res) => getAPIToken(req, res)
}
