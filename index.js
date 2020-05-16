const token = 'BQCwnk5Zg0kHiWR10qS8RCwwtzrton1VEQ3I0GFQry2RTLl41axW_3IHBtCFoO_NL4AmaHiqkLlb1NyM0Ewmm5XFYB_BRP4Hc5WhBPbrkaGZDvMUfifGFkDvKwKetoNZMDePm50XpBKPuLDHNjEbghPgNjlm2gx09JsWCusX97Hldq9YFehPCwdL2LGC_WD_fGjTXqsQYpogbzGJOELZSanobDnYOLUoHg8Ml6cvgUw-Y9M'

async function getTopTenUniqueTracksForUser(token) {
  let limit = 10
  let offset = 0
  const https = require('https')
  const options = {
    hostname: 'api.spotify.com',
    port: 443,
    path: `/v1/me/top/tracks?time_range=short_term&limit=${limit}&offset=${offset}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }
  
  const req = https.request(options, res => {
    console.log(`statusCode: ${res.statusCode}`)
    let data = ''
    res.on('data', (chunk) => {
      data += chunk
    })

    let allTracks
    let uniqueTracks
    res.on('end', () => {
      allTracks = JSON.parse(data).items
      uniqueTracks = getUniqueTracks(allTracks)
      checkIfEnoughTracks(uniqueTracks)
    })
  })
  req.on('error', error => {
    console.error(error)
  })

  req.end()
}

function getUniqueTracks(tracks) {
  // will return a maximum of 10 but not necessarily 10 tracks
  let previousAlbum = []
      let uniqueTracks = []
      for (i = 0; i < tracks.length; i++) {
        let album = tracks[i].album.id
        let track = tracks[i].id
        
        if (!previousAlbum.includes(album)) {
          uniqueTracks.push(track)
          previousAlbum.push(album)
        }
        if (uniqueTracks.length === 10) {
          break;
        }
      }
      return uniqueTracks
}

getTopTenUniqueTracksForUser(token)

function checkIfEnoughTracks(uniqueTracks) {
  console.log(uniqueTracks)
  if (uniqueTracks.length < 10) {
    console.log("hello")
  }
}
