// uppercases the first letter of the first word in the string.
//
const upperFirst = str => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export default upperFirst
