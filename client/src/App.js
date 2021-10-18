import React from "react";
import DisplayTracks from "./DisplayTracks";

function App() {
  const [isloggedIn, setisLoggedIn] = React.useState(null);
  const [baseURL, setBaseURL] = React.useState(null);

  React.useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then(function(data) {
        setisLoggedIn(data.loggedIn)
        setBaseURL(data.baseURL)
      })
  }, []);

  const loginHref = `${baseURL}login`;

  return (
    <div>
      {!isloggedIn ? <a href={loginHref}>Login</a> :
        <div>
          <DisplayTracks api= "/sharedweekly" playlistName="Brothers Weekly"/>
          <DisplayTracks api= "/recentlyplayed" playlistName="Recently Played"/>
        </div>
      }
    </div>
  );
}

export default App;