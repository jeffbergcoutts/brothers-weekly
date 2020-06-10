# Brothers Weekly

## Overview
Generates a playlist of top tracks from a set of users from the past 4 months, updated weekly.

## Rules
* 15 songs each
* Max 5 repeats from last weeks playlist
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

Link to [Brothers Weekly Playlist](https://open.spotify.com/playlist/0NADibKvY5ApsQVxIGuWKr?si=HZTsqF9TTU2EsSLlxTsAMg)