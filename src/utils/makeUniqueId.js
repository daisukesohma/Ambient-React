/* eslint-disable */
// Based on this to make unique Ids: https://gist.github.com/LeverOne/1308368
// Element types is a string ex. "policy" or "level" or "contact"
const makeUniqueId = function(elementType, a, b) {
  // placeholders
  elementType = elementType ? `${elementType}-` : ''
  for (
    // loop :)
    b = a = ''; // b - result , a - numeric variable
    a++ < 36; //
    b +=
      (a * 51) & 52 // if "a" is not 9 or 14 or 19 or 24
        ? //  return a random number or 4
          (a ^ 15 // if "a" is not 15
            ? // genetate a random number from 0 to 15
              8 ^ (Math.random() * (a ^ 20 ? 16 : 4)) // unless "a" is 20, in which case a random number from 8 to 11
            : 4
          ) //  otherwise 4
            .toString(16)
        : '-' //  in other cases (if "a" is 9,14,19,24) insert "-"
  );
  return `${elementType}${b}`
}

export default makeUniqueId
