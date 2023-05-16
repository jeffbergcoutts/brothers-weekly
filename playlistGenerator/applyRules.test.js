const { filterUsersTopTracks } = require("./filterUsersTopTracks")
const { getPlaylistTracksResponse, getUsersTopTracksResponse } = require("./utils/mocks/webapi.js")
const topTracksForUser = getUsersTopTracksResponse

afterEach(() => {
  jest.clearAllMocks();
});

test('will not add songs from a playlist on the denylist', async () => {
  const data = await getAllTracksAndCreatePlaylist("invalidMode", "")
  expect(data).toBe('no mode or invalid provided. program ending')  
})