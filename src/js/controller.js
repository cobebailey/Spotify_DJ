//import * as var from './auth.js
//const res = fetch(
//'https://api.spotify.com/v1/playlists/37i9dQZF1DXdLEN7aqioXM'
//);
import * as model from './model.js';

import playlistView from './views/playlistView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import PaginationView from './views/paginationView.js';
import {
  requestAuthorization,
  getCode,
  handleRedirect,
  fetchAccessToken,
  callAuthorizationApi,
  handleAuthorizationResponse,
} from './auth.js';
import {
  AUTH_ENDPOINT,
  sdkToken,
  client_id,
  client_secret,
  redirect_uri,
  token,
} from './config';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { callApiAsync } from './helpers.js';
import paginationView from './views/paginationView.js';
import trackPaginationView from './views/trackPaginationView.js';

/* if (module.hot) {
  module.hot.accept();
} */
//
const authBtn = document.querySelector('.nav__btn--authBtn');
const request = require('request'); // "Request" library
//
let access_token;
let refresh_token;
//
const boogalooID = '70KUhT93Yo584eruWeHXX8?si=82c9ffcca2d6411b';
const synthWaveID = '7Al4qMA6wk3G6AcFT1QsvK?si=dc2e6202292e4a4c';
//
//
async function init() {
  playlistView.addHandlerRender(controlPlaylists);

  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  trackPaginationView.addHandlerClick(controlTrackPagination);
  //sets the default playlist
  //this is causing aN ERROR WITH AUTH TOKENS
  //window.location.href =
  //'http://localhost:1234/index.html#p7Al4qMA6wk3G6AcFT1QsvK';
}
init();

//
authBtn.addEventListener('click', function (e) {
  e.preventDefault();
  requestAuthorization();
});
//
//handles page load
window.addEventListener('load', e => {
  onPageLoad();
});
const onPageLoad = function () {
  //gets these ids and checks if the spotify code (not token)is in the url (used for auth)
  localStorage.setItem('client_id', client_id);
  localStorage.setItem('client_secret', client_secret);
  if (window.location.search.length > 0) {
    console.log('redirecting');
    handleRedirect();
  } else {
    access_token = localStorage.getItem('access_token');
  }
};
//NEW ASYNC AUTH
//gets code for echanging tokens

//
//
//sets up sdk

//

//ASYNC FUNCTIONS
async function controlPlaylists() {
  try {
    const itemID = window.location.hash.slice(1);
    if (!itemID) return;
    //
    let playlistID;
    //if p, render playlist, if t, play track
    //
    //all playlist item hrefs start with p
    if (itemID[0] === 'p') {
      playlistID = itemID.slice(1);
      //makes the call from the model for a playlist by ID, and passes the state here to the controller
      await model.loadPlaylist(playlistID);
      //playlistView.render(model.state.playlist);
      playlistView.render(model.getPlaylistTracksPage());
      trackPaginationView.render(model.state.playlist);
    }

    //all track items hrefs start wth t
    if (itemID[0] === 't') {
      playlistID = itemID.slice(1);
      //makes api call using playlist ID to play the clicked track
      model.playTrack(playlistID);
    }

    //render the playlist
  } catch (err) {
    console.error(err);
    playlistView.renderError(`${err} oh no!`);
  }
}
async function controlTrackPagination(goToPage) {
  playlistView.render(model.getPlaylistTracksPage(goToPage));
  trackPaginationView.render(model.state.playlist);
}
//
async function controlSearchResults() {
  try {
    resultsView.renderSpinner();
    //
    const query = searchView.getQuery();
    if (!query) return;
    //make call for search results
    await model.loadSearchResults(query);
    //render them
    resultsView.render(model.getSearchResultsPage());
    //render initial paginaTION
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
}

async function controlPagination(goToPage) {
  //rend new res
  resultsView.render(model.getSearchResultsPage(goToPage));
  //render new pag
  paginationView.render(model.state.search);
}

//controlPlaylists();
//function for testing code
async function testFunction() {
  //
}
//testFunction();

//
//
//
/* window.onSpotifyWebPlaybackSDKReady = () => {
  const token = sdkToken;
  const player = new Spotify.Player({
    name: 'Spotify DJ',
    getOAuthToken: cb => {
      cb(token);
    },
  });

  // Error handling
  player.addListener('initialization_error', ({ message }) => {
    console.error(message);
  });
  player.addListener('authentication_error', ({ message }) => {
    console.error(message);
  });
  player.addListener('account_error', ({ message }) => {
    console.error(message);
  });
  player.addListener('playback_error', ({ message }) => {
    console.error(message);
  });

  // Playback status updates
  player.addListener('player_state_changed', state => {
    console.log(state);
  });

  // Ready
  player.addListener('ready', ({ device_id }) => {
    console.log('Ready with Device ID', device_id);
    localStorage.setItem('deviceId', device_id);
  });

  // Not Ready
  player.addListener('not_ready', ({ device_id }) => {
    console.log('Device ID has gone offline', device_id);
  });

  // Connect to the player!
  player.connect();
}; */
