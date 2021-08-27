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

  const loginLink = `<a href="${(env === 'dev') ? 'http://localhost:3001/login/' : 'https://test-bros-weekly.herokuapp.com/login/'}">Login</a>`;

  return (
    <div>
      <header>
        <p>{loggedIn ? "Welcome!" : loginLink}</p>
      </header>
    </div>
  );
}

export default App;