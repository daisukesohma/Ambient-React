import { createSelector } from '@reduxjs/toolkit'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import parseLatLng from '../../utils/parseLatLng'

export default createSelector(
  [state => state.alertModal.dispatchStatus],
  dispatchStatus => {
    const coordinates = parseLatLng(
      get(dispatchStatus, 'alertEvent.alert.site.latlng'),
    )
    if (isEmpty(coordinates)) return null
    return { lat: coordinates.lat, lng: coordinates.lng }
  },
)
