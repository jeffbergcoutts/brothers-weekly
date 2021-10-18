const https = require('https')
const HOSTNAME = 'api.spotify.com'
const PORT = 443

function getUsersTopTracks(token) {
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
        console.log(`getUsersTopTracks: statusCode: ${res.statusCode}`)
        let data = ''
        res.on('data', (chunk) => {
          data += chunk
        })

        res.on('end', () => {
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
}

function getUsersRecentlyPlayedTracks(token) {
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
        console.log(`getUsersRecentlyPlayedTracks: statusCode: ${res.statusCode}`)
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

function getUsersSavedAlbums(token) {
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
        console.log(`getUsersSavedAlbums: statusCode: ${res.statusCode}`)
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
}

function getPlaylistTracks(token, playlistId) {
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
        console.log(`getPlaylistTracks: statusCode: ${res.statusCode}`)
        let data = ''
        res.on('data', (chunk) => {
          data += chunk
        })

        res.on('end', () => {
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
}

function createPlaylist(token, trackList, playlistId, replace) {
  return new Promise(
    function (resolve, reject) {
      const method = (replace === true) ? "PUT" : "POST"
      const postData = `{"uris": ${JSON.stringify(trackList)}}`
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
          resolve(data)
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

module.exports = { getUsersTopTracks, getUsersSavedAlbums, getUsersRecentlyPlayedTracks, getPlaylistTracks, createPlaylist }