const path = require('path');
const express = require('express');
const session = require('express-session');
const webapi = require('./spotify-clients/webapi.js');
const accounts = require('./spotify-clients/accounts.js');
const parseurl = require('parseurl');
const querystring = require('querystring');

const clientID = process.env.CLIENTID;
const cookieSecret = process.env.COOKIESECRET;
const createPlaylistRefreshToken = process.env.REFRESHTOKENPLAYLIST
const realPlaylistId = process.env.PLAYLISTID
const baseURL = process.env.BASEURL;
const PORT = process.env.PORT || 3001;
const env = process.env.ENV;
const localDev = process.env.LOCALDEV

const app = express();

app.set('trust proxy', 1); // trust first proxy

const cookieSetting = (env === 'dev') ? { secure: false } : { secure: true }
app.use(session({
  secret: cookieSecret,
  resave: false,
  saveUninitialized: true,
  cookie: cookieSetting
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
    env: env
  });
});

app.get("/login", (req, res) => {
  res.redirect(302, `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=code&redirect_uri=${baseURL}callback&scope=user-read-recently-played user-library-read`);
});

app.get("/callback", (req, res) => { //callback from oauth flow
  // get code from url
  var query = parseurl(req).query;
  var queryValues = querystring.parse(query);
  var code = queryValues.code;
  const redirectUrl = (localDev === 'true') ? 'http://localhost:3000/' : baseURL

  // get Token using code
  accounts.requestToken(code)
    .then( res => {
      // store Token in cookie for later use
      req.session.accessToken = res.access_token;
      req.session.refreshToken = res.refresh_token;

      var date = new Date();
      var expiresIn = (res.expires_in * 1000) + date.getTime();
      req.session.expiryDate = expiresIn;
  }).then(() => {
    res.redirect(302, redirectUrl)
  });
});

app.get("/brosweekly", (req, res) => {
  accounts.getTokenFromRefreshToken(createPlaylistRefreshToken).then( response => {
    webapi.getLastWeeksTracks(response.access_token, realPlaylistId)
    .then( response => {
      const albumCoverUrl = response[0].track.album.images[1].url
      //const track = response[0].track.id
      res.end(albumCoverUrl)
    })
    .catch( err => {
      res.end(err)
    })
  })
})

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});