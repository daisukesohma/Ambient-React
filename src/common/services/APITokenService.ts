import isEmpty from 'lodash/isEmpty'

const LOCAL_STORAGE_TOKEN_KEY = 'api_token'
// NOTE: We will need to remove this class as soon as stop supporting classic REST API
const APITokenService = {
  getToken: () : string | null => localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY),
  setToken: (token: string) : void => localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token),
  removeToken: () : void => localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY),

  migrateToken: (oldToken: string) : string | null => {
    if(isEmpty(APITokenService.getToken()) && !isEmpty(oldToken)) APITokenService.setToken(oldToken)

    return APITokenService.getToken()
  },
}

export default APITokenService