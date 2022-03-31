export default array => {
  return array.reduce((result, value, index, _array) => {
    if (index % 2 === 0) result.push(_array.slice(index, index + 2))
    return result
  }, [])
}
