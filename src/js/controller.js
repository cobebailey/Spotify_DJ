//import * as var from './auth.js
//const res = fetch(
//'https://api.spotify.com/v1/playlists/37i9dQZF1DXdLEN7aqioXM'
//);
import * as model from './model.js';

import playlistView from './views/playlistView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';

import { requestAuthorization, handleRedirect } from './auth.js';
import { client_id, client_secret } from './config';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import paginationView from './views/paginationView.js';
import trackPaginationView from './views/trackPaginationView.js';
import bindingsView from './views/bindingsView.js';

/* if (module.hot) {
  module.hot.accept();
} */
//
const authBtn = document.querySelector('.nav__btn--authBtn');
//
async function init() {
  playlistView.addHandlerRender(controlPlaylists);

  //
  searchView.addHandlerSearch(controlSearchResults);
  searchView.addHandlerActivate(controlPlayerizer);
  searchView.addHandlerDeactivate(controlPlayerizer);
  //
  paginationView.addHandlerClick(controlPagination);
  //
  trackPaginationView.addHandlerClick(controlTrackPagination);
  //
  bindingsView.addHandlerClick(controlTabs);
  //
  authBtn.addEventListener('click', function (e) {
    e.preventDefault();
    requestAuthorization();
  });

  //for binding storage and retirevela
  if (!localStorage.getItem('bindings') === true) return;

  model.state.bindings = JSON.parse(localStorage.getItem('bindings'));
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
async function controlPlayerizer(btnClass) {
  if (btnClass === '.actbtn') {
    window.addEventListener('keydown', model.playerize);
  }
  if (btnClass === '.deactbtn') {
    window.removeEventListener('keydown', model.playerize);
  }
}

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
      //playlistView.addBindHandler(bindButtonEventListener);
    }

    //all track items hrefs start wth t
    if (itemID[0] === 't') {
      playlistID = itemID.slice(1);
      //makes api call using playlist ID to play the clicked track
      model.playTrack(playlistID);
    }
    //on bind button press, bind a key to the id of the track pressed
    if (itemID[0] === 'b') {
      //set binding
      window.addEventListener('keydown', model.bindTrack, { once: true });

      console.log('Binding: listening for key press...');
    }

    //render the playlist
  } catch (err) {
    console.error(err);
    playlistView.renderError(`${err} oh no!`);
  }
}
async function controlSearchResults() {
  try {
    resultsView.renderSpinner();
    let query = searchView.getQuery();
    //if theres a query, store the value
    if (query) {
      model.state.search.query = query;
    }
    //if not, get the value from the model
    if (!query) {
      query = model.state.search.query;
    }
    //if the model is empty, just return
    if (model.state.search.query === '') {
      resultsView.renderDefault();
      return;
    }

    //make call for search results
    await model.loadSearchResults(query);
    //render them
    resultsView.render(model.getSearchResultsPage());
    //render initial paginaTION
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
    searchView.renderError(`${err} : Problem loading results...`);
  }
}
async function controlTrackPagination(goToPage) {
  try {
    playlistView.render(model.getPlaylistTracksPage(goToPage));
    trackPaginationView.render(model.state.playlist);
  } catch (err) {
    console.error(err);
    playlistView.renderError(`${err} Track pagination error...`);
  }
}
async function controlPagination(goToPage) {
  try {
    //rend new res
    resultsView.render(model.getSearchResultsPage(goToPage));
    //render new pag
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
    resultsView.renderError(`${err} : Playlist pagination error...`);
  }
}
async function controlTabs(id) {
  try {
    if (id === 'searchTab') {
      controlSearchResults();
    }
    if (id === 'bindingTab') {
      bindingsView.render(model.state.bindings);
    }
  } catch (err) {
    console.error(err);
  }
}
