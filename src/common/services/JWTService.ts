import isEmpty from 'lodash/isEmpty'

const LOCAL_STORAGE_TOKEN_KEY = 'jw_token'

const JWTService = {
  getToken: () : string | null => localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY),
  setToken: (token: string) : void => localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token),
  removeToken: () : void => localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY),

  migrateToken: (oldToken: string) : string | null => {
    if(isEmpty(JWTService.getToken()) && !isEmpty(oldToken)) JWTService.setToken(oldToken)

    return JWTService.getToken()
  },
}

export default JWTService