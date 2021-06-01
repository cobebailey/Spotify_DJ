//contains the playlist for the controller to take
import { callApiAsync } from './helpers';
import { RES_PER_PAGE, TRACKS_PER_PAGE } from './config.js';
export const state = {
  playlist: {
    playlist: {},
    tracks: [],
    trackPage: [],
    page: 1,
    tracksPerPage: TRACKS_PER_PAGE,
  },
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bindings: [],
};
//

/* async function tempLoadBindings() {
  let tracks = [
    '7Gjam2xvI8zOIKUf7blzi0',
    '6DONTnamNDOJdO6DzCu71p',
    '2twXp9X5I5WLE28rNWq3lf',
    '0axsMumJxKRTuYCMb9oeWl',
  ];
  let tracksData = await getTracks(tracks);
  console.log(tracksData, 'tracksData');

  state.bindings = tracksData.tracks;
  console.log(state.bindings);
}
tempLoadBindings(); */
//
export async function getTracks(trackIds) {
  let tracksString = trackIds.join(',');
  //tracksString = encodeURIComponent(tracksString);

  const res = await callApiAsync(
    `https://api.spotify.com/v1/tracks?ids=${tracksString}`
  );
  const data = await res.json();

  return data;
}
//
export async function playTrack(trackId) {
  //const contextUri = trackData.album.id;
  const playEndpoint = `https://api.spotify.com/v1/me/player/play`;
  const res = await callApiAsync(
    playEndpoint,
    'PUT',
    JSON.stringify({
      uris: [`spotify:track:${trackId}`],
    })
  );
}
async function addTrackToQueue(trackId) {
  const queueEndpoint = `https://api.spotify.com/v1/me/player/queue?uri=spotify:track:${trackId}`;
  const res = await callApiAsync(queueEndpoint, 'POST');
}
async function nextTrack() {
  const nextTrackEndpoint = 'https://api.spotify.com/v1/me/player/next';
  callApiAsync(nextTrackEndpoint, 'POST');
}
//
export async function getTrackInfo(trackId) {
  const res = await callApiAsync(
    `https://api.spotify.com/v1/tracks/${trackId}`
  );
  const data = await res.json();

  return data;
}
//encodeURIComponent(redirect_uri)

///
/* export async function playTracksGetInfo(trackId) {
  getTrackInfo(trackId);
  playTrack(trackId);
} */
//gets current users playlist
async function getUserPlaylistsAsync() {
  return callApiAsync('https://api.spotify.com/v1/me/playlists', 'GET');
}
async function getPlaylistById(id) {
  return callApiAsync(`https://api.spotify.com/v1/playlists/${id}`, 'GET');
}
//
//

///
///
//changes the state Objects playlist prop
export async function loadPlaylist(playlistID) {
  try {
    const res = await getPlaylistById(playlistID);

    const playlist = await res.json();

    if (!res.ok) throw new Error(`${playlist.message}: ${res.status}`);

    state.playlist.playlist = {
      description: playlist.description,
      id: playlist.id,
      href: playlist.href,
      image: playlist.images[0],
      name: playlist.name,
      owner: {
        displayName: playlist.owner.display_name,
        externalUrls: playlist.owner.external_urls,
        href: playlist.owner.href,
        id: playlist.owner.id,
        type: playlist.owner.type,
        uri: playlist.owner.uri,
      },
      snapshotId: playlist.snapshot_id,
      tracks: playlist.tracks,
      uri: playlist.uri,
    };

    //
  } catch (err) {
    console.error(err);
    throw err;
  }
}
//SEARCH FUNCTIONS
export async function searchMusic(query) {
  return callApiAsync(
    `https://api.spotify.com/v1/search?q=${query}&type=playlist&limit=45`
  );

  //const data = response.json();
  //console.log(data, 'searchdata');
}
export async function loadSearchResults(query) {
  try {
    state.search.query = query;
    const res = await searchMusic(query);
    const data = await res.json();

    state.search.results = data.playlists.items.map(playlist => {
      return {
        id: playlist.id,
        href: playlist.href,
        image: playlist.images[0],
        name: playlist.name,
        owner: {
          displayName: playlist.owner.display_name,
          externalUrls: playlist.owner.external_urls,
          href: playlist.owner.href,
          id: playlist.owner.id,
          type: playlist.owner.type,
          uri: playlist.owner.uri,
        },
        snapshotId: playlist.snapshot_id,
        tracks: playlist.tracks,
        uri: playlist.uri,
      };
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
}
//gets left side playlists
export function getSearchResultsPage(page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * RES_PER_PAGE;
  const end = page * 15;

  return state.search.results.slice(start, end);
}

export function getPlaylistTracksPage(page = state.playlist.page) {
  state.playlist.page = page;
  const start = (page - 1) * TRACKS_PER_PAGE;
  const end = page * TRACKS_PER_PAGE;

  state.playlist.trackPage = state.playlist.playlist.tracks.items.slice(
    start,
    end
  );
  return state.playlist;
}
function search(nameKey, myArray) {
  for (var i = 0; i < myArray.length; i++) {
    if (myArray[i].keyName === nameKey) {
      return myArray[i];
    }
  }
}
function deleteBinding(nameKey, myArray) {
  for (var i = 0; i < myArray.length; i++) {
    if (myArray[i].keyName === nameKey) {
      myArray.splice(i, 1);
      return;
    }
  }
}
//
function compareValues(key, order = 'asc') {
  return function innerSort(a, b) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      // property doesn't exist on either object
      return 0;
    }

    const varA = typeof a[key] === 'string' ? a[key].toUpperCase() : a[key];
    const varB = typeof b[key] === 'string' ? b[key].toUpperCase() : b[key];

    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return order === 'desc' ? comparison * -1 : comparison;
  };
}
function checkBindings(keyName, array) {
  let targetBinding = search(e.code, state.bindings);
  if (targetBinding) {
    deleteBinding(e.code, state.bindings);
  }
}
export async function bindTrack(e) {
  //check for an existing binding with a matching keyname
  let targetBinding = search(e.code, state.bindings);
  if (targetBinding) {
    deleteBinding(e.code, state.bindings);
  }
  const trackID = window.location.hash.slice(2);
  let thisTrack = await getTrackInfo(trackID);
  thisTrack.keyName = e.code;

  state.bindings.push(thisTrack);
  state.bindings.sort(compareValues('keyName'));
  localStorage.setItem('bindings', JSON.stringify(state.bindings));
  console.log(`Bound ${thisTrack.name} to ${thisTrack.keyName}`);
}

export async function playerize(e) {
  console.log(e.code);
  let targetTrack = await search(e.code, state.bindings);
  console.log('Target track:', targetTrack);
  //playTrack(targetTrack.id);
  await addTrackToQueue(targetTrack.id);
  nextTrack();
  console.log('playerizer operational: listening....');
}
