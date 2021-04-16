import { TIMEOUT_SEC } from './config';
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export async function callApiAsync(url = '', method = 'GET', body = null) {
  try {
    const access_token = localStorage.getItem('access_token');
    //standard modular request to api
    const fetchPromise = fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        //prettier-ignore
        'Authorization': `Bearer ${access_token}`,
      },
      body: body,
    });

    const response = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);
    return response;
  } catch (err) {
    console.error('Credenetials expired');
    throw err;
  }
}
