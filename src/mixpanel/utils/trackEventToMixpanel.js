import mixpanel from 'mixpanel-browser'
import isEqual from 'lodash/isEqual'
import split from 'lodash/split'
import compact from 'lodash/compact'
import first from 'lodash/first'
import get from 'lodash/get'

export default (eventEnum, eventData = {}) => {
  // global catch account from pathname
  let account
  try {
    const urlParts = compact(split(window.location.pathname, '/'))
    if (isEqual(first(urlParts), 'accounts')) account = get(urlParts, '[1]')
  } catch (e) {
    console.error(e.message)
    account = null
  }

  try {
    mixpanel.track(eventEnum, {
      ...eventData,
      account,
    })
  } catch (e) {
    console.error(e.message)
  }
}
