import config from '../config'

const getSocket = (wsHost, wsPort, wsSecure, wsPath) => {
  const host = wsHost || config.socket.HOST
  const port = wsPort || config.socket.PORT
  const path = wsPath || config.socket.PATH
  const secure =
    wsSecure || config.socket.SECURE || window.location.protocol === 'https:'
  const protocol = secure && secure === true ? 'wss' : 'ws'
  return `${protocol}://${host}:${port}${path}`
}

export default getSocket
