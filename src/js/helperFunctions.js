import { SET_TIMEOUT_SECONDS } from './config.js';

//For reusable functions all over the project:
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAXRequest = async function (url, uploadData = undefined) {
  try {
    const fetchPromise = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const response = await Promise.race([
      fetchPromise,
      timeout(SET_TIMEOUT_SECONDS),
    ]);
    const fetchedData = await response.json();

    if (!response.ok)
      throw new Error(`${fetchedData.message}(${response.status})`);

    return fetchedData;
  } catch (err) {
    //it will reject errors -
    //  we are moving actual handling from one async function to another by rethrowing the error
    throw err;
  }
};

// export const getJSON = async function (url) {
//   try {
//     const fetchPromise = fetch(url);
//     const response = await Promise.race([
//       fetchPromise,
//       timeout(SET_TIMEOUT_SECONDS),
//     ]);
//     const fetchedData = await response.json();

//     if (!response.ok)
//       throw new Error(`${fetchedData.message}(${response.status})`);

//     return fetchedData;
//   } catch (err) {
//     //it will reject errors -
//     //  we are moving actual handling from one async function to another by rethrowing the error
//     throw err;
//   }
// };

// export const sendJSON = async function (url, uploadData) {
//   try {
//     /// .fetch(url) - automatically making Get request with url link
//     //if we want to create Post/send request we need: fetch(url, {options})
//     const fetchPromise = fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(uploadData),
//     });
//     const response = await Promise.race([
//       fetchPromise,
//       timeout(SET_TIMEOUT_SECONDS),
//     ]);
//     const fetchedData = await response.json();

//     if (!response.ok)
//       throw new Error(`${fetchedData.message}(${response.status})`);

//     return fetchedData;
//   } catch (err) {
//     //it will reject errors -
//     //  we are moving actual handling from one async function to another by rethrowing the error
//     throw err;
//   }
// };
