const path = require('path');
const express = require('express');
const session = require('express-session');
const webapi = require('../spotify-clients/webapi.js');
const accounts = require('../spotify-clients/accounts.js');
const { transformPlaylistTracksResponse } = require("../spotify-clients/dataTransformers.js")
const parseurl = require('parseurl');
const querystring = require('querystring');

const clientID = process.env.CLIENTID;
const cookieSecret = process.env.COOKIESECRET;
const createPlaylistRefreshToken = process.env.REFRESHTOKENPLAYLIST
const realPlaylistId = process.env.PLAYLISTID
const baseURL = process.env.BASEURL;
const PORT = process.env.PORT || 3001;
const secureCookies = process.env.SECURECOOKIES;

const app = express();

app.set('trust proxy', 1); // trust first proxy

app.use(session({
  secret: cookieSecret,
  resave: false,
  saveUninitialized: true,
  cookie: (secureCookies === 'false') ? { secure: false } : { secure: true }
}));

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../client/build')));

// Handle GET requests to /api route
app.get("/api", (req, res) => {
  var loggedIn
  if (req.session.accessToken) {
    loggedIn = true;
  } else {
    loggedIn = false
  };

  res.json({
    loggedIn: loggedIn,
    baseURL: baseURL
  });
});

app.get("/login", (req, res) => {
  console.log("called /login")
  res.redirect(302, `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=code&redirect_uri=${baseURL}callback&scope=user-read-recently-played user-library-read`);
});

app.get("/callback", (req, res) => { //callback from oauth flow
  console.log("called /callback")
  // get code from url
  var query = parseurl(req).query;
  var queryValues = querystring.parse(query);
  var code = queryValues.code;

  // get Token using code
  accounts.requestToken(code)
    .then( response => JSON.parse(response))
    .then( response => {
      // store Token in cookie for later use
      req.session.accessToken = response.access_token;
      req.session.refreshToken = response.refresh_token;

      var date = new Date();
      var expiresIn = (res.expires_in * 1000) + date.getTime();
      req.session.expiryDate = expiresIn;
    }).then(() => {
      res.redirect(302, baseURL)
  });
});

app.get("/sharedweekly", (req, res) => {
  // Get Playlist Tracks from Spotify Web API
  console.log("called /sharedweekly")
  accounts.getTokenFromRefreshToken(createPlaylistRefreshToken)
    .then( response => JSON.parse(response))
    .then( response => {
      webapi.getPlaylistTracks(response.access_token, realPlaylistId)
        .then( response => {
          const data = transformPlaylistTracksResponse(response)
          res.send(data); // returns JSON to front end
        })
        .catch( err => {
          res.end(err)
        })
    })
    .catch( err => {
      res.end(err)
    })
})

app.get("/recentlyplayed", (req, res) => {
  // Get User's Recently Played Tracks from Spotify Web API
  console.log("called /recentlyplayed")
  webapi.getUsersRecentlyPlayedTracks(req.session.accessToken)
    .then( response => {
      const data = transformPlaylistTracksResponse(response)
      res.send(data); // returns JSON to front end
    })
    .catch( err => {
      res.end(err)
    })
})

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});