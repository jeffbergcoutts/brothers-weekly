import React from "react";

function RecentlyPlayed() {
  const [pageData, setPageData] = React.useState(null);
  
  React.useEffect(() => {
    fetch("/recentlyplayed")
      .then((res) => res.json())
      .then((data) => {
        setPageData(data)
      })
  }, []);

  const image = (pageData && pageData.data[18].track.album.images[1].url)

  return (
    <div>
      <p>Here is your Recently Played Albums</p>
      <img alt="" src={image} />
    </div>
  );
}

export default RecentlyPlayed;