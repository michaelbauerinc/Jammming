let accessToken;
let expiration;

const clientID = "294d0325a2d448429d29c343f633c9fb";
const redirectUri = "http://localhost:3000/";

const Spotify = {
  getAccessToken() {
    const hasAccessToken = window.location.href.match(/access_token=([^&]*)/);
    const hasExpiration = window.location.href.match(/expires_in=([^&]*)/);
    if (accessToken) {
      return accessToken;
    } else if (hasAccessToken && hasExpiration) {
      accessToken = hasAccessToken[1];
      expiration = hasExpiration[1];

      window.setTimeout(() => (accessToken = ""), expiration * 1000);
      window.history.pushState("Access Token", null, "/");
    } else {
      window.location.replace(
        `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`
      );
    }
  },

  search(searchTerm) {
    const searchEndpoint = `https://api.spotify.com/v1/search?type=track&q=${searchTerm}`;
    return fetch(searchEndpoint, {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
      .then(response => response.json)
      .then(jsonResponse => {
        if (!jsonResponse.tracks) {
          return [];
        } else {
          const trackList = jsonResponse.map(track => {
            return {
              id: track.id,
              name: track.name,
              artist: track.artists[0].name,
              album: track.album.name,
              uri: track.uri
            };
          });
          return trackList;
        }
      });
  },

  savePlaylist(playlistName, trackArray) {
    if (!playlistName && !trackArray) {
      return;
    }
    const accessToken = Spotify.getAccessToken();
    const headers = {
      Authorization: `Bearer ${accessToken}`
    };
    let userId;
    let playlistID;
    fetch("https://api.spotify.com/v1/me", headers)
      .then(response => response.json)
      .then(jsonResponse => (userId = jsonResponse.id));
    fetch(`/v1/users/${userId}/playlists`, {
      headers: headers,
      method: "POST",
      body: JSON.stringify({ name: playlistName })
    })
      .then(response => response.json)
      .then(jsonResponse => (playlistID = jsonResponse.id));

    fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
      headers: headers,
      method: "POST",
      body: JSON.stringify({ uris: trackArray })
    });
  }
};

export default Spotify;
