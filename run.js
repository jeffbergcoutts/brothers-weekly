const playlistGenerator = require("./playlistGenerator");

const option1 = process.argv[2] || "" // run mode, 'publish' will modify real playlists, 'test' will modify test playlists, 'report' will only simulate run
const option2 = process.argv[3] || "" // manual override to run on days other than Monday, use 'manual' to run
const option3 = process.argv[4] || "" // month override to test playlist order, enter number, starting with 0 for Jan to 11 for Dec

// Check Run Mode
const mode = (!option1) ? "" : option1
console.log(`mode: ${mode}`)

if (mode === "") {
  console.log("You must select a mode. 'publish' will update real playlists, 'test' will update test playlists, 'report' will only print results")
  return;
}

// Set Run Options
const date = new Date();
const day = date.getDay();

 // use the real month or a user input to determine playlist member order
let month = ""
if (option3 != "") {
  month = parseInt(option3);
  console.log(`you've entered a test month of ${month}`)
} else {
  month = date.getMonth();
  console.log(`the current month is ${month}`)
}

// only run on Mondays, of if overide entered
if ((day === 1) || (option2 === "manual")) {
  playlistGenerator.getAllTracksAndCreatePlaylist(mode, month)
} else {
  console.log("Program not run, only runs on Monday. Use arg 2 'manual' to override")
}