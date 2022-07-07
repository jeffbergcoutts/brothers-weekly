const { getAllTracksAndCreatePlaylist } = require("./playlistGenerator")
const { getTokenFromRefreshTokenResponse } = require("./utils/mocks/accounts.js")
const { getPlaylistTracksResponse, getUsersTopTracksResponse } = require("./utils/mocks/webapi.js")

const webapi = require("../spotify-clients/webapi.js")
const accounts = require("../spotify-clients/accounts.js")

jest.mock("../spotify-clients/webapi.js")
jest.mock("../spotify-clients/accounts.js")

//return values from mocks
const createTrackListForPlaylistCreationReturnValue = "{\"uris\": [\"spotify:track:11AyynOmB7yiXr84DzEsxj\"]}"
const accessTokenMockValue = "accessToken"

// mock internal functionsl
accounts.getTokenFromRefreshToken.mockResolvedValue(getTokenFromRefreshTokenResponse)
webapi.getPlaylistTracks.mockResolvedValue(getPlaylistTracksResponse)
webapi.getUsersTopTracks.mockResolvedValue(getUsersTopTracksResponse)

afterEach(() => {
  jest.clearAllMocks();
});

test('will not run if invalid mode is provided', async () => {
  const data = await getAllTracksAndCreatePlaylist("invalidMode", "")
  expect(data).toBe('no mode or invalid provided. program ending')  
})

test('updates test playlists in test mode', async () => {
  await getAllTracksAndCreatePlaylist("test", "")
  expect(webapi.addToPlaylist).toHaveBeenCalledWith(accessTokenMockValue, createTrackListForPlaylistCreationReturnValue, "testArchivePlaylistId")
  expect(webapi.createPlaylist).toHaveBeenCalledWith(accessTokenMockValue, createTrackListForPlaylistCreationReturnValue, "testPlaylistId")
})

test('updates real playlists in publish mode', async () => {
  await getAllTracksAndCreatePlaylist("publish", "")
  expect(webapi.addToPlaylist).toHaveBeenCalledWith(accessTokenMockValue, createTrackListForPlaylistCreationReturnValue, "archivePlaylistId")
  expect(webapi.createPlaylist).toHaveBeenCalledWith(accessTokenMockValue, createTrackListForPlaylistCreationReturnValue, "playlistId")
})

test('will not update playlists in report mode', async () => {
  await getAllTracksAndCreatePlaylist("report", "")
  expect(webapi.addToPlaylist).not.toHaveBeenCalled()
  expect(webapi.createPlaylist).not.toHaveBeenCalled()
})


// get tracks for each user provided - starts in right place?
