const { runPlaylistGeneratorWithOptions } = require("./run.js")
const { getAllTracksAndCreatePlaylist } = require("./playlistGenerator")

jest.mock("./playlistGenerator")

beforeEach(() => {
  jest
    .useFakeTimers('modern')
    .setSystemTime(new Date('2021-10-04').getTime()) // set the day to a Monday so the playlistGenerator runs
})

afterEach(() => {    
  jest.clearAllMocks();
})

test('will not start playlistGenerator if no mode is provided', () => {
  runPlaylistGeneratorWithOptions("", "", "")
  runPlaylistGeneratorWithOptions(null, "", "")
  runPlaylistGeneratorWithOptions(undefined, "", "")
  expect(getAllTracksAndCreatePlaylist).not.toHaveBeenCalled()
})

test('will start playlistGenerator if any mode is provided', () => {
  runPlaylistGeneratorWithOptions("mode", "", "")
  expect(getAllTracksAndCreatePlaylist).toHaveBeenCalledWith("mode", 40)
})

test('will start playlistGenerator on Mondays', () => {
  runPlaylistGeneratorWithOptions("publish", "", "")
  expect(getAllTracksAndCreatePlaylist).toHaveBeenCalled()
})

test('will not start playlistGenerator on days other than Monday', () => {
  jest.setSystemTime(new Date('2021-10-05').getTime()) // Tuesday
  runPlaylistGeneratorWithOptions("publish", "", "")
  expect(getAllTracksAndCreatePlaylist).not.toHaveBeenCalled()
})

test('will start playlistGenerator on days other than Monday if manual override given', () => {
  jest.setSystemTime(new Date('2021-10-05').getTime())  // Tuesday
  runPlaylistGeneratorWithOptions("publish", "1", "")
  expect(getAllTracksAndCreatePlaylist).toHaveBeenCalled()
})

test('will start playlistGenerator with a test week number if provided', () => {
  runPlaylistGeneratorWithOptions("publish", "", "8")
  expect(getAllTracksAndCreatePlaylist).toHaveBeenCalledWith("publish", 8)
})

test('will start playlistGenerator with the week number if no override provided', () => {
  runPlaylistGeneratorWithOptions("publish", "", "")
  expect(getAllTracksAndCreatePlaylist).toHaveBeenCalledWith("publish", 40)
})
