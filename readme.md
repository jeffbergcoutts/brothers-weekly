# Brothers Weekly

## Overview
<<<<<<< HEAD
Generates a playlist of top tracks from a set of users from the past 4 months, updated weekly.

## Rules
* 15 songs each
* Max 5 repeats from last weeks playlist
=======
Generates a shared playlist for set of users, based on their most listened to songs from the last 4 weeks. Updated weekly.

## Rules
* 10 songs per user
* Max 5 repeats per user from last weeks playlist
* Max 3 songs from the same album per user
>>>>>>> 614fbb103feaa3d32197fa76698d99f048bab999
* No repeats on current playlist, so if one of your tops tracks is already on the playlist, the next eligible one will be taken
* Because of the above ^ the order of who's tracks are considered changes every month

## To run
Install [node](https://nodejs.org/en/download/)
 
Install dependencies

```bash
$ npm install
```

Run Program in various modes

```bash
# test run will output report
$ node index.js

# to run and publish
$ node index.js publish

# to run and publish to test playlist
$ node index.js test

# to run with desired start position
$ node index.js start <0,1 or 2>
```

<<<<<<< HEAD
Link to [Brothers Weekly Playlist](https://open.spotify.com/playlist/0NADibKvY5ApsQVxIGuWKr?si=HZTsqF9TTU2EsSLlxTsAMg)
=======
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
>>>>>>> 614fbb103feaa3d32197fa76698d99f048bab999
