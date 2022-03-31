import { WS_CONNECT, WS_DISCONNECT, WS_SEND_MSG } from './actionTypes'

export const wsConnect = ({ host }) => ({ type: WS_CONNECT, data: { host } })
export const wsDisconnect = () => ({ type: WS_DISCONNECT })
export const wsSendNewMessage = ({ msg }) => ({
  type: WS_SEND_MSG,
  data: { msg },
})
