export default failureModeString => {
  const split = failureModeString.split(',')
  return split[1]
}
