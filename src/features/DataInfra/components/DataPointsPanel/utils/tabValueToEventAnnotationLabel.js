export default tabValue => {
  const falseLabel = [1]
  const trueLabel = [2]
  if (falseLabel.includes(tabValue)) {
    return false
  }
  if (trueLabel.includes(tabValue)) {
    return true
  }
  return null
}
