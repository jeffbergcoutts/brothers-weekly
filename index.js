var webapi = require('./webapi.js');
var oauth = require('./oauth.js');

// Real Playlist
const realPlaylistId = process.env.PLAYLISTID
// Test Playlist
const testPlaylistId = process.env.TESTPLAYLISTID

const refreshTokens = [
  process.env.REFRESHTOKENJEFF,
  process.env.REFRESHTOKENDAVE,
  process.env.REFRESHTOKENJON
]

const createPlaylistRefreshToken = process.env.REFRESHTOKENPLAYLIST

let mode = ""
switch(process.argv[2]) {
  case "publish":
    mode = "publish"
    break;
  case "test":
    mode = "test"
    break;
  default:
    mode = "dryRun"
    break;
}
console.log(mode)

getAllTracksAndCreatePlaylist()

function trackListFromLastWeeksTracks(tracks) {
  let lastWeeksTracks = []
  for (i = 0; i < tracks.length; i++) {
    let track = tracks[i].track.id
    lastWeeksTracks.push(track)
  }
  return lastWeeksTracks
}

function filterTracksForUser(userTopTracks, lastWeeksTracks, allTracks) {
  // will return a maximum of 10 tracks from unique albums
  let uniqueTracks = []
  let reportTracks = []
  let repeatTracks = 0

  for (x = 0; x < userTopTracks.length; x++) {
    // let album = userTopTracks[i].album.id
    // let albumName = userTopTracks[i].album.name
    // console.log(userTopTracks[i].track_number)
    let artistName = userTopTracks[x].artists[0].name
    let trackName = userTopTracks[x].name
    let track = userTopTracks[x].id
    
    if (!allTracks.includes(track)) {
      if (lastWeeksTracks.includes(track)) {
        repeatTracks = repeatTracks + 1
        if (repeatTracks < 6) {
          uniqueTracks.push(track)
          reportTracks.push(`repeat - ${artistName} - ${trackName}`)
        } else {
          reportTracks.push(`skipped - ${artistName} - ${trackName}`)
        }
      } else {
        uniqueTracks.push(track)
        reportTracks.push(`${artistName} - ${trackName}`)
      }  
    } else {
      reportTracks.push(`already on playlist - ${artistName} - ${trackName}`)
    }
    // let previousAlbums = []
    //if (!previousAlbums.includes(album)) {
      // uniqueTracks.push(track)
      //previousAlbums.push(album)
    //}

    if (uniqueTracks.length === 15) {
      (mode === "dryRun") && console.log(reportTracks)
      return uniqueTracks
    }
  }
}

function makeTracksForData(tracks) {
  const modifiedTracks = tracks.map(track => {
    return 'spotify:track:' + track;
    })
  return modifiedTracks
}

async function getAllTracksAndCreatePlaylist() {
  // get tracks from last weeks playlist
  const playlistAuth = await oauth.getTokenFromRefreshToken(createPlaylistRefreshToken)
  const lastWeeksPlaylist = await webapi.getLastWeeksTracks(playlistAuth.access_token, realPlaylistId)
  const lastWeeksTracks = trackListFromLastWeeksTracks(lastWeeksPlaylist)

  // determine user order to generate tracks
  let offset
  if (process.argv[3]) {
      offset = parseInt(process.argv[3]);
      console.log(`you've entered a starting number of ${offset}`)
  } else {
      var date = new Date();
      var month = date.getMonth();
      offset = Math.floor(month/4)
      console.log(`no starting number entered, program will use ${offset} determined from the current month ${month}`)
  }

  // get oAuth tokens for each user
  let userTokens = []
  for (i = 0; i < refreshTokens.length; i++) {
    var userAuth = await oauth.getTokenFromRefreshToken(refreshTokens[i])
    userTokens.push(userAuth.access_token)
  }

  // get top tracks from each user, filter based on rules, and add to new tracks list
  var currentWeekTracks = []
  for (i = 0; i < userTokens.length; i++) {
    var pointer = (i + offset) % userTokens.length;
    var userTopTracks = await webapi.getTopTracksforUser(userTokens[pointer])
    var eligibleTracks = filterTracksForUser(userTopTracks, lastWeeksTracks, currentWeekTracks)
    currentWeekTracks = currentWeekTracks.concat(eligibleTracks)
  }
  
  // create new playlist with new tracks
  const tracksForData = makeTracksForData(currentWeekTracks)
  if (mode != "dryRun") {
    const playlistId = (mode === "publish") ? realPlaylistId : testPlaylistId
    webapi.createPlaylist(playlistAuth.access_token, tracksForData, playlistId)
  }
}
