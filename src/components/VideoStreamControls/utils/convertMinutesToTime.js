const convertMinutesToTime = minutes => {
  let hrs = Math.floor(minutes / 60).toFixed(0)
  if (hrs < 10) {
    hrs = `0${hrs}`
  }
  const remainder = minutes % 60
  let mins = Math.floor(remainder / 60).toFixed(0)
  if (mins < 10) {
    mins = `0${mins}`
  }
  return `${hrs}:${mins}`
}

export default convertMinutesToTime