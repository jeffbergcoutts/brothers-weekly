const getPlaylistTracksResponse = JSON.stringify({
  "href" : "https://api.spotify.com/v1/playlists/6wJtRbnoQzo7sUc3S8NTdT/tracks?offset=0&limit=100",
  "items" : [ {
    "added_at" : "2021-10-26T09:32:20Z",
    "added_by" : {
      "external_urls" : {
        "spotify" : "https://open.spotify.com/user/bergcoutts"
      },
      "href" : "https://api.spotify.com/v1/users/bergcoutts",
      "id" : "bergcoutts",
      "type" : "user",
      "uri" : "spotify:user:bergcoutts"
    },
    "is_local" : false,
    "primary_color" : null,
    "track" : {
      "album" : {
        "album_type" : "album",
        "artists" : [ {
          "external_urls" : {
            "spotify" : "https://open.spotify.com/artist/5GJWwpX2tnOruZviItXvM6"
          },
          "href" : "https://api.spotify.com/v1/artists/5GJWwpX2tnOruZviItXvM6",
          "id" : "5GJWwpX2tnOruZviItXvM6",
          "name" : "William Prince",
          "type" : "artist",
          "uri" : "spotify:artist:5GJWwpX2tnOruZviItXvM6"
        } ],
        "available_markets" : [ "CA" ],
        "external_urls" : {
          "spotify" : "https://open.spotify.com/album/6sesQu02oxMGUbhYViaVTN"
        },
        "href" : "https://api.spotify.com/v1/albums/6sesQu02oxMGUbhYViaVTN",
        "id" : "6sesQu02oxMGUbhYViaVTN",
        "images" : [ {
          "height" : 640,
          "url" : "https://i.scdn.co/image/ab67616d0000b273b89e19b4629e3d71f6b5b862",
          "width" : 640
        }, {
          "height" : 300,
          "url" : "https://i.scdn.co/image/ab67616d00001e02b89e19b4629e3d71f6b5b862",
          "width" : 300
        }, {
          "height" : 64,
          "url" : "https://i.scdn.co/image/ab67616d00004851b89e19b4629e3d71f6b5b862",
          "width" : 64
        } ],
        "name" : "Reliever",
        "release_date" : "2020-02-07",
        "release_date_precision" : "day",
        "total_tracks" : 11,
        "type" : "album",
        "uri" : "spotify:album:6sesQu02oxMGUbhYViaVTN"
      },
      "artists" : [ {
        "external_urls" : {
          "spotify" : "https://open.spotify.com/artist/5GJWwpX2tnOruZviItXvM6"
        },
        "href" : "https://api.spotify.com/v1/artists/5GJWwpX2tnOruZviItXvM6",
        "id" : "5GJWwpX2tnOruZviItXvM6",
        "name" : "William Prince",
        "type" : "artist",
        "uri" : "spotify:artist:5GJWwpX2tnOruZviItXvM6"
      } ],
      "available_markets" : [ "CA" ],
      "disc_number" : 1,
      "duration_ms" : 239693,
      "episode" : false,
      "explicit" : false,
      "external_ids" : {
        "isrc" : "USYAH1900119"
      },
      "external_urls" : {
        "spotify" : "https://open.spotify.com/track/11AyynOmB7yiXr84DzEsxj"
      },
      "href" : "https://api.spotify.com/v1/tracks/11AyynOmB7yiXr84DzEsxj",
      "id" : "11AyynOmB7yiXr84DzEsxj",
      "is_local" : false,
      "name" : "The Spark",
      "popularity" : 42,
      "preview_url" : "https://p.scdn.co/mp3-preview/a8430e901258e9f4bc19196b57c94269e9cd778c?cid=173235c8402741b3bbc398c1f3e1f0d2",
      "track" : true,
      "track_number" : 1,
      "type" : "track",
      "uri" : "spotify:track:11AyynOmB7yiXr84DzEsxj"
    },
    "video_thumbnail" : {
      "url" : null
    }
  } ],
  "limit" : 100,
  "next" : null,
  "offset" : 0,
  "previous" : null,
  "total" : 30
})

