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

function getWeekNumber() {
  const today = new Date();
  const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
  const daysPastThisYear = (today - firstDayOfYear) / 86400000;
  return Math.floor((daysPastThisYear + firstDayOfYear.getDay() - 1) / 7);
}

// determine offset to start looping through users based on week number - this determines the starting user - changes every week
// in a list of 3 users, the offset should be as follows: user 1 = 0, user 2 = 1, user 3 = 2
function getOffsetForPlaylistUserOrder(weekNumber, noOfUsers) {
  let offset
  if (weekNumber < noOfUsers) { // ex. 2nd week, 3 users. offset = 1 (2nd user)
    offset = weekNumber - 1
  } else if ((weekNumber % noOfUsers) === 0) { // ex 6th week, 3 users. offset = 2 (3rd user)
    offset = noOfUsers - 1
  } else { // ex 7th week, 3 users. offset = 0 (1st user)
    offset = (weekNumber % noOfUsers) - 1 
  }
  return offset
}

module.exports = { print, getTrackIdsFromPlaylist, createTrackListForPlaylistCreation, getWeekNumber, getOffsetForPlaylistUserOrder }