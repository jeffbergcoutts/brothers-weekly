require('dotenv').config()
const { print } = require("./utils/helpers.js")
const { getAllTracksAndCreatePlaylist } = require("./playlistGenerator")

const option1 = process.argv[2] // run mode, 'publish' will modify real playlists, 'test' will modify test playlists, 'report' will only simulate run
const option2 = process.argv[3] // manual override to run on days other than Monday, use 'manual' to run
const option3 = process.argv[4] // month override to test playlist order, enter number, starting with 0 for Jan to 11 for Dec

runPlaylistGeneratorWithOptions(option1, option2, option3)

function runPlaylistGeneratorWithOptions(option1, option2, option3) {
  const mode = (!option1) ? "" : option1
  const dayOverride = (!option2) ? "" : option2
  const monthOverride = (!option3) ? "" : option3
  
  // CHECK FOR RUN MODE
  if (mode === "") {
    print("You must select a mode. 'publish' will update real playlists, 'test' will update test playlists, 'report' will only print results")
    return
  } else {
    print(`mode: ${mode}`)
  }

  // SET RUN OPTIONS
  const date = new Date()
  const day = date.getDay()

  // use the real month or a user input to determine playlist member order
  let month = ""
  if (monthOverride != "") {
    month = parseInt(monthOverride);
    print(`you've entered a test month of ${month} for the playlist order`)
  } else {
    month = date.getMonth();
    print(`the current month of ${month} will be used for the playlist order`)
  }

  // only run on Mondays, of if overide entered
  if ((day === 1) || (dayOverride === "manual")) {
    getAllTracksAndCreatePlaylist(mode, month)
  } else {
    print("Program not run, only runs on Monday. Use process.argv[2] 'manual' to override")
  }
}

module.exports = { runPlaylistGeneratorWithOptions }
