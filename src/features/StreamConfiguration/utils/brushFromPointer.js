import filterFromPointer from './filterFromPointer'

export default (_x, _y, drawSize, filterSize) => {
  const f = filterFromPointer(_x, _y, filterSize)
  const ctrX = f.col * filterSize
  const ctrY = f.row * filterSize
  return {
    left: ctrX - Math.floor(drawSize / 2) * filterSize,
    top: ctrY - Math.floor(drawSize / 2) * filterSize,
    width: drawSize * filterSize,
    height: drawSize * filterSize,
  }
}
