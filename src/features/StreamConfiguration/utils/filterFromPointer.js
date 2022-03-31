export default (_x, _y, filterSize) => {
  return {
    col: Math.floor(_x / filterSize),
    row: Math.floor(_y / filterSize),
  }
}
