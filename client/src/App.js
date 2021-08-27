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

  const loginLink = (env === 'dev') ? 'http://localhost:3001/login/' : 'https://test-bros-weekly.herokuapp.com/login/';

  return (
    <div>
      <header>
        <p>{loggedIn ? "Welcome!" : <a href={loginLink}>Login</a>}</p>
      </header>
    </div>
  );
}

export default App;