import tsAtMidnight from './tsAtMidnight'

// Seconds Since Midnight
// "secSinceMidnight" and "secTillMidnight" naming convention from
// https://blog.opto22.com/optoblog/seconds-since-midnight
// https://stackoverflow.com/questions/11462894/how-to-get-seconds-elapsed-since-midnight

const secSinceMidnight = (unixTs, daysBack = 0) => {
  return unixTs - tsAtMidnight(daysBack)
}

export default secSinceMidnight
