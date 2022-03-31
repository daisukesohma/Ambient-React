/* author: rodaan@ambient.ai
  Updates Stream Ts if stream state is archival
*/
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { WebRTCMessageTypeEnum } from '../../enums'
import { sendP2PMessageRequested } from '../../redux/slices/webrtc'

const useUpdateArchivalStreamTs = () => {
  const dispatch = useDispatch()

  const updateArchivalStreamTs = useCallback(
    ({ nodeId, videoStreamKey, streamId, oldTrackId, ts }) => {
      if (oldTrackId) {
        const data = {
          type: WebRTCMessageTypeEnum.ARCHIVAL,
          streamid: streamId,
          trackid: oldTrackId,
          data: {
            command: 'ts',
            ts: Math.floor(ts),
          },
        }

        dispatch(
          sendP2PMessageRequested({
            nodeId,
            videoStreamKey,
            data,
          }),
        )
      }
    },
    [dispatch],
  )

  return updateArchivalStreamTs
}

export default useUpdateArchivalStreamTs
