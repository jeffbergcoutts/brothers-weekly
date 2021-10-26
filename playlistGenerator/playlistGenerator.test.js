const { filterUsersTopTracks, getAllTracksAndCreatePlaylist } = require("./playlistGenerator")

test('will not run if invalid mode is provided', async () => {
  const data = await getAllTracksAndCreatePlaylist("invalidMode", "")
  expect(data).toBe('no mode or invalid provided. program ending')  
})