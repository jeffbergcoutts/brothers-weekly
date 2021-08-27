import React from "react";

function SharedWeekly() {
  const [pageData, setPageData] = React.useState(null);
  
  React.useEffect(() => {
    fetch("/sharedweekly")
      .then((res) => res.json())
      .then((data) => {
        setPageData(data)
      })
  }, []);

  const image = (pageData && pageData.data[4].track.album.images[1].url)

  return (
    <div>
      <p>Here is your Shared Weekly</p>
      <img alt="" src={image} />
    </div>
  );
}

export default SharedWeekly;