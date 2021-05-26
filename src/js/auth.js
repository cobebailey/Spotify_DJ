import {
  redirect_uri,
  AUTH_ENDPOINT,
  client_id,
  client_secret,
  token,
} from './config';

export async function requestAuthorization() {
  let url = AUTH_ENDPOINT;
  url += '?client_id=' + client_id;
  url += '&response_type=code';
  url += '&redirect_uri=' + encodeURIComponent(redirect_uri);

  url += '&show_dialog=false';
  url +=
    '&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private';
  window.location.href = url;
}
const getCode = function () {
  let code = null;
  const queryString = window.location.search;

  if (queryString.length > 0) {
    const urlParams = new URLSearchParams(queryString);
    code = urlParams.get('code');
  }
  if (code) console.log('Tokens acquired');
  return code;
};
export const handleRedirect = function () {
  let code = getCode();
  //console.log(code);
  fetchAccessToken(code);
  window.history.pushState('', '', redirect_uri); // remove param from url
};
const fetchAccessToken = function (code) {
  let body = 'grant_type=authorization_code';
  body += '&code=' + code;
  body += '&redirect_uri=' + encodeURIComponent(redirect_uri);
  body += '&client_id=' + client_id;
  body += '&client_secret=' + client_secret;
  callAuthorizationApi(body);
};
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
    //onPageLoad();
  } else {
    console.log(this.responseText, 'handle auth repsonse');
  }
};
