/* author: rodaan@ambient.ai
  Hangs up an existing stream 
*/
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { WebRTCMessageTypeEnum, StreamStateEnum } from '../../enums'
import { sendP2PMessageRequested } from '../../redux/slices/webrtc'
import mediaStreams from '../mediaStreams'

const useHangUpStream = () => {
  const dispatch = useDispatch()

  const hangUpStream = useCallback(
    ({ videoStreamKey, nodeId, newTrackId }) => {
      mediaStreams.streams[videoStreamKey].status = StreamStateEnum.HANGING_UP
      mediaStreams.streams[videoStreamKey].oldTrackId = null
      dispatch(
        sendP2PMessageRequested({
          videoStreamKey,
          nodeId,
          data: {
            type: WebRTCMessageTypeEnum.HANG_UP,
            trackid: newTrackId,
          },
        }),
      )
    },
    [dispatch],
  )
  return hangUpStream
}

export default useHangUpStream
