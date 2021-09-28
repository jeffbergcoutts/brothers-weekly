require('dotenv').config()
var webapi = require('./spotify-clients/webapi.js')
var accounts = require('./spotify-clients/accounts.js');
const {overrides} = require('./overrides.js')
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

function createTrackListFromLastWeeksTracks(tracks) {
  let lastWeeksTracks = []
  for (i = 0; i < tracks.length; i++) {
    let track = tracks[i].track.id
    lastWeeksTracks.push(track)
  }
  return lastWeeksTracks
}

function filterTopTracksForUser(userTopTracks, lastWeeksTracks, allTracks, mode) {
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
      reportTag = "skipped: already on playlist"
    }

     // don't add if artist is on denylist
    if (artistDenylist.includes(artist)) {
      addTrack = false
      reportTag = "skipped: artist on denylist"
    }

    if (albumDenylist.includes(album)) {
      addTrack = false
      reportTag = "skipped: album on denylist"
    }

    // check if track was on last weeks playlist
    if (lastWeeksTracks.includes(track)) {
      repeatTrack = true
      if (repeatTracks > 4) { // don't add if already 5 repeat songs
        addTrack = false
        reportTag = "skipped: on last weeks playlist (over max of 5 tracks)"
      } else {
        reportTag = (addTrack === true) ? "added: on last weeks playlist (under max of 5)" : reportTag
      }
    }

    //TODO need to skip if it's repeats of the same album - not any repeat
    if (previousAlbums.includes(album)) {
      repeatAlbumCount = previousAlbums.filter((v) => (v === album)).length;
      if (repeatAlbumCount > 2) { // don't add if already 2 album repeats (making 3 tracks from the same album)
        addTrack = false
        reportTag = "skipped: album already added for user (over max of 3 tracks)"
      } else {
        reportTag = (addTrack === true) ? "added: album already added for user (under max of 3 tracks)" : reportTag
      }
    }

    if (addTrack === true) {
      // log
      if (repeatTrack === true) {
        (repeatTracks = repeatTracks + 1)
      }

      previousAlbums.push(album)
      reportTag = (reportTag === "") ? "added: new track!" : reportTag

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

async function getAllTracksAndCreatePlaylist(mode, month) {
  if (mode === "") {
    console.log("no mode provided. program ending")
    return;
  }
  // get tracks from last weeks playlist
  const playlistAuth = await accounts.getTokenFromRefreshToken(createPlaylistRefreshToken)
  const lastWeeksPlaylist = await webapi.getLastWeeksTracks(playlistAuth.access_token, realPlaylistId)
  const lastWeeksTracks = createTrackListFromLastWeeksTracks(JSON.parse(lastWeeksPlaylist).items)


  // get oAuth tokens for each user
  const noOfUsers = refreshTokens.length
  let userTokens = []
  for (i = 0; i < noOfUsers; i++) {
    var userAuth = await accounts.getTokenFromRefreshToken(refreshTokens[i])
    userTokens.push(userAuth.access_token)
  }

  // determine offset to start looping through users - this determines the starting user
  const offset = ((month < 3) ? month : month % noOfUsers)
  console.log(`the offset is ${offset}`)

  // get top tracks from each user, filter based on rules, and add to new tracks list
  var currentWeekTracks = []
  for (i = 0; i < noOfUsers; i++) {
    var pointer = (i + offset) % noOfUsers;
    var userTopTracks = await webapi.getTopTracksforUser(userTokens[pointer])
    var eligibleTracks = filterTopTracksForUser(JSON.parse(userTopTracks).items, lastWeeksTracks, currentWeekTracks, mode)
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

module.exports = { getAllTracksAndCreatePlaylist };
