import { msToUnix } from '../../../utils'

const dataFromTS = (arr, searchedTs, getNearest) => {
  // const arr = unsortedArr.sort((a, b) => {
  //   return Number(a.startTs) - Number(b.startTs)
  // })
  if (!arr) {
    return { el: false }
  }

  let minIndex = 0
  let maxIndex = arr ? arr.length - 1 : 0
  let currentIndex
  let currentElement

  while (minIndex <= maxIndex) {
    currentIndex = ((minIndex + maxIndex) / 2) | 0 // eslint-disable-line
    currentElement = arr[currentIndex]
    if (searchedTs > msToUnix(currentElement.endTs)) {
      minIndex += 1
    } else if (searchedTs < msToUnix(currentElement.startTs)) {
      maxIndex -= 1
    } else {
      return { el: currentElement, index: currentIndex }
    }
  }

  // if catalogue block that searched_ts is found in is not found, go through all the blocks and send the closest
  if (getNearest) {
    let closest = false
    let closestDiff = null
    let closestIndex = 0
    let currDiff

    for (let i = 0; i < arr.length; ++i) {
      currDiff = Math.abs(searchedTs - msToUnix(arr[i].startTs))
      if (!closest || currDiff <= closestDiff) {
        closest = arr[i]
        closestDiff = currDiff
        closestIndex = i
      }
    }

    return { el: closest, index: closestIndex, closest: true }
  }
  return { el: false }
}

export default dataFromTS
