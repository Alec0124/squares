export const BASE_URL = 'https://api.magicthegathering.io/v1/cards?pageSize=10;';

export async function fetchQueryResultsFromURL(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
}

export async function fetchQueryResults(address) {
  try {
    const response = await fetch(`${BASE_URL}${address}`);
    console.log('response headers: ', response.headers);
    const data = await response.json();
    console.log("fetch data: ", data);
    const output = data.cards;
    // console.log("ouput data: ", output);
    // cards?pageSize=10;page=3

    return output;
  } catch (error) {
    throw error;
  }
}

// export async function fetchQueryResults({
//   century,
//   classification,
//   queryString,
// }) {
//   const url = `${BASE_URL}/object?${KEY}&classification=${classification}&century=${century}&keyword=${queryString}`;

//   try {
//     const response = await fetch(url);
//     const data = await response.json();

//     return data;
//   } catch (error) {
//     throw error;
//   }
// }