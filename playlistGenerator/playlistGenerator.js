require('dotenv').config()
const webapi = require('../spotify-clients/webapi.js')
const accounts = require('../spotify-clients/accounts.js')

const { print, getTrackIdsFromPlaylist, createTrackListForPlaylistCreation, getOffsetForPlaylistUserOrder } = require("./utils/helpers.js")
const { filterUsersTopTracks, getPlaylistDenylistTracks } = require("./applyRules.js")

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
  for (j = 0; j < noOfUsers; j++) {
    var pointer = ((j + offset) % noOfUsers) // based order on offset, determined by week number
    print(`pointer: ${pointer}`)

    var userRefreshToken = userRefreshTokens[pointer]
    var userAuth = await accounts.getTokenFromRefreshToken(userRefreshToken)
    const userAccessToken = JSON.parse(userAuth).access_token
    const topTracksForUser = await webapi.getUsersTopTracks(userAccessToken)

    // get tracks list on playlist denylist for each user to pass to the filter function TODO - put this all in filter?
    const playlistDenylistTracks = await getPlaylistDenylistTracks(userRefreshToken, userAccessToken)

    //filter tracks based on rules and denylist
    eligibleTracks = filterUsersTopTracks(topTracksForUser, lastWeeksTracks, currentWeekTracks, playlistDenylistTracks)
    currentWeekTracks = currentWeekTracks.concat(eligibleTracks)
  }
  console.log(`current weeks tracks: ${currentWeekTracks}`)
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

module.exports = { getAllTracksAndCreatePlaylist }
