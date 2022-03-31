const tsAtMidnight = daysBack => {
  const currDay = new Date()
  currDay.setHours(0, 0, 0, 0)
  let currDayTS = Math.round(currDay.getTime() / 1000)
  currDayTS = daysBack ? currDayTS - 3600 * 24 * daysBack : currDayTS
  return currDayTS
}

export default tsAtMidnight
