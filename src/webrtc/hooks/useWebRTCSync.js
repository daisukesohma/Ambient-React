/* author: aleks@ambient.ai
  Callback for each syncTs ping
*/
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import isNumber from 'lodash/isNumber'
import moment from 'moment'

import getStreamFeedData from '../../selectors/webrtc/getStreamFeedData'
import { msToUnix } from '../../utils'

// NOTE: it was experimental hook for synchronization of stream (syncing on FE/BE).
// WARNING: if you will activate this hook, it will update "startAt" property to often
// be careful because several useEffect use "startAt" as dependencies for XHR calls (metadata, catalogues, etc...)

const useWebRTCSync = (videoStreamKey, callback) => {
  const syncTs = useSelector(
    getStreamFeedData({ videoStreamKey, property: 'syncTs' }),
  )

  return useEffect(() => {
    if (isNumber(syncTs)) {
      const playTime = moment.unix(msToUnix(syncTs)).toDate()

      // const debugTime = () => {
      // console.debug('sync', {
      //   playTime,
      //   syncTs,
      //   formatTime: moment.unix(syncTs / 1000).format('mm:ss'),
      // })
      // }

      callback({ playTime, key: syncTs, startAt: playTime })
    }
  }, [videoStreamKey, syncTs, callback])
}

export default useWebRTCSync
