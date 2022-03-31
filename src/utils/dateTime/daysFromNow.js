const daysFromNow = unixTs => {
  const comparedDate = new Date(unixTs * 1000).getDate()
  const now = new Date().getDate()

  return now - comparedDate
}

export default daysFromNow
