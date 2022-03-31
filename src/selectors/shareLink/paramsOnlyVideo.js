import { createSelector } from '@reduxjs/toolkit'
import extend from 'lodash/extend'
import { SHARE_PATH } from './constants'

const shareLinkOnlyVideoParams = createSelector(
  state => state.shareLink.video,
  params => {
    const { streamId, ts } = params
    const origin = window.location.origin

    if (!streamId) return `${origin}${SHARE_PATH}`

    const queryStringObject = {}

    if (streamId) {
      extend(queryStringObject, { sId: streamId })
    }
    if (ts) {
      extend(queryStringObject, { initTs: ts })
    }

    const queryString = new URLSearchParams(queryStringObject).toString()
    return `${origin}${SHARE_PATH}?${queryString}`
  },
)

export default shareLinkOnlyVideoParams
