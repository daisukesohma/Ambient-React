export default failureModeString => {
  const split = failureModeString.split(',')
  split[0] = parseInt(split[0], 10)
  return split
}
