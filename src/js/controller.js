//import * as var from './auth.js
//const res = fetch(
//'https://api.spotify.com/v1/playlists/37i9dQZF1DXdLEN7aqioXM'
//);
import * as model from './model.js';
import playlistView from './views/playlistView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
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
  //sets the default playlist
  //window.location.href =
  //'http://localhost:1234/index.html#p7Al4qMA6wk3G6AcFT1QsvK';
}
init();

//
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

//
//
//sets up sdk
window.onSpotifyWebPlaybackSDKReady = () => {
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
};
//

//ASYNC FUNCTIONS
async function controlPlaylists() {
  try {
    const itemID = window.location.hash.slice(1);
    if (!itemID) return;
    //
    let playlistID;
    //if p, render playlist, if t, play track
    //all playlist item hrefs start with p
    if (itemID[0] === 'p') {
      playlistID = itemID.slice(1);
      //makes the call from the model for a playlist by ID, and passes the state here to the controller
      await model.loadPlaylist(playlistID);
    }

    //all track items hrefs start wth t
    if (itemID[0] === 't') {
      playlistID = itemID.slice(1);
      //makes api call using playlist ID to play the clicked track
      model.playTrack(playlistID);
    }

    //render the playlist
    playlistView.render(model.state.playlist);
  } catch (err) {
    console.error(err);
    playlistView.renderError(`${err} oh no!`);
  }
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
    resultsView.render(model.state.search.results);
  } catch (err) {
    console.log(err);
  }
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
//AUTHORIZATION BELOW
//makes auth request to api, returns an access_token and refresh_token
authBtn.addEventListener('click', function (e) {
  e.preventDefault();
  requestAuthorization();
  let code = getCode();
});
const handleRedirect = function () {
  let code = getCode();
  fetchAccessToken(code);
  window.history.pushState('', '', redirect_uri); // remove param from url
};

const getCode = function () {
  let code = null;
  const queryString = window.location.search;
  console.log(queryString);
  if (queryString.length > 0) {
    const urlParams = new URLSearchParams(queryString);
    code = urlParams.get('code');
  }
  return code;
};
const requestAuthorization = function () {
  localStorage.setItem('client_id', client_id);
  localStorage.setItem('client_secret', client_secret); // In a real app you should not expose your client_secret to the user

  let url = AUTH_ENDPOINT;
  url += '?client_id=' + client_id;
  url += '&response_type=code';
  url += '&redirect_uri=' + encodeURIComponent(redirect_uri);

  url += '&show_dialog=true';
  url +=
    '&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private';
  window.location.href = url;

  //console.log(queryRes); // Show Spotify's authorization screen
  //const queryData = queryRes.json();
  //console.log(queryData);
};
const fetchAccessToken = function (code) {
  let body = 'grant_type=authorization_code';
  body += '&code=' + code;
  body += '&redirect_uri=' + encodeURIComponent(redirect_uri);
  body += '&client_id=' + client_id;
  body += '&client_secret=' + client_secret;
  callAuthorizationApi(body);
};
//sends a request and runs a callback function handleauthresp
const callAuthorizationApi = function (body) {
  let xhr = new XMLHttpRequest();
  xhr.open('POST', token, true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.setRequestHeader(
    'Authorization',
    'Basic ' + btoa(client_id + ':' + client_secret)
  );
  xhr.send(body);
  xhr.onload = handleAuthorizationResponse;
};
///parses data and grabs refresh and access tokens if availablke
const handleAuthorizationResponse = function () {
  if (this.status == 200) {
    var data = JSON.parse(this.responseText);

    var data = JSON.parse(this.responseText);
    if (data.access_token != undefined) {
      access_token = data.access_token;
      localStorage.setItem('access_token', access_token);
    }
    if (data.refresh_token != undefined) {
      refresh_token = data.refresh_token;
      localStorage.setItem('refresh_token', refresh_token);
    }
    onPageLoad();
  } else {
    console.log(this.responseText, 'handle auth repsonse');
  }
};
///builds the body for the callauthAPI function to send
function refreshAccessToken() {
  refresh_token = localStorage.getItem('refresh_token');
  client_id = localStorage.getItem('client_id');
  let body = 'grant_type=refresh_token';
  body += '&refresh_token=' + refresh_token;
  body += '&client_id=' + client_id;
  callAuthorizationApi(body);
}

//OLD SYNCHRONOUS API METHODS
