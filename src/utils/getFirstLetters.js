// Takes a string of words ("java script object notation" and returns the acronym, ie. "JSON")
const getFirstLetters = stringOfWords => {
  const matches = stringOfWords.match(/\b(\w)/g) // ['J','S','O','N']
  return matches.join('')
}

export default getFirstLetters
