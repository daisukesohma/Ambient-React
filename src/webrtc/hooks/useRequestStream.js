/* author: rodaan@ambient.ai
  Requests a new stream
*/
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import {
  WebRTCMessageTypeEnum,
  StreamStateEnum,
  StreamTypeUpdatedEnum,
} from 'enums'
import { sendP2PMessageRequested } from 'redux/slices/webrtc'

import mediaStreams from '../mediaStreams'

const useRequestStream = () => {
  const dispatch = useDispatch()

  return useCallback(
    ({ nodeId, videoStreamKey, streamId, mode, ts }) => {
      if (mode === StreamTypeUpdatedEnum.RECORDED && !ts) {
        // Should never be mode 3 without a ts
        console.log(`Error: tried requesting RECORDED with no ts`)
        return
      }

      const data = {
        type: WebRTCMessageTypeEnum.REQUEST_STREAM,
        streamid: streamId.toString(),
        mode,
        trackid: uuidv4(),
      }

      if (ts) {
        data.ts = Math.floor(ts)
      }

      mediaStreams.streams[videoStreamKey] = {
        mode,
        streamId,
        nodeId,
        oldTrackId: data.trackid,
        status: StreamStateEnum.LOADING,
      }
      if (data.ts) {
        mediaStreams.streams[videoStreamKey].requestTs = data.ts
        mediaStreams.streams[videoStreamKey].ts = data.ts
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

export default useRequestStream
