require('dotenv').config()
var querystring = require('querystring')
var https = require('https')

var clientID = process.env.CLIENTID
var clientSecret = process.env.CLIENTSECRET

module.exports = {
  getTokenFromRefreshToken:
  function (user) {
    return new Promise(
      function (resolve, reject) {
        var postData = querystring.stringify({
          'grant_type': 'refresh_token',
          'refresh_token': user
        })

        const options = {
          hostname: 'accounts.spotify.com',
          port: 443,
          path: '/api/token',
          method: 'POST',
          headers: {
            'Authorization': 'Basic ' + (new Buffer.from(clientID + ':' + clientSecret).toString('base64')),
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
          }
        }

        var req = https.request(options, function(res) {
          console.log('getTokenForTopTracks:' + res.statusCode)
          res.setEncoding('utf8')
          var data = ''
          res.on('data', function(chunk) {
            data = data + chunk
          })
          res.on('end', function() {
            // console.log(data)
            resolve(JSON.parse(data))
          })
        })
      
        req.on('error', function(err) {
          console.error(err)
          reject(error)
        })
      
        // write data to request body
        req.write(postData)
        req.end()
      }
    )
  }
}
