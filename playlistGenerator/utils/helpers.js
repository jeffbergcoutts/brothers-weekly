const logToConsole = process.env.LOGTOCONSOLE

function print(message) {
  if (logToConsole != "false") console.log(message)
}

function getTrackIdsFromPlaylist(playlist) {
  // takes a JSON response from Spotify Web API with tracks in a playlist and return an array of trackID's
  const tracks = JSON.parse(playlist).items
  let trackIDs = []
  for (i = 0; i < tracks.length; i++) {
    let track = tracks[i].track.id
    trackIDs.push(track)
  }
  return trackIDs
}

function createTrackListForPlaylistCreation(trackIds) {
  // takes an array of trackID's and returns a JSON object in the correct format to create a playlist
  const trackList = trackIds.map(track => {
    return 'spotify:track:' + track
    })
  
  return `{"uris": ${JSON.stringify(trackList)}}`
}

module.exports = { print, getTrackIdsFromPlaylist, createTrackListForPlaylistCreation }