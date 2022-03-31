import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setVideoStreamValues } from 'redux/slices/videoStreamControls'

// https://blog.videojs.com/hiding-and-showing-video-player-controls/
//
const useMouseMove = ({ videoStreamKey }) => {
  const dispatch = useDispatch()
  const [userActive, setUserActive] = useState(false)

  let inactivityTimeout

  const resetDelay = s => {
    clearTimeout(inactivityTimeout)
    inactivityTimeout = setTimeout(() => {
      setUserActive(false)
    }, s * 1000)
  }

  const onMove = () => {
    if (!userActive) {
      setUserActive(true)
      resetDelay(4)
    }
  }

  // propagate change to redux
  useEffect(() => {
    if (videoStreamKey) {
      dispatch(
        setVideoStreamValues({
          videoStreamKey,
          props: {
            userActive,
          },
        }),
      )
    }
  }, [userActive, videoStreamKey, dispatch])

  return {
    onMove,
    userActive,
  }
}

export default useMouseMove
