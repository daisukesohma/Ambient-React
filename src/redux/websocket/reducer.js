import { WS_CONNECT } from './actionTypes'

const initialState = {
  host: undefined,
  accountSlug: undefined,
  profileId: undefined,
}

const websocketReducer = (state = { ...initialState }, action) => {
  switch (action.type) {
    case WS_CONNECT:
      return {
        ...state,
        host: action.data.host,
        accountSlug: action.data.accountSlug,
        profileId: action.data.profileId,
      }
    default:
      return state
  }
}

export default websocketReducer
