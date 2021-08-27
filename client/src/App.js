import React from "react";

function App() {
  const [loggedIn, setLoggedIn] = React.useState(null);
  const [env, setEnv] = React.useState(null);

  React.useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then(function(data) {
        setLoggedIn(data.loggedIn)
        setEnv(data.env)
      })
  }, []);

  const loginLink = (env === 'dev')
    ? <a href="http://localhost:3001/login/">Login</a>
    : <a href="https://test-bros-weekly.herokuapp.com/login/">Log in with Spotify (server)</a>;

  return (
    <div>
      <header>
        <p>{loggedIn ? "Welcome!" : loginLink}</p>
      </header>
    </div>
  );
}

export default App;