const getUsersTopTracksResponse = JSON.stringify({
  "items" : [ {
    "album" : {
      "album_type" : "ALBUM",
      "artists" : [ {
        "external_urls" : {
          "spotify" : "https://open.spotify.com/artist/5GJWwpX2tnOruZviItXvM6"
        },
        "href" : "https://api.spotify.com/v1/artists/5GJWwpX2tnOruZviItXvM6",
        "id" : "5GJWwpX2tnOruZviItXvM6",
        "name" : "William Prince",
        "type" : "artist",
        "uri" : "spotify:artist:5GJWwpX2tnOruZviItXvM6"
      } ],
      "available_markets" : [ "CA" ],
      "external_urls" : {
        "spotify" : "https://open.spotify.com/album/6sesQu02oxMGUbhYViaVTN"
      },
      "href" : "https://api.spotify.com/v1/albums/6sesQu02oxMGUbhYViaVTN",
      "id" : "6sesQu02oxMGUbhYViaVTN",
      "images" : [ {
        "height" : 640,
        "url" : "https://i.scdn.co/image/ab67616d0000b273b89e19b4629e3d71f6b5b862",
        "width" : 640
      }, {
        "height" : 300,
        "url" : "https://i.scdn.co/image/ab67616d00001e02b89e19b4629e3d71f6b5b862",
        "width" : 300
      }, {
        "height" : 64,
        "url" : "https://i.scdn.co/image/ab67616d00004851b89e19b4629e3d71f6b5b862",
        "width" : 64
      } ],
      "name" : "Reliever",
      "release_date" : "2020-02-07",
      "release_date_precision" : "day",
      "total_tracks" : 11,
      "type" : "album",
      "uri" : "spotify:album:6sesQu02oxMGUbhYViaVTN"
    },
    "artists" : [ {
      "external_urls" : {
        "spotify" : "https://open.spotify.com/artist/5GJWwpX2tnOruZviItXvM6"
      },
      "href" : "https://api.spotify.com/v1/artists/5GJWwpX2tnOruZviItXvM6",
      "id" : "5GJWwpX2tnOruZviItXvM6",
      "name" : "William Prince",
      "type" : "artist",
      "uri" : "spotify:artist:5GJWwpX2tnOruZviItXvM6"
    } ],
    "available_markets" : [ "CA" ],
    "disc_number" : 1,
    "duration_ms" : 239693,
    "explicit" : false,
    "external_ids" : {
      "isrc" : "USYAH1900119"
    },
    "external_urls" : {
      "spotify" : "https://open.spotify.com/track/11AyynOmB7yiXr84DzEsxj"
    },
    "href" : "https://api.spotify.com/v1/tracks/11AyynOmB7yiXr84DzEsxj",
    "id" : "11AyynOmB7yiXr84DzEsxj",
    "is_local" : false,
    "name" : "The Spark",
    "popularity" : 42,
    "preview_url" : "https://p.scdn.co/mp3-preview/a8430e901258e9f4bc19196b57c94269e9cd778c?cid=173235c8402741b3bbc398c1f3e1f0d2",
    "track_number" : 1,
    "type" : "track",
    "uri" : "spotify:track:11AyynOmB7yiXr84DzEsxj"
  } ],
  "total" : 50,
  "limit" : 50,
  "offset" : 0,
  "previous" : null,
  "href" : "https://api.spotify.com/v1/me/top/tracks?limit=50&offset=0&time_range=short_term",
  "next" : null
})

const addToPlaylistResponse = JSON.stringify({
  "snapshot_id" : "NTQsNzZiNGY0Y2U0ZTI3YTAxNzk5NjhhOWMyODE2NjNhODNjMzVlNDYwNg=="
})

const createPlaylistResponse = JSON.stringify({
  "snapshot_id" : "NTQsNzZiNGY0Y2U0ZTI3YTAxNzk5NjhhOWMyODE2NjNhODNjMzVlNDYwNg=="
})

module.exports = { getPlaylistTracksResponse, getUsersTopTracksResponse, addToPlaylistResponse, createPlaylistResponse }
