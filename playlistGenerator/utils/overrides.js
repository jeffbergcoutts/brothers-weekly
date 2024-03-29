require('dotenv').config()

const overrides = {
    denylist: {
        tracks: [
            "7zyvB7mcZx4dPVUJSHmFZ7",
            "16oPahnRcrfG6xDqOZnlUF",
            "1GLfy1ihm081aOruK0uZU0",
            "5LyfiK6iXEIBNEtcaGKohl",
            "0xeOilcag5yUvkShSTybHB",
            "64pQtAaD9WbSMbdj2gkU6u",
            "1Q6h73UKeNO0AtA1TRS3tL",
            "2WGaQW21lFtONOqA5WeQZz"
        ],
        albums: [
            "6AVhZFoVQNjVKTb2lVNokw",
            "2T9jkpdjKDjzoOqPfaCAMu",
            "1S7mumn7D4riEX2gVWYgPO",
            "4AisqgQXW57ADDJRBQOpON",
            "6FGyqglqi0oS3tl4SxyZxf",
            "1a4SgsQYl2B2PmI5XffWW5",
            "3wZTKnhwWhTW5EwfyGc4OT",
            "7gKdoim3rYHoNGw4p71kJx",
            "1JhBsDO3UOMEVSKVP5oN7E",
            "3Gt7rOjcZQoHCfnKl5AkK7",
            "OBgClIW2TVO3dlhSZ9g5IQ"
        ],
        artists: [
            "1V95p8oWGxXlpcFRYqXV3w",
            "1XzY7sGHYarxdc9u2Ks1oU",
            "6YYk2yfx7jUHLfI5W1sgNi",
            "7oWSqrgMuIEyH9qp5nu2e5",
            "0w5SU4gzff0dsC2aohgIzU",
            "6nCO4Jv7mU99OS6jLevYVH",
            "2I9JVgirByTBg7g4EHNQh5",
            "6VF93ZcQqYC1kLJdcsmuex",
            "2A3DK9TwLnlkjI5OMITTjQ",
            "6ufVQnyyFBLj8YzcKG3OYl",
            "6goK4KMSdP4A8lw8jk4ADk"
        ],
        playlists: [
            {
                refreshToken: process.env.REFRESHTOKEN2,
                playlistIDs: [
                    "1hovmD1aDKIVw7c74e0Biu",
                    "2bQvpMjqN1PedUrCBLW0pY"
                ]
            }
        ]
    }
}

module.exports = {overrides}
