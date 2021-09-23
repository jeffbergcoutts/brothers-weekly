require('dotenv').config()
const querystring = require('querystring')
const https = require('https')

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

module.exports = {
  getTokenFromRefreshToken:
  function (token) {
    return new Promise(
      function (resolve, reject) {
        var postData = querystring.stringify({
          'grant_type': 'refresh_token',
          'refresh_token': token
        })

        var req = https.request(options, res => {
          console.log('getTokenFromRefreshToken:' + res.statusCode)
          res.setEncoding('utf8')
          let data = ''
          res.on('data', chunk => {
            data = data + chunk
          })
          res.on('end', () => {
            resolve(JSON.parse(data))
          })
        })

        req.on('error', err => {
          console.error(err)
          reject(err)
        })
        req.write(postData)
        req.end()
      }
    )
  },
  requestToken:
  function (code) {
    return new Promise(
      function (resolve, reject) {
        var postData = querystring.stringify({
          'grant_type': 'authorization_code',
          'code': code,
          'redirect_uri': `${baseURL}callback`,
          'client_id': clientID,
          'client_secret': clientSecret
        })
        var req = https.request(options, res => {
          console.log('requestToken:' + res.statusCode)
          res.setEncoding('utf8')
          let data = ''
          res.on('data', chunk => {
            data = data + chunk
          })
          res.on('end', () => {
            resolve(JSON.parse(data))
          })
        })

        req.on('error', err => {
          console.error(err)
          reject(err)
        })

        req.write(postData)
        req.end()

      }
    )
  }
}
