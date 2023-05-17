# Brothers Weekly

## Overview
Generates a shared playlist for set of users, based on their most listened to songs from the last 4 weeks. Updated weekly.

## Rules
* 10 songs per user
* Max 5 repeats per user from last weeks playlist
* Max 3 songs from the same album per user
* No repeats on current playlist, so if one of your tops tracks is already on the playlist, the next eligible one will be taken
* Because of the above ^ the order of who's tracks are considered changes every month

## Denylist
* the overrides.js file includes a denylist that takes tracks, albums, artists and playlists per user
* any track found on this list will not be added to the playlist

## To run
Install [node](https://nodejs.org/en/download/)
 
Install dependencies

```bash
$ yarn
```

Run Program in various modes

```bash
# test run will output report
$ node playlistGenerator/run.js report

# to run and publish
$ node playlistGenerator/run.js publish

# to run and publish to test playlist
$ node playlistGenerator/run.js test

# overrides for day and week
$ node playlistGenerator/run.js <mode> <day> <week>

# examples

# program will only run on Mondays so to publish on another day you need ot add 1 as the day override
$ node playlistGenerator/run.js publish 1

# week number is used to determine the order of the playlist to test with the dev playlist on week number 13
$ node playlistGenerator/run.js test 1 13
```

## Webpage
Build and Run locally:

```bash
# test production build
$ yarn build
$ yarn start # served at http://localhost:3001/

# test client changes locally
$ cd client
$ yarn start # served at http://localhost:3000/
```

Deploy to Heroku
```bash
git push heroku master
```

Login here to access Playlist: https://brothers-weekly.herokuapp.com/

Heroku Dashboard: https://dashboard.heroku.com/apps/brothers-weekly

Link to [Brothers Weekly Playlist](https://open.spotify.com/playlist/0NADibKvY5ApsQVxIGuWKr?si=HZTsqF9TTU2EsSLlxTsAMg)
