import axios from 'axios'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import { store, persistor } from '../redux/store'

import getHost from './getHost'
import APITokenService from '../common/services/APITokenService'

export default ({ url, method, params, data }) => {
  const oldToken = get(store.getState().auth, 'apiToken')
  const apiToken = APITokenService.migrateToken(oldToken)

  if (!isEmpty(apiToken))
    axios.defaults.headers.common.Authorization = `Bearer ${apiToken}`

  const errorHandler = error => {
    if (
      error.response &&
      error.response.status === 401 &&
      error.response.body &&
      error.response.body.detail === 'Token has expired.'
    ) {
      persistor.purge().then(() => window.location.replace('/login'))
    }
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject({ ...error })
  }

  axios.interceptors.response.use(null, errorHandler)

  return axios({
    baseURL: getHost(),
    method,
    url,
    data,
    params,
  })
}
