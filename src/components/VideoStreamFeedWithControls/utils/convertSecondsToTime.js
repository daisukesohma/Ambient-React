const convertSecondsToTime = seconds => {
  let hrs = Math.floor(seconds / 3600).toFixed(0)
  if (hrs < 10) {
    hrs = `0${hrs}`
  }
  const remainder = seconds % 3600
  let mins = Math.floor(remainder / 60).toFixed(0)
  if (mins < 10) {
    mins = `0${mins}`
  }
  let sec = (remainder % 60).toFixed(0)
  if (sec < 10) {
    sec = `0${sec}`
  }
  return `${hrs}:${mins}:${sec}`
}

export default convertSecondsToTime
