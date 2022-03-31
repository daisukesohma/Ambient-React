/* eslint-disable no-useless-escape */

// matches comma separated list of integers from 1-699999 (not 65535 which is the max port number, but it's exponentially harder)
// ie. Enter valid ports 1-65535, comma separated (ie. 554, 700)
const PORTS_VALIDATOR = /^([1-9]|[1-9][0-9]|[1-9][0-9][0-9]|[1-9][0-9][0-9][0-9]|[1-9][0-9][0-9][0-9][0-9]|[1-6][0-9][0-9][0-9][0-9][0-9])(\,([1-9]|[1-9][0-9]|[1-9][0-9][0-9]|[1-9][0-9][0-9][0-9]|[1-9][0-9][0-9][0-9][0-9]|[1-6][0-9][0-9][0-9][0-9][0-9]))*$/

export default PORTS_VALIDATOR
