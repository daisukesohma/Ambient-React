// variation on https://codeburst.io/throttling-and-debouncing-in-javascript-646d076d0a44

const throttle = (func, timeFrame) => {
  let lastTime = 0
  return function(...args) {
    const now = new Date()
    if (now - lastTime >= timeFrame) {
      func(...args)
      lastTime = now
    }
  }
}

export default throttle
