const https = require('https')

module.exports = {
  getTopTracksforUser:
  function (token) {
    return new Promise(
      function (resolve, reject) {

        const options = {
          hostname: 'api.spotify.com',
          port: 443,
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
  function (token, tracks, playlistId) {
    return new Promise(
      function (resolve, reject) {
        const postData = JSON.stringify(tracks)
        console.log(postData)
        const options = {
          hostname: 'api.spotify.com',
          port: 443,
          path: `/v1/playlists/${playlistId}/tracks`,
          method: 'POST',
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
            console.log(data)
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
          hostname: 'api.spotify.com',
          port: 443,
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
            resolve(JSON.parse(data).items)
          })
        })
        req.on('error', error => {
          console.error(error)
          reject(error)
        })
      
        req.end()
      }    )
  }
}
