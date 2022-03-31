import get from 'lodash/get'

import getActivitySite from './getActivitySite'

const getActivitySiteName = activity => {
  return get(getActivitySite(activity), 'name')
}

export default getActivitySiteName
