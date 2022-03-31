const formatUnixTimeToReadable = (unixTs, showDate, showTime, isZoomOut) => {
  // Create a new JavaScript Date object based on the timestamp
  // multiplied by 1000 so that the argument is in milliseconds, not seconds.
  let result = ''
  const date = new Date(unixTs * 1000)

  if (showDate) {
    const month = date.getMonth() + 1
    const day = date.getDate()
    const year = date.getFullYear()
    result += `${month}/${day}/${year}`
  }

  if (showTime) {
    // Hours part from the timestamp
    const hours = date.getHours()
    // Minutes part from the timestamp
    const minutes = `0${date.getMinutes()}`
    // Seconds part from the timestamp
    const seconds = `0${date.getSeconds()}`
    if (result !== '') {
      result += ' '
    }
    // Will display time in 10:30:23 format
    if (isZoomOut) {
      result += `${hours}:${minutes.substr(-2)}`
    } else {
      result += `${hours}:${minutes.substr(-2)}:${seconds.substr(-2)}`
    }
  }

  return result
}

export default formatUnixTimeToReadable
