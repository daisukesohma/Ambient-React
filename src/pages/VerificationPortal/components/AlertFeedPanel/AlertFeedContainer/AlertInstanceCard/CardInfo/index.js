import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
// src
import Tooltip from 'components/Tooltip'

import StatusContent from '../../StatusContent'

import useStyles from './styles'

const propTypes = {
  createDate: PropTypes.string,
  id: PropTypes.number,
  isMini: PropTypes.bool,
  longReadableTime: PropTypes.string,
  status: PropTypes.string,
  unixTs: PropTypes.number,
  AlertIcon: PropTypes.func,
}

const defaultProps = {
  createDate: '',
  id: 0,
  isMini: false,
  longReadableTime: '',
  status: '',
  unixTs: 0,
  AlertIcon: null,
}

function CardInfo({
  createDate,
  id,
  isMini,
  longReadableTime,
  status,
  unixTs,
  AlertIcon,
}) {
  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({ isMini })
  return (
    <Tooltip
      content={
        <StatusContent
          status={status}
          longReadableTime={longReadableTime}
          createDate={createDate}
          id={id}
          unixTs={unixTs}
        />
      }
      theme={darkMode ? 'ambient-dark' : 'ambient-white'}
      placement={'right'}
      arrow={true}
    >
      <div className={classes.info}>
        <AlertIcon
          width={isMini ? 20 : 28}
          height={isMini ? 20 : 28}
          stroke={'white'}
          fill={'white'}
        />
      </div>
    </Tooltip>
  )
}

CardInfo.propTypes = propTypes
CardInfo.defaultProps = defaultProps

export default CardInfo
