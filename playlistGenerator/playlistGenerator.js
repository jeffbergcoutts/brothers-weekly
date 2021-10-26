require('dotenv').config()
const { print, getTrackIdsFromPlaylist, createTrackListForPlaylistCreation, getOffsetForPlaylistUserOrder } = require("./utils/helpers.js")
const { transformUsersTopTracksResponse } = require("../spotify-clients/dataTransformers.js")
const webapi = require('../spotify-clients/webapi.js')
const accounts = require('../spotify-clients/accounts.js')
const { overrides } = require('./utils/overrides.js')

function filterUsersTopTracks(topTracksForUser, lastWeeksTracks, currentWeekTracks) {
  // Takes a JSON object of a user Top Tracks as returned from the Spotify Web Api
  // will return a maximum of 10 track Id's in an array
  // general rules: 
  //   nothing from denylist
  //   no repeats on current playlist
  // per user rules
  //   max 5 repeats from last weeks playlist
  //   max 3 from one album

  const artistDenylist = overrides.denylist.artists
  const albumDenylist = overrides.denylist.albums

  let uniqueTracks = []
  let repeatTracks = 0
  let previousAlbums = []
  let reportTracks = []
  
  const tracks = transformUsersTopTracksResponse(topTracksForUser)

  for (x = 0; x < tracks.length; x++) {
    const albumId = tracks[x].albumId
    const artistId = tracks[x].artistId
    const trackId = tracks[x].trackId
    
    let reportTag = ""
    let addTrack = true
    let repeatTrack = false
    let repeatAlbumCount = 0

     // don't add if track is already on the playlist
    if (currentWeekTracks.includes(trackId)) {
      addTrack = false
      reportTag = "skipped: already on playlist"
    }

     // don't add if artist is on denylist
    if (artistDenylist.includes(artistId)) {
      addTrack = false
      reportTag = "skipped: artist on denylist"
    }
    // don't add if album is on denylist
    if (albumDenylist.includes(albumId)) {
      addTrack = false
      reportTag = "skipped: album on denylist"
    }

    // check if track was on last weeks playlist
    if (lastWeeksTracks.includes(trackId)) {
      repeatTrack = true
      if (repeatTracks > 4) { // don't add if already 5 repeat songs
        addTrack = false
        reportTag = "skipped: on last weeks playlist (over max of 5 tracks)"
      } else {
        reportTag = (addTrack === true) ? "added: on last weeks playlist (under max of 5)" : reportTag
      }
    }

    //check if it's already 3 repeats from the same album
    if (previousAlbums.includes(albumId)) {
      repeatAlbumCount = previousAlbums.filter((v) => (v === albumId)).length
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

      previousAlbums.push(albumId)
      reportTag = (reportTag === "") ? "added: new track!" : reportTag

      // add track to playlist
      uniqueTracks.push(trackId)
    }
    
    // report track names and action for debugging
    reportTracks.push(`${reportTag} - ${tracks[x].artistName} - ${tracks[x].albumName} - ${tracks[x].trackName}`)
    
    // stop when 10 tracks are collected
    if (uniqueTracks.length === 10) {
      print(reportTracks)
      return uniqueTracks
    }
  }
}

async function getAllTracksAndCreatePlaylist(mode, weekNumber) {
  const userRefreshTokens = [
    process.env.REFRESHTOKEN1,
    process.env.REFRESHTOKEN2,
    process.env.REFRESHTOKEN3
  ]
  const playlistOwnerRefreshToken = process.env.REFRESHTOKENPLAYLIST
  // run program in different modes and reject if invalid mode provided
  const validModes = ['publish', 'report', 'test']
  if (validModes.indexOf(mode) === -1) {
    const errorMessage = "no mode or invalid provided. program ending"
    print(errorMessage)
    return errorMessage
  }

  let archivePlaylistId = ""
  let playlistId = ""
  switch(mode) {
    case "publish":
      archivePlaylistId = process.env.ARCHIVEPLAYLISTID
      playlistId = process.env.PLAYLISTID
      break
    case "test":
      archivePlaylistId = process.env.TESTARCHIVEPLAYLISTID
      playlistId = process.env.TESTPLAYLISTID
      break
    case "report":
      playlistId = process.env.PLAYLISTID
      break
  }
  
  // get tracks from last weeks playlist
  const playlistOwnerAuth = await accounts.getTokenFromRefreshToken(playlistOwnerRefreshToken)
  const playlistOwnerAccessToken = JSON.parse(playlistOwnerAuth).access_token
  const lastWeeksPlaylist = await webapi.getPlaylistTracks(playlistOwnerAccessToken, playlistId)
  const lastWeeksTracks = getTrackIdsFromPlaylist(lastWeeksPlaylist)

  const noOfUsers = userRefreshTokens.length
  print(`no of users: ${noOfUsers}`)

  const offset = getOffsetForPlaylistUserOrder(weekNumber, noOfUsers)
  print(`offset: ${offset}`)

  // get top tracks from each user, filter based on rules, and add to new tracks list
  var currentWeekTracks = []
  for (i = 0; i < noOfUsers; i++) {
    var pointer = ((i + offset) % noOfUsers) // based order on offset, determined by week number
    print(`pointer: ${pointer}`)

    var userAuth = await accounts.getTokenFromRefreshToken(userRefreshTokens[pointer])
    const userAccessToken = JSON.parse(userAuth).access_token

    var topTracksForUser = await webapi.getUsersTopTracks(userAccessToken)
    var eligibleTracks = filterUsersTopTracks(topTracksForUser, lastWeeksTracks, currentWeekTracks)

    currentWeekTracks = currentWeekTracks.concat(eligibleTracks)
  }
  
  // update archive playlist and shared weekly playlist
  if (mode != "report") {
    // add tracks to archive
    const archiveTrackList = createTrackListForPlaylistCreation(lastWeeksTracks)
    webapi.addToPlaylist(playlistOwnerAccessToken, archiveTrackList, archivePlaylistId)

    // replace playlist with new tracks
    const trackList = createTrackListForPlaylistCreation(currentWeekTracks)
    webapi.createPlaylist(playlistOwnerAccessToken, trackList, playlistId)
  }
}

module.exports = { filterUsersTopTracks, getAllTracksAndCreatePlaylist }
