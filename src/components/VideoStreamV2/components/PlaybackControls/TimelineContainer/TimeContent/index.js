import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { useTheme } from '@material-ui/core/styles'

import { useTimeFormat } from '../../../../utils'

const TimeContent = ({ format, ts }) => {
  const { palette } = useTheme()
  const unixTs = moment.unix(ts)
  const { hours, minutes, seconds, ampm } = useTimeFormat(unixTs, format)
  const hasTime = ts && unixTs && hours && minutes && seconds

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignContent: 'space-around',
    },
    mainText: {
      fontSize: 16,
    },
    subText: {
      fontSize: 14,
      color: palette.grey[300],
    },
    endText: {
      fontSize: 16,
      color: palette.grey[400],
      marginLeft: 5,
    },
  }

  return (
    <div style={styles.container}>
      {hasTime && (
        <>
          <span style={styles.mainText}>{`${hours}:${minutes}`}</span>
          <span style={styles.subText}>{seconds}</span>
          {ampm && <span style={styles.endText}>{ampm}</span>}
        </>
      )}
    </div>
  )
}

//  Keeping here, but removing for now
//
// import { Icons } from 'ambient_ui'
// const { Play } = Icons
// const PlayAtIndicator = () => (
//   <span style={{ marginRight: 5 }}>
//     <Play height={16} width={16} stroke={'red'} /> @
//   </span>
// )
//

TimeContent.defaultProps = {
  format: '12h',
  ts: undefined,
}

TimeContent.propTypes = {
  format: PropTypes.oneOf(['12h', '24h']),
  ts: PropTypes.number,
}

export default TimeContent
