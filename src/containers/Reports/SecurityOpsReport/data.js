const SECONDS_IN_DAY = 86400
const selections = [
  {
    name: 'Today',
    value: SECONDS_IN_DAY,
  },
  {
    name: 'Past Week',
    value: SECONDS_IN_DAY * 7,
  },
  {
    name: 'Past Month',
    value: SECONDS_IN_DAY * 30,
  },
]

module.exports = {
  selections,
}
