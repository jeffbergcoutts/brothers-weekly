const getTokenFromRefreshTokenResponse = JSON.stringify({
  "access_token":"accessToken",
  "token_type":"Bearer",
  "expires_in":3600,
  "scope":"scopes"
})

module.exports = { getTokenFromRefreshTokenResponse }
