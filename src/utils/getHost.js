import config from '../config'
// Utility function that generates host name.
// Mainly used for Websocket url
// Port can be optionally null
//
const getHost = (apiHost, apiSecure) => {
  const host = apiHost || config.api.HOST
  const secure =
    apiSecure || config.api.SECURE || window.location.protocol === 'https:'
  const protocol = secure && secure === true ? 'https' : 'http'
  return `${protocol}://${host}`
}

export default getHost
