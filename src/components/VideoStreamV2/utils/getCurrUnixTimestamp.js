const getCurrUnixTimestamp = () => {
  return Math.round(new Date().getTime() / 1000)
}

export default getCurrUnixTimestamp
