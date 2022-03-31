const dateOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  second: '2-digit',
}
const convertTSToReadableDate = ts => {
  return new Date(ts * 1000).toLocaleDateString('en-US', dateOptions)
}

export default convertTSToReadableDate
