/* author: bshapero@ambient.ai
  Sends export signal
*/

import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { WebRTCMessageTypeEnum } from '../../enums'
import { sendP2PMessageRequested } from '../../redux/slices/webrtc'

const useExportStream = () => {
  const dispatch = useDispatch()

  return useCallback(
    ({ nodeId, videoStreamKey, streamId, oldTrackId, startTs, endTs }) => {
      const data = {
        type: WebRTCMessageTypeEnum.EXPORT,
        streamid: streamId.toString(),
        trackid: `${oldTrackId}-${streamId}-${Math.floor(startTs)}-${Math.floor(
          endTs,
        )}`,
        data: {
          start_ts: startTs,
          end_ts: endTs,
          s3: 'TODO: REMOVE; unused but required by appliance or FATAL ERROR',
        },
      }

      dispatch(
        sendP2PMessageRequested({
          nodeId,
          videoStreamKey,
          data,
        }),
      )
    },
    [dispatch],
  )
}

export default useExportStream
