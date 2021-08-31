import React from "react";
import DisplayTracks from "./DisplayTracks";

function App() {
  const [isloggedIn, setisLoggedIn] = React.useState(null);
  const [env, setEnv] = React.useState(null);

  React.useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then(function(data) {
        setisLoggedIn(data.loggedIn)
        setEnv(data.env)
      })
  }, []);

  const Link = (props) => <a href={props.link}>Login</a>
  const loginHref = (env === 'dev') ? 'http://localhost:3001/login/' : 'https://test-bros-weekly.herokuapp.com/login/';

  return (
    <div>
      {!isloggedIn ? <Link link={loginHref} /> :
        <div>
          <h1>Brothers Weekly</h1>
          <DisplayTracks api= "/sharedweekly" playlistName="Brothers Weekly"/>
          <DisplayTracks api= "/recentlyplayed" playlistName="Recently Played Albums"/>
        </div>
      }
    </div>
  );
}

export default App;