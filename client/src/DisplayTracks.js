import React from "react";

function DisplayTracks(props) {
  const [pageData, setPageData] = React.useState(null);
  
  React.useEffect(() => {
    fetch(props.api)
      .then((res) => res.json())
      .then((res) => setPageData(res))
  }, [props.api]);

  const trackList = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap'
  }

  const albumColumn = {
    display: 'flex',
    flexDirection: 'row',
    width: '300px'
  }

  const trackColumn = {
    display: 'flex',
    flexDirection: 'column'
  }

  return (
    <div>
      {
        (pageData) && (
          <div>
            <h1>{props.playlistName}</h1>
            <div style={trackList}>
            {pageData.map((track, index) => (
              <div style={albumColumn}>
                <div>
                  <img alt={index} src={track.albumImageUrl} width="100" height="100" />
                </div>
                <div style={trackColumn}>
                  <div><a href={track.artistUrl} target="_blank" rel="noreferrer">{track.artistName}</a></div>
                  <div><a href={track.albumUrl} target="_blank" rel="noreferrer">{track.albumName}</a></div>
                  <div><a href={track.trackUrl} target="_blank" rel="noreferrer">{track.trackName}</a></div>
                </div>
              </div>
            ))}
            </div>
          </div>
        )
      }
    </div>
  )      
}

export default DisplayTracks;