import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import moment from 'moment'
import onClickOutside from 'react-onclickoutside'
import Grid from '@material-ui/core/Grid'
import Skeleton from '@material-ui/lab/Skeleton'
import get from 'lodash/get'
// src
import { Icons } from 'ambient_ui'
import iconsMap from 'components/AlertEventCard/iconsMap'

import ActionToolbar from './ActionToolbar'
import AlertDescription from './AlertDescription'
import EvidenceGif from './EvidenceGif'
import useStyles from './styles'
import msToUnix from '../../../../../../utils/msToUnix'

const getReadableTimeWithFormat = (unixTs, format) => {
  return moment.unix(unixTs).format(format)
}

const defaultProps = {
  alertInstance: {},
  cardSize: 'medium',
}

const propTypes = {
  alertInstance: PropTypes.object,
  cardSize: PropTypes.oneOf(['medium', 'small']),
  cardStyle: PropTypes.object,
}

function AlertInstanceCard({ alertInstance, cardSize, cardStyle }) {
  AlertInstanceCard.handleClickOutside = () => setIsHover(false)
  const darkMode = useSelector(state => state.settings.darkMode)
  const [isHover, setIsHover] = useState(false)
  const isMini = cardSize === 'small'
  const classes = useStyles({ darkMode, isHover, isMini })

  const unixTs = msToUnix(alertInstance.tsIdentifier)

  const shortReadableTime = getReadableTimeWithFormat(unixTs, 'ddd hh:mm:ss')
  const longReadableTime = getReadableTimeWithFormat(
    unixTs,
    'ddd MM/DD/YY HH:MM:ssA',
  )

  const createDate = moment.unix(unixTs).format('ddd MM/DD/YY HH:MM:ssA')
  const AlertIcon =
    Icons[iconsMap[get(alertInstance, 'alert.threatSignature.icon', '')]] ||
    Icons.AlertCircle

  return (
    <Grid
      className={classes.root}
      onMouseOver={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onMouseEnter={() => setIsHover(true)}
      onTouchStart={() => setIsHover(true)}
      style={cardStyle}
    >
      <AlertDescription
        alertInstance={alertInstance}
        isMini={isMini}
        readableTime={isMini ? shortReadableTime : longReadableTime}
        unixTs={unixTs}
        createDate={createDate}
        AlertIcon={AlertIcon}
      />

      <div className={classes.gifContainer}>
        {alertInstance.verifyLoading ? (
          <Skeleton animation='wave' variant='rect' width='100%' />
        ) : (
          <EvidenceGif alertInstance={alertInstance} />
        )}
      </div>

      <ActionToolbar alertInstance={alertInstance} />
    </Grid>
  )
}

const clickOutsideConfig = {
  handleClickOutside: () => AlertInstanceCard.handleClickOutside,
}

AlertInstanceCard.prototype = {}
AlertInstanceCard.propTypes = propTypes
AlertInstanceCard.defaultProps = defaultProps

export default onClickOutside(AlertInstanceCard, clickOutsideConfig)
