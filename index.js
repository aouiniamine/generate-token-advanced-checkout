require("dotenv").config()
const express = require('express')
const app = express()
const cors = require("cors")
const bodyParser = require("body-parser")


app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
const endpointURL = "https://api-m.sandbox.paypal.com"

function get_access_token() {
    const auth = `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
    const data = 'grant_type=client_credentials'
    return fetch(endpointURL + '/v1/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${Buffer.from(auth).toString('base64')}`
            },
            body: data
        })
        .then(res => res.json())
        .then(json => {
            return json.access_token;
        })
}
app.post("/api/generate_token", (req, res)=> {
    get_access_token()
    .then(token => {
        const payload = null
        fetch(endpointURL + "/v1/identity/generate-token", {
            method: "post",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: payload,
            })
            .then((response) => response.json())
            .then((data) => res.send(data.client_token))
    })
})


app.listen(5000, ()=>console.log("server is running: 5000"))