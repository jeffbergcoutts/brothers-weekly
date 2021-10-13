require('dotenv').config()
const { print } = require("./utils/helpers.js")
const webapi = require('./spotify-clients/webapi.js')
const accounts = require('./spotify-clients/accounts.js')
const { overrides } = require('./utils/overrides.js')

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

function prepareTracksForData(tracks) {
  const modifiedTracks = tracks.map(track => {
    return 'spotify:track:' + track
    })
  return modifiedTracks
}

function createTrackListFor

function filterTopTracksForUser(userTopTracks, lastWeeksTracks, allTracks, mode) {
  // will return a maximum of 10 tracks
  // max 5 repeats from last weeks playlist
  // max 3 from one album
  // no repeats from current playlist

  let uniqueTracks = []
  let repeatTracks = 0
  let previousAlbums = []
  let reportTracks = []

  const artistDenylist = overrides.denylist.artists
  const albumDenylist = overrides.denylist.albums
  
  // Transform Track data shape to what is needed
  function Track(albumId, artistId, trackId, trackInfo) {
    this.albumId = albumId;
    this.artistId = artistId;
    this.trackId = trackId;
    this.trackInfo = trackInfo;
  }

  for (x = 0; x < userTopTracks.length; x++) {
    const track = new Track()
    try {
      track.albumId = userTopTracks[x].album.id
      track.artistId = userTopTracks[x].artists[0].id
      track.trackId = userTopTracks[x].id
      track.trackInfo = `${userTopTracks[x].artists[0].name} - ${userTopTracks[x].album.name} - ${userTopTracks[x].name}`
    } catch(err) {
      print(err)
      return
    }
    
    let reportTag = ""
    let addTrack = true
    let repeatTrack = false
    let repeatAlbumCount = 0

     // don't add if track is already on the playlist
    if (allTracks.includes(track.trackId)) {
      addTrack = false
      reportTag = "skipped: already on playlist"
    }

     // don't add if artist is on denylist
    if (artistDenylist.includes(track.artistId)) {
      addTrack = false
      reportTag = "skipped: artist on denylist"
    }

    if (albumDenylist.includes(track.albumId)) {
      addTrack = false
      reportTag = "skipped: album on denylist"
    }

    // check if track was on last weeks playlist
    if (lastWeeksTracks.includes(track.trackId)) {
      repeatTrack = true
      if (repeatTracks > 4) { // don't add if already 5 repeat songs
        addTrack = false
        reportTag = "skipped: on last weeks playlist (over max of 5 tracks)"
      } else {
        reportTag = (addTrack === true) ? "added: on last weeks playlist (under max of 5)" : reportTag
      }
    }

    //check if it's already 3 repeats from the same album
    if (previousAlbums.includes(track.albumId)) {
      repeatAlbumCount = previousAlbums.filter((v) => (v === track.albumId)).length
      if (repeatAlbumCount > 2) { // don't add if already 2 album repeats (making 3 tracks from the same album)
        addTrack = false
        reportTag = "skipped: album already added for user (over max of 3 tracks)"
      } else {
        reportTag = (addTrack === true) ? "added: album already added for user (under max of 3 tracks)" : reportTag
      }
    }

    if (addTrack === true) {
      // log when track is added
      if (repeatTrack === true) {
        (repeatTracks = repeatTracks + 1)
      }

      previousAlbums.push(track.albumId)
      reportTag = (reportTag === "") ? "added: new track!" : reportTag

      // add track to playlist
      uniqueTracks.push(track)
    }
    reportTracks.push(`${reportTag} - ${track.trackInfo}`)

    // stop when 10 tracks are added
    if (uniqueTracks.length === 10) {
      print(reportTracks)
      return uniqueTracks
    }
  }
}

async function getAllTracksAndCreatePlaylist(mode, month) {
  const validModes = ['publish', 'report', 'test']
  if (validModes.indexOf(mode) === -1) {
    print("no mode or invalid provided. program ending")
    return
  }
  
  // get tracks from last weeks playlist
  const playlistAuth = await accounts.getTokenFromRefreshToken(createPlaylistRefreshToken)
  const lastWeeksPlaylist = await webapi.getPlaylistTracks(playlistAuth.access_token, realPlaylistId)
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
  print(`the offset is ${offset}`)

  // get top tracks from each user, filter based on rules, and add to new tracks list
  var currentWeekTracks = []
  for (i = 0; i < noOfUsers; i++) {
    var pointer = (i + offset) % noOfUsers
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
    print(currentWeekTracks)
    print(tracksForData)
    const playlistId = (mode === "publish") ? realPlaylistId : testPlaylistId
    webapi.createPlaylist(playlistAuth.access_token, tracksForData, playlistId, true)
  }
}

module.exports = { getAllTracksAndCreatePlaylist }
