import orderBy from 'lodash/orderBy'
import isArray from 'lodash/isArray'
import get from 'lodash/get'
import deepTransform from 'utils/deepTransform'

const defaultKeyOrder = {
  allSitesByAccount: 'name',
  getActiveSites: 'name',
  allSites: 'name',
  sites: 'name',
}

export default function responseInterceptor(response) {
  return deepTransform(response, (value, key) => {
    return defaultKeyOrder[key] && isArray(value)
      ? orderBy(value, [
          object => get(object, defaultKeyOrder[key], '').toLowerCase(),
        ])
      : value
  })
}
