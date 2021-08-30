import React from "react";

function DisplayTracks(props) {
  const [pageData, setPageData] = React.useState(null);
  
  React.useEffect(() => {
    fetch(props.api)
      .then((res) => res.json())
      .then((data) => {
        setPageData(data)
      })
  }, [props]);

  function AllImages() {
    if (pageData) {
      const allImages = pageData.data
      return (
        <div>
          {allImages.map((album, index) => (
            <img alt={index} src={album.track.album.images[1].url} width="200" height="200"/>
          ))}
        </div>
      )      
    }

    return null
  }

  return (
    <div>
      <p><b>Here is your {props.playlistName}</b></p>
      <AllImages />
    </div>
  );
}

export default DisplayTracks;