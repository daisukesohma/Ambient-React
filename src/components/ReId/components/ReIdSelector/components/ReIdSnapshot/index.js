import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
// src
import Tooltip from 'components/Tooltip'
import Logo from 'assets/logo_icon.png'
import { useFlexStyles } from 'common/styles/commonStyles'

import useReIdData from '../../hooks/useReIdData'

import useStyles from './styles'

const propTypes = {
  data: PropTypes.object,
  isMini: PropTypes.bool,
  isSelected: PropTypes.bool,
}

const defaultProps = {
  data: {},
  isMini: false,
  isSelected: false,
}

const ReIdSnapshot = ({ data, isSelected, isMini }) => {
  const classes = useStyles({ isSelected, isMini })
  const flexClasses = useFlexStyles()
  // const streamId = useSelector(state => state.modal.streamId) // ensure streamId in modal is == data.streamId
  const [retries, setRetries] = useState(0)
  const { requestSnapshots } = useReIdData()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    requestSnapshots(data)
  }, []) // eslint-disable-line

  // Future: @eric
  // Consider using https://github.com/wellyshen/react-cool-img for handling error
  //
  const handleError = ev => {
    ev.persist() // react synthetic event, so persist the event

    // Retry every x Seconds Y Times
    const MAX_RETRIES = 5
    const RETRY_TIMEOUT = 2000

    if (retries < MAX_RETRIES) {
      setRetries(retries + 1)
      setTimeout(() => {
        ev.target.src = data.cropUrl // eslint-disable-line
      }, RETRY_TIMEOUT)
    } else {
      ev.target.onerror = null // eslint-disable-line
      ev.target.src = Logo // eslint-disable-line
      ev.target.style.width = '32px' // eslint-disable-line
      ev.target.style.opacity = '0.7' // eslint-disable-line
    }
  }

  const handleLoad = ev => {
    ev.persist()
    ev.target.onerror = null // eslint-disable-line
    setIsLoaded(true)
  }

  return (
    <div
      className={clsx(flexClasses.column, flexClasses.centerAll, classes.root)}
    >
      <Tooltip
        content={
          <img
            src={data.cropUrl}
            alt=''
            className={classes.imgTooltip}
            onError={handleError}
            onLoad={handleLoad}
          />
        }
      >
        <img
          className={classes.img}
          style={{ display: isLoaded ? 'flex' : 'none' }}
          alt='pic'
          src={data.cropUrl}
          onError={handleError}
          onLoad={handleLoad}
        />
      </Tooltip>
      <img
        alt=''
        className={classes.logo}
        style={{ display: isLoaded ? 'none' : 'flex' }}
        src={Logo}
      />
    </div>
  )
}

ReIdSnapshot.propTypes = propTypes
ReIdSnapshot.defaultProps = defaultProps

export default ReIdSnapshot
