// assumes array is [1,2,3,4], ie. List[Number]
// default can be empty array, or some arbitrary array of values
//
const toggleFromArraySingle = (
  current = [],
  selectedValue = 1,
  defaultArray = [],
) => {
  if (current && current.length === 1 && current[0] !== selectedValue)
    return [selectedValue] // has a different value but one value
  if (current && current.length === defaultArray.length) return [selectedValue]
  return defaultArray
}

const toggleFromArrayMulti = () => {
  // @future for multi support
  // toggleFromArray(activeRegions, id)
}

export { toggleFromArraySingle, toggleFromArrayMulti }
