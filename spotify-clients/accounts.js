require('dotenv').config()
const querystring = require('querystring')
const https = require('https')
const { callback, handleError } = require('./helpers.js');

const clientID = process.env.CLIENTID
const clientSecret = process.env.CLIENTSECRET
const baseURL = process.env.BASEURL
const HOSTNAME = 'accounts.spotify.com'
const PORT = 443

const options = {
  hostname: HOSTNAME,
  port: PORT,
  path: '/api/token',
  method: 'POST',
  headers: {
    'Authorization': 'Basic ' + (new Buffer.from(clientID + ':' + clientSecret).toString('base64')),
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'application/json'
  }
}

function getTokenFromRefreshToken(token) {
  return new Promise(
    function (resolve, reject) {
      var postData = querystring.stringify({
        'grant_type': 'refresh_token',
        'refresh_token': token
      })
      var req = https.request(options, callback("/api/token : refresh_token", resolve))

      req.on('error', handleError(reject))
      req.write(postData)
      req.end()
    }
  )
}
    
function requestToken(code) {
  return new Promise(
    function (resolve, reject) {
      var postData = querystring.stringify({
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': `${baseURL}callback`,
        'client_id': clientID,
        'client_secret': clientSecret
      })

      var req = https.request(options, callback("/api/token : authorization_code", resolve))

      req.on('error', handleError(reject))
      req.write(postData)
      req.end()

    }
  )
}

module.exports = { requestToken, getTokenFromRefreshToken }