function Track(albumId, artistId, trackId, albumUrl) {
  this.albumId = albumId;
  this.artistId = artistId;
  this.trackId = trackId;
  this.albumUrl = albumUrl;
}

function Response(tracks) {
  return tracks
}

function transformTracksResponse(playlist) {
  // takes a JSON response from the Spotify Web API with all tracks from a Playlist
  // returns a JSON object with just the data needed to display in the front end

  const tracks = JSON.parse(playlist).items
  
  let data = []
  tracks.map((track) => (
    data.push({
      "albumImageUrl": track.track.album.images[1].url,
      "albumName": track.track.album.name,
      "albumUrl": track.track.album.external_urls.spotify,
      "artistName": track.track.artists[0].name,
      "artistUrl": track.track.artists[0].external_urls.spotify,
      "trackName": track.track.name,
      "trackUrl": track.track.external_urls.spotify
    })
  ))

  // const data = JSON.stringify(testData)
  return JSON.stringify(data)
}

module.exports = { transformTracksResponse }
