import findIndex from 'lodash/findIndex'

// this utility function adds or removes a value from an array depending on if it already exists,
// thus, it "toggles" values to and from an array.
// For instance given array = [1,2,3], toggleFromArray(1) => [2,3], and toggleFromArray(4) => [1,2,3,4]
//
const toggleFromArray = (array, value) => {
  const newArray = array.slice() // clone
  const index = findIndex(newArray, x => x === value)
  if (index >= 0) {
    newArray.splice(index, 1) // remove
  } else {
    newArray.push(value)
  }

  return newArray
}

export default toggleFromArray
