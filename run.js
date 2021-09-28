const playlistGenerator = require("./playlistGenerator");

const date = new Date();

const day = date.getDay();
console.log(day)

const option1 = process.argv[2] || "" // run mode
const option2 = process.argv[3] || "" // manual override to run on days other than Monday
const option3 = process.argv[4] || "" // month override to test playlist order

// get run mode from user input
switch(option1) {
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
  return;
}

 // determine whether to use the real month or a user input to determine playlist order
let month = ""
if (option3 != "") {
  month = parseInt(option3);
  console.log(`you've entered a test month of ${month}`)
} else {
  month = date.getMonth();
  console.log(`the current month is ${month}`)
}

// only run on Mondays, of if useroveride entered
if ((day === 1) || (option2 === "manual")) {
  playlistGenerator.getAllTracksAndCreatePlaylist(mode, month)
} else {
  console.log("Program not run, only runs on Monday. Use arg 2 'manual' to override")
}