require('dotenv').config()
const { print, getWeekNumber } = require("./utils/helpers.js")
const { getAllTracksAndCreatePlaylist } = require("./playlistGenerator")

const option1 = process.argv[2] // run mode, {'publish', 'test', 'report'}
const option2 = process.argv[3] // day number, used to determine whether playlist should be run or not
const option3 = process.argv[4] // week number, used to determine playlist user order

runPlaylistGeneratorWithOptions(option1, option2, option3)

function runPlaylistGeneratorWithOptions(option1, option2, option3) {
    // Check for Run Mode
  const mode = (option1) ? option1 : ""
  if (mode === "") {
    print("You must select a mode. 'publish' will update real playlists, 'test' will update test playlists, 'report' will only print track results")
    return
  } else {
    print(`mode: ${mode}`)
  }

  // Set day and week number, use overrides if provided
  const date = new Date()
  const day = (option2 ? parseInt(option2) : date.getDay())
  const weekNumber = (option3 ? parseInt(option3) : getWeekNumber())

  // Only generate playlist on Mondays (day=1)
  if (day === 1) {
    print(`Program ran with day: ${day}, weekNumber: ${weekNumber}`)
    getAllTracksAndCreatePlaylist(mode, weekNumber)
  } else {
    print("Program not run, only runs on Monday. Use process.argv[2] to override day")
  }
}

module.exports = { runPlaylistGeneratorWithOptions }
