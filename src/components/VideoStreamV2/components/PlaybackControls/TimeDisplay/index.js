import React, { useEffect, useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { useTheme } from '@material-ui/core/styles'

import Tooltip from 'components/Tooltip'
import { PlaybackStatusEnum } from 'enums'
import { useTimeFormat } from '../../../utils'

import NowTime from './NowTime'

// future - reformat the useTimeFormat with this
// else '12h'
// moment format for multiple locale https://momentjs.com/
// LTS is locale time with seconds, 'h:mm:ss A' vs LT is 'h:mm A'
//
const getFormatWithZoomLevel = (format, zoomLevel) => {
  if (format === '24h') return format
  return zoomLevel > 6 ? 'LTS' : 'LT'
}

const TimeDisplay = ({
  darkMode,
  format,
  isToday,
  playbackStatus,
  videoStreamTS, // current play time
  zoomLevel,
}) => {
  const { palette } = useTheme()
  const [readablePlay, setReadablePlay] = useState()
  const playTS = moment.unix(Math.floor(videoStreamTS))
  const renderFormat = getFormatWithZoomLevel(format, zoomLevel)
  const playTime = useTimeFormat(videoStreamTS, 'LTS').string
  const isLive = playbackStatus === PlaybackStatusEnum.LIVE

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingLeft: 12,
      marginRight: 10,
      minWidth: 218,
      background: palette.grey[100],
      border: `1px solid ${palette.grey[200]}`,
      boxSizing: 'border-box',
      cursor: 'pointer',
      borderRadius: 2,
    },
    containerDark: {
      background: palette.grey[800],
      border: `1px solid ${palette.grey[700]}`,
    },
    middle: {
      padding: '0 8px',
    },
    text: {
      minWidth: 104,
      fontSize: 18,
      lineHeight: '24px',
      fontStyle: 'normal',
      fontWeight: 'normal',
      letterSpacing: '0.02em',
      color: palette.common.black,
    },
    textDark: {
      color: palette.common.white,
    },
  }

  useEffect(() => {
    if (renderFormat === '24h') {
      setReadablePlay(playTime)
    } else {
      setReadablePlay(playTS.format('LTS'))
    }
  }, [
    format,
    playbackStatus,
    renderFormat,
    videoStreamTS,
    zoomLevel,
    playTS,
    playTime,
  ])

  const containerStyle = useMemo(() => {
    return darkMode
      ? { ...styles.container, ...styles.containerDark }
      : styles.container
  }, [darkMode])

  const textStyle = useMemo(() => {
    return darkMode ? { ...styles.text, ...styles.textDark } : styles.text
  }, [darkMode])

  return (
    <div style={containerStyle}>
      <Tooltip content='Current play time'>
        <div style={textStyle}>{readablePlay}</div>
      </Tooltip>
      {!isLive ||
        (!isToday && (
          <>
            <div style={styles.middle}>/</div>
            <Tooltip content='Current time'>
              <div style={textStyle}>
                <NowTime />
              </div>
            </Tooltip>
          </>
        ))}
    </div>
  )
}

TimeDisplay.defaultProps = {
  darkMode: false,
  dayStartTS: 0,
  dayEndTS: 0,
  format: '12h',
  isToday: true,
  playbackStatus: '',
  toggleSeekTime: () => {},
  videoStreamTS: 0,
  zoomLevel: 5,
}
TimeDisplay.propTypes = {
  darkMode: PropTypes.bool,
  dayStartTS: PropTypes.number,
  dayEndTS: PropTypes.number,
  format: PropTypes.oneOf(['12h', '24h']),
  isToday: PropTypes.bool,
  playbackStatus: PropTypes.string,
  toggleSeekTime: PropTypes.func,
  videoStreamTS: PropTypes.number,
  zoomLevel: PropTypes.number,
}
export default TimeDisplay
