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
//
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
//not used now, but in the future perhaps
export async function playTrack(trackId) {
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
//gets current users playlist
async function getUserPlaylistsAsync() {
  return callApiAsync('https://api.spotify.com/v1/me/playlists', 'GET');
}
async function getPlaylistById(id) {
  return callApiAsync(`https://api.spotify.com/v1/playlists/${id}`, 'GET');
}
export async function searchMusic(query) {
  return callApiAsync(
    `https://api.spotify.com/v1/search?q=${query}&type=playlist&limit=45`
  );
}

//gets left side playlists
export function getSearchResultsPage(page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * RES_PER_PAGE;
  const end = page * 15;

  return state.search.results.slice(start, end);
}
//gets right side tracks
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
//checks for a key within an array of objects
function search(nameKey, myArray) {
  for (var i = 0; i < myArray.length; i++) {
    if (myArray[i].keyName === nameKey) {
      return myArray[i];
    }
  }
}
//removes a binding from the bindings array
function deleteBinding(nameKey, myArray) {
  for (var i = 0; i < myArray.length; i++) {
    if (myArray[i].keyName === nameKey) {
      myArray.splice(i, 1);
      return;
    }
  }
}
//checks for duplicates
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
export async function bindTrack(e) {
  //check for an existing binding with a matching keyname
  let targetBinding = search(e.code, state.bindings);
  if (targetBinding) {
    deleteBinding(e.code, state.bindings);
  }
  const trackID = window.location.hash.slice(2);
  let thisTrack = await getTrackInfo(trackID);
  //adds the keycode to the track object
  thisTrack.keyName = e.code;

  state.bindings.push(thisTrack);
  //sorts bindings by keyname (A,b,c... etc)
  state.bindings.sort(compareValues('keyName'));
  //store bindings in localStorage
  localStorage.setItem('bindings', JSON.stringify(state.bindings));
  console.log(`Bound ${thisTrack.name} to ${thisTrack.keyName}`);
}

export async function playerize(e) {
  console.log(e.code);
  if (e.code === 'Escape') return;

  let targetTrack = await search(e.code, state.bindings);
  if (!targetTrack) return;
  console.log('Target track:', targetTrack);
  //playTrack(targetTrack.id);
  await addTrackToQueue(targetTrack.id);
  nextTrack();
  console.log('playerizer operational: listening....');
}
