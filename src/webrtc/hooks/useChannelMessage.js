import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
// import { WebRTCChannelMessageTypeEnum } from 'enums'

import { sendChannelMessageRequested } from '../../redux/slices/webrtc'

// expected data = {'command':'next', 'streamid': str(streamId), 'trackid': oldTrackId})
// if command = "speed", 'speed': one of 0.25, 0.5, 1.0, 2.0, 4.0, or 8.0 (floats)
//
// NEXT_FRAME: 'next',
// PREVIOUS_FRAME: 'previous',
// PAUSE: 'pause',
// UNPAUSE: 'unpause',
// SPEED: 'speed'

const useChannelMessage = ({
  nodeId,
  videoStreamKey,
  streamId,
  oldTrackId,
}) => {
  const dispatch = useDispatch()
  const sendChannelMessage = useCallback(
    (command, speedMultiplier) => {
      const data = {
        command,
        speed: speedMultiplier,
        streamid: streamId,
        trackid: oldTrackId,
      }

      dispatch(
        sendChannelMessageRequested({
          nodeId,
          videoStreamKey,
          data,
        }),
      )
    },
    [dispatch, nodeId, oldTrackId, streamId, videoStreamKey],
  )

  return {
    sendChannelMessage,
  }
}

export default useChannelMessage
