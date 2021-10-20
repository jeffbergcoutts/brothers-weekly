function transformPlaylistTracksResponse(playlist) {
  // takes a JSON response from the Spotify Web API with all tracks from a Playlist
  // returns a JSON object with just the data needed to display in the front end

  let tracks
  try {
    tracks = JSON.parse(playlist).items
  } catch(err) {
    console.error("error reading JSON response")
    return err
  }
  
  let data = []
  tracks.map((track) => (
    data.push({
      "albumName": track.track.album.name,
      "albumUrl": track.track.album.external_urls.spotify,
      "albumImageUrl": track.track.album.images[1].url,
      "artistName": track.track.artists[0].name,
      "artistUrl": track.track.artists[0].external_urls.spotify,
      "trackName": track.track.name,
      "trackUrl": track.track.external_urls.spotify
    })
  ))

  return JSON.stringify(data)
}

function transformUsersTopTracksResponse(topTracks) {
  // takes a JSON response from the Spotify Web API with a users Top Tracks
  // returns an object literal with the data needed for the Playlist Generator to determine tracks for the playlist

  let tracks
  try {
    tracks = JSON.parse(topTracks).items
  } catch(err) {
    console.error("error reading JSON response")
    return err
  }
  
  let data = []
  tracks.map((track) => (
    data.push({
      "albumId": track.album.id,
      "albumName": track.album.name,
      "artistId": track.artists[0].id,
      "artistName": track.artists[0].name,
      "trackId": track.id,
      "trackName": track.name
    })
  ))

  return data
}

module.exports = { transformPlaylistTracksResponse, transformUsersTopTracksResponse }
