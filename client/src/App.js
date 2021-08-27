import React from "react";

function App() {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

  return (
    <div>
      <header>
        <p>{!data ? "Loading..." : data}</p>
        <a href="http://localhost:3001/login/">Log in with Spotify (local)</a>
        <a href="https://localhost:3001/login/">Log in with Spotify (local ssl)</a>
      </header>
    </div>
  );
}

export default App;