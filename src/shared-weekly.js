require('dotenv').config()
var webapi = require('../clients/webapi.js');
var accounts = require('../clients/accounts.js');
const {overrides} = require('../overrides.js')

const realPlaylistId = process.env.PLAYLISTID
const testPlaylistId = process.env.TESTPLAYLISTID
const realArchivePlaylistId = process.env.ARCHIVEPLAYLISTID
const testArchivePlaylistId = process.env.TESTARCHIVEPLAYLISTID

const refreshTokens = [
  process.env.REFRESHTOKEN1,
  process.env.REFRESHTOKEN2,
  process.env.REFRESHTOKEN3
]

const createPlaylistRefreshToken = process.env.REFRESHTOKENPLAYLIST

let mode = ""
switch(process.argv[2]) {
  case "publish": // will modify archive & real playlist
    mode = "publish"
    break;
  case "test": // will modify test archive and test playlist
    mode = "test"
    break;
  case "report": // will not modify playlists
    mode = "report"
    break;
  default:
    mode = ""
    break;
}
console.log(mode)
if (mode === "") {
  console.log("You must select a mode. 'publish' will update real playlists, 'test' will update test playlists, 'report' will only print results")
  return
}

getAllTracksAndCreatePlaylist()

function createTrackListFromLastWeeksTracks(tracks) {
  let lastWeeksTracks = []
  for (i = 0; i < tracks.length; i++) {
    let track = tracks[i].track.id
    lastWeeksTracks.push(track)
  }
  return lastWeeksTracks
}

function filterTopTracksForUser(userTopTracks, lastWeeksTracks, allTracks) {
  // will return a maximum of 10 tracks, max 5 repeats from last week, max 3 from one album
  let uniqueTracks = []
  let repeatTracks = 0
  let previousAlbums = []

  let reportTracks = []

  const artistDenylist = overrides.denylist.artists
  const albumDenylist = overrides.denylist.albums

  for (x = 0; x < userTopTracks.length; x++) {
    let albumName = userTopTracks[x].album.name
    let album = userTopTracks[x].album.id
    let artistName = userTopTracks[x].artists[0].name
    let artist = userTopTracks[x].artists[0].id
    let trackName = userTopTracks[x].name
    let track = userTopTracks[x].id
    
    let reportTag = ""
    let addTrack = true
    let repeatTrack = false
    let repeatAlbumCount = 0

     // don't add if track is already on the playlist
    if (allTracks.includes(track)) {
      addTrack = false
      reportTag = "already on playlist"
    }

     // don't add if artist is on denylist
    if (artistDenylist.includes(artist)) {
      addTrack = false
      reportTag = "artist on denylist"
    }

    if (albumDenylist.includes(album)) {
      addTrack = false
      reportTag = "album on denylist"
    }

    // check if track was on last weeks playlist
    if (lastWeeksTracks.includes(track)) {
      repeatTrack = true
      if (repeatTracks > 4) { // don't add if already 5 repeat songs
        addTrack = false
        reportTag = "repeat track skipped"
      } else {
        reportTag = (addTrack === true) ? "repeat track added" : reportTag
      }
    }

    //TODO need to skip if it's repeats of the same album - not any repeat
    if (previousAlbums.includes(album)) {
      repeatAlbumCount = previousAlbums.filter((v) => (v === album)).length;
      if (repeatAlbumCount > 2) { // don't add if already 2 album repeats (making 3 tracks from the same album)
        addTrack = false
        reportTag = "repeat album skipped"
      } else {
        reportTag = (addTrack === true) ? "repeat album added" : reportTag
      }
    }

    if (addTrack === true) {
      // log
      if (repeatTrack === true) {
        (repeatTracks = repeatTracks + 1)
      }

      previousAlbums.push(album)
      reportTag = (reportTag === "") ? "new" : reportTag

      // add track to playlist
      uniqueTracks.push(track)
    }
    reportTracks.push(`${reportTag} - ${artistName} - ${albumName} - ${trackName} (${repeatTracks},${repeatAlbumCount})`)

    // stop when 10 tracks are added
    if (uniqueTracks.length === 10) {
      (mode === "report") && console.log(reportTracks)
      return uniqueTracks
    }
  }
}

function prepareTracksForData(tracks) {
  const modifiedTracks = tracks.map(track => {
    return 'spotify:track:' + track;
    })
  return modifiedTracks
}

async function getAllTracksAndCreatePlaylist() {
  // get tracks from last weeks playlist
  const playlistAuth = await accounts.getTokenFromRefreshToken(createPlaylistRefreshToken)
  const lastWeeksPlaylist = await webapi.getLastWeeksTracks(playlistAuth.access_token, realPlaylistId)
  const lastWeeksTracks = createTrackListFromLastWeeksTracks(lastWeeksPlaylist)

  // determine user order to generate tracks
  let offset
  const noOfUsers = refreshTokens.length
  if (process.argv[3]) {
    var testMonth = parseInt(process.argv[3]);
    offset = ((testMonth < 3) ? testMonth : testMonth % noOfUsers)
    console.log(`you've entered ${testMonth}, so the starting number is ${offset}`)
  } else {
    var date = new Date();
    var month = date.getMonth();
    offset = ((month < 3) ? month : month % noOfUsers)
    console.log(`the current month is ${month}, so the starting number is ${offset}`)
  }

  // get oAuth tokens for each user
  let userTokens = []
  for (i = 0; i < noOfUsers; i++) {
    var userAuth = await accounts.getTokenFromRefreshToken(refreshTokens[i])
    userTokens.push(userAuth.access_token)
  }

  // get top tracks from each user, filter based on rules, and add to new tracks list
  var currentWeekTracks = []
  for (i = 0; i < noOfUsers; i++) {
    var pointer = (i + offset) % noOfUsers;
    var userTopTracks = await webapi.getTopTracksforUser(userTokens[pointer])
    var eligibleTracks = filterTopTracksForUser(userTopTracks, lastWeeksTracks, currentWeekTracks)
    currentWeekTracks = currentWeekTracks.concat(eligibleTracks)
  }
  
  let tracksForData = ""
  if (mode != "report") {
    // add tracks to archive
    tracksForData = prepareTracksForData(lastWeeksTracks)
    const archivePlaylistId = (mode === "publish") ? realArchivePlaylistId : testArchivePlaylistId
    webapi.createPlaylist(playlistAuth.access_token, tracksForData, archivePlaylistId, false)

    // replace playlist with new tracks
    tracksForData = prepareTracksForData(currentWeekTracks)
    console.log(currentWeekTracks)
    console.log(tracksForData)
    const playlistId = (mode === "publish") ? realPlaylistId : testPlaylistId
    webapi.createPlaylist(playlistAuth.access_token, tracksForData, playlistId, true)
  }
}
