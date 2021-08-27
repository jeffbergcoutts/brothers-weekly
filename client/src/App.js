import React from "react";
import SharedWeekly from "./SharedWeekly";
import RecentlyPlayed from "./RecentlyPlayed";

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
          <SharedWeekly />
          <RecentlyPlayed />
        </div>
      }
    </div>
  );
}

export default App;