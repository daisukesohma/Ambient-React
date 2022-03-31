import config from '../config'

const getSignalBridge = (wsHost, wsPort, wsSecure) => {
  const host = wsHost || config.signalBridge.HOST
  const port = wsPort || config.signalBridge.PORT
  const secure =
    wsSecure ||
    config.signalBridge.SECURE ||
    window.location.protocol === 'https:'
  const protocol = secure && secure === true ? 'wss' : 'ws'
  return `${protocol}://${host}:${port}`
}

export default getSignalBridge
