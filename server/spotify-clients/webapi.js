const https = require('https')
const HOSTNAME = 'api.spotify.com'
const PORT = 443

module.exports = {
  getTopTracksforUser:
  function (token) {
    return new Promise(
      function (resolve, reject) {

        const options = {
          hostname: HOSTNAME,
          port: PORT,
          path: `/v1/me/top/tracks?time_range=short_term&limit=50&offset=0`,
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
        const req = https.request(options, res => {
          console.log(`getTopTracksforUser: statusCode: ${res.statusCode}`)
          let data = ''
          res.on('data', (chunk) => {
            data += chunk
          })

          res.on('end', () => {
            resolve(JSON.parse(data).items)
          })
        })
        req.on('error', error => {
          console.error(error)
          reject(error)
        })

        req.end()
      }
    )
  },
  createPlaylist:
  function (token, tracks, playlistId, replace) {
    return new Promise(
      function (resolve, reject) {
        const method = (replace === true) ? "PUT" : "POST"
        const postData = `{"uris": ${JSON.stringify(tracks)}}`
        const options = {
          hostname: HOSTNAME,
          port: PORT,
          path: `/v1/playlists/${playlistId}/tracks`,
          method: method,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }

        var req = https.request(options, function(res) {
          console.log('createPlaylist:' + res.statusCode)
          var data = ''
          res.on('data', function(chunk) {
            data = data + chunk
          })
          res.on('end', function() {
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
  },
  getLastWeeksTracks:
  function (token, playlistId) {
    return new Promise(
      function (resolve, reject) {

        const options = {
          hostname: HOSTNAME,
          port: PORT,
          path: `/v1/playlists/${playlistId}/tracks`,
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
        const req = https.request(options, res => {
          console.log(`getLastWeeksTracks: statusCode: ${res.statusCode}`)
          let data = ''
          res.on('data', (chunk) => {
            data += chunk
          })

          res.on('end', () => {
            //resolve(JSON.parse(data).items)
            resolve(data)
          })
        })
        req.on('error', error => {
          console.error(error)
          reject(error)
        })

        req.end()
      }
    )
  },
  getSavedAlbums:
  function (token) {
    return new Promise(
      function (resolve, reject) {
        const options = {
          hostname: HOSTNAME,
          port: PORT,
          path: '/v1/me/albums',
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }

        const req = https.request(options, res => {
          console.log(`getSavedAlbums: statusCode: ${res.statusCode}`)
          let data = ''
          res.on('data', (chunk) => {
            data += chunk.toString()
          })
          res.on('end', () => {
            resolve(data)
          })
        })

        req.on('error', error => {
          console.log(error)
          reject(error)
        })

        req.end()
      }
    )
  },
  getRecentlyPlayed:
  function (token) {
    return new Promise(
      function (resolve, reject) {
        const options = {
          hostname: HOSTNAME,
          port: PORT,
          path: '/v1/me/player/recently-played?type=track',
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }

        const req = https.request(options, res => {
          console.log(`getRecentlyPlayed: statusCode: ${res.statusCode}`)
          let data = ''
          res.on('data', (chunk) => {
            data += chunk
          })
          res.on('end', () => {
            resolve(data)
          })
        })

        req.on('error', error => {
          console.log(error)
          reject(error)
        })

        req.end()
      }
    )
  }
}
