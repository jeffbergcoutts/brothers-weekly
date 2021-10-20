const https = require('https')
const { callback, handleError } = require('./helpers.js');

const HOSTNAME = 'api.spotify.com'
const PORT = 443

function options(path, method, token) {
  return {
    hostname: HOSTNAME,
    port: PORT,
    path: path,
    method: method,
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }
}

function getUsersTopTracks(token) {
  return new Promise(
    function (resolve, reject) {
      path = '/v1/me/top/tracks?time_range=short_term&limit=50&offset=0'

      const req = https.request(options(path, 'GET', token), callback(path, resolve))

      req.on('error', handleError(reject))
      req.end()
    }
  )
}

function getUsersRecentlyPlayedTracks(token) {
  return new Promise(
    function (resolve, reject) {
      const path ='/v1/me/player/recently-played?type=track'

      const req = https.request(options(path, 'GET', token), callback(path, resolve))

      req.on('error', handleError(reject))
      req.end()
    }
  )
}

function getUsersSavedAlbums(token) {
  return new Promise(
    function (resolve, reject) {
      const path ='/v1/me/albums'

      const req = https.request(options(path, 'GET', token), callback(path, resolve))

      req.on('error', handleError(reject))
      req.end()
    }
  )
}

function getPlaylistTracks(token, playlistId) {
  return new Promise(
    function (resolve, reject) {
      path = `/v1/playlists/${playlistId}/tracks`

      const req = https.request(options(path, 'GET', token), callback(path, resolve))

      req.on('error', handleError(reject))
      req.end()
    }
  )
}

function createPlaylist(token, trackList, playlistId) {
  return new Promise(
    function (resolve, reject) {
      const path = `/v1/playlists/${playlistId}/tracks`

      var req = https.request(options(path, "PUT", token), callback(`${path} : PUT`, resolve))

      req.on('error', handleError(reject))
      req.write(trackList) // write data to request body
      req.end()
    }
  )
}

function addToPlaylist(token, trackList, playlistId) {
  return new Promise(
    function (resolve, reject) {
      const path = `/v1/playlists/${playlistId}/tracks`

      var req = https.request(options(path, "POST", token), callback(`${path} : POST`, resolve))

      req.on('error', handleError(reject))
      req.write(trackList) // write data to request body
      req.end()
    }
  )
}

module.exports = { getUsersTopTracks, getUsersSavedAlbums, getUsersRecentlyPlayedTracks, getPlaylistTracks, createPlaylist, addToPlaylist }