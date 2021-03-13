
require('dotenv').config()
var http = require('http')
var url = require('url')
var sessions = require('client-sessions')
var webapi = require('../clients/webapi.js');
var accounts = require('../clients/accounts.js');

const clientID = process.env.CLIENTID
const cookieSecret = process.env.COOKIESECRET
const createPlaylistRefreshToken = process.env.REFRESHTOKENPLAYLIST
const realPlaylistId = process.env.PLAYLISTID
const baseURL = process.env.BASEURL
const PORT = process.env.PORT || 8080

//const cookiesFlags = (baseURL === "http://localhost:8080/") ? {} : {sameSite: 'none', secure: true}

var requestSessionHandler = sessions({
  cookieName: 'authTokens', // cookie name dictates the key name added to the request object
  secret: cookieSecret, // should be a large unguessable string
  duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms
  activeDuration: 1000 * 60 * 5, // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
  cookie: {sameSite: 'lax'}
})

function filterResults(results, filter) { //RE-WRITE & move?
  // parse response, create my own JSON object and return that with stringify
  var parsedResults = JSON.parse(results)
  var items = parsedResults.items
  var albums = { albums: [] }

  // 0 = Recently Played
  // 1 = Albums in Library
  if (filter == 0) {
    var lastAlbum = ''

    for (var i = 0; i < parsedResults.items.length; i++) {
      var albumName = parsedResults.items[i].track.album.name
      if (albumName != lastAlbum) {
        albums.albums.push({ name: albumName, artist: parsedResults.items[i].track.album.artists[0].name, link: parsedResults.items[i].track.album.external_urls.spotify, image: parsedResults.items[i].track.album.images[1].url })
      }
      lastAlbum = albumName
    }
    return JSON.stringify(albums)
  } else if (filter == 1) {
    for (var i = 0; i < parsedResults.items.length; i++) {
      var albumName = parsedResults.items[i].album.name
      var artistName = parsedResults.items[i].album.artists[0].name
      var playUrl = parsedResults.items[i].album.external_urls.spotify
      var albumImage = parsedResults.items[i].album.images[1].url

      albums.albums.push({ name: albumName, artist: artistName, link: playUrl, image: albumImage })
    }
    return JSON.stringify(albums)
// for viewing JSON object in Chrome
//    return results
  }
}

var server = http.createServer(function (req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Expose-Headers', 'Set-Cookie')
  res.setHeader('Access-Control-Allow-Headers', 'Cookie')

  if (/^\/api\/spotifyhome/.test(req.url)) {
    // SPOTIFY HOME (Album view)

    // Get Access Token from Cookie
    var token = ''
    requestSessionHandler(req, res, function () {
      token = req.authTokens.accessToken
    })
    // Get Recently Played from Spotify API
    webapi.getSavedAlbums(token)
    .then( response => {
      // res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(filterResults(response, 1))
    })
    .catch( err => {
      // res.writeHead(502, { 'Content-Type': 'application/json' })
      res.end(err)
    })

  } else if (/^\/api\/recentlyplayed/.test(req.url)) {
    // RECENTLY PLAYED

    // Get Access Token from Cookie
    var token = ''
    requestSessionHandler(req, res, function () {
      token = req.authTokens.accessToken
    })

    // Get Recently Played from Spotify API
    webapi.getRecentlyPlayed(token)
    .then( response => {
      // res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(filterResults(response, 0))
    })
    .catch( err => {
      res.writeHead(502, { 'Content-Type': 'application/json' })
      res.end(err)
    })

  } else if (/^\/api\/lastweekstracks/.test(req.url)) {
    accounts.getTokenFromRefreshToken(createPlaylistRefreshToken).then( response => {
      webapi.getLastWeeksTracks(response.access_token, realPlaylistId)
      .then( response => {
        const albumCoverUrl = response[0].track.album.images[1].url
        const track = response[0].track.id
        res.end(albumCoverUrl)
      })
      .catch( err => {
        res.end(err)
      })
    })

  } else if (/^\/api\/login/.test(req.url)) {
    // LOGIN

    // Redirect to Spotify login page
    res.writeHead(302, {'Location': 'https://accounts.spotify.com/authorize?client_id=' + clientID + `&response_type=code&redirect_uri=${baseURL}callback&scope=user-read-recently-played user-library-read`})
    res.end()

  } else if (/^\/callback/.test(req.url)) {
    // CALLBACK (Endpoint for callback from Spotify login)

    // Get code from response from Spotify and use to request Tokens
    var requestURL = new URL(req.url, 'http://api.sharedweekly.com/')
    var code = requestURL.searchParams.get('code')
    accounts.requestToken(code).then( response => {
      return storeToken(response)
    })

    // Store tokens and expiry date in cookie
    function storeToken(response) {
      console.log("login")
      console.log(response)
      requestSessionHandler(req, res, function () {
          req.authTokens.accessToken = response.access_token
          req.authTokens.refreshToken = response.refresh_token
          var expiresIn = response.expires_in * 1000
          var date = new Date()
          req.authTokens.expiryDate = expiresIn + date.getTime()
      })
      // Redirect back to home page
      res.writeHead(302, {'Location': 'http://localhost:8000'})
      res.end()
    }
  } else if (/^\/api\/getloggedin/.test(req.url)) {
    // GET LOGGED IN
    // Check for a valid Access Token and requests new one if needed

    var accessToken = ''
    var refreshToken = ''
    var expiryDate = ''
    var date = new Date()

    // get tokens and expiry date from cookie
    requestSessionHandler(req, res, function () {
        accessToken = req.authTokens.accessToken
        refreshToken = req.authTokens.refreshToken
        expiryDate = req.authTokens.expiryDate
    })

    if (accessToken == null) {
      console.log("no token found in cookies")
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end('no token')
    } else {
      // if token is expired, get new one with refresh token
      if (date.getTime() > expiryDate) {
        accounts.getTokenFromRefreshToken(refreshToken).then( response => {
          return storeToken(response)
        })

        function storeToken(response) {
          requestSessionHandler(req, res, function () {
            req.authTokens.accessToken = response.access_token
            req.authTokens.refreshToken = response.refresh_token
            var expiresIn = response.expires_in * 1000
            var date = new Date()
            req.authTokens.expiryDate = expiresIn + date.getTime()
          })
          res.end('logged in')
        }

      } else {
        res.end('logged in')
      }
    }
  } else {
    res.writeHead(404)
    res.end()
  }
})

server.listen(PORT)
