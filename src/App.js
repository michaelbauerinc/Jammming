import React, { Component } from 'react';
import './App.css';
import SearchBar from './Components/SearchBar/SearchBar';
import Playlist from './Components/Playlist/Playlist.js';
import SearchResults from './Components/SearchResults/SearchResults';
import Spotify from './util/Spotify';

Spotify.getAccessToken();

class App extends Component {
  constructor(props) {
  super(props)


  this.state = {
    searchResults: [
      {name: 'Test',
      artist: 'Test',
      album: 'Test',
      id: '1'
    }
    ],

    playlistName: 'New Playlist',
    playlistTracks: [
      {name: 'Lady Bird',
      artist: 'Chet Baker',
      album: 'Chet Baker in Milan',
      id: '1024'
    },
      {name: 'Pent Up House',
      artist: 'Chet Baker',
      album: 'Chet Baker in Milan',
      id: '1025'
    },
      {name: 'Alone Together',
      artist: 'Chet Baker',
      album: 'Chet Sings',
      id: '1026'
    }]
    }

    this.addTrack = this.addTrack.bind(this);

    this.removeTrack = this.removeTrack.bind(this);

    this.updatePlaylistName = this.updatePlaylistName.bind(this);

    this.savePlaylist = this.savePlaylist.bind(this);
    
    this.search = this.search.bind(this);

  }



addTrack(track) {
    if (!this.state.playlistTracks.find(playlistTrack => playlistTrack.id === track.id)) {
      this.setState(prevState => ({
        playlistTracks: [...prevState.playlistTracks, track]
      }));
    }
}


  removeTrack(track) {
    const newTrackList = this.state.playlistTracks.filter(savedTrack => savedTrack.id !== track.id);
    this.setState({ playlistTracks: newTrackList });
    }    

  updatePlaylistName(name) {
    this.setState({ playlistName: name });
  }

  savePlaylist() {
    const trackURIs = this.state.playlistTracks.map(track => track.uri);
    const name = this.state.playlistName;
    Spotify.savePlaylist(name, trackURIs)
    this.updatePlaylistName('New Playlist');
    this.setState({ playlistTracks: [] });
  }

  async search(term) {
  console.log(term)
  await Spotify.search(term).then(searchResults => this.setState({searchResults: searchResults}));
  }

  render() {
    console.log(this.state.playlistTracks)
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
            <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onSave={this.savePlaylist} onRemove={this.removeTrack} onAdd={this.addTrack}/>
          </div>
        </div>
      </div>
    );
  }
}


export default App;
