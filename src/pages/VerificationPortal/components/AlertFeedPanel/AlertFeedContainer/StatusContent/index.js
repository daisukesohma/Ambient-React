import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'

import useStyles from './styles'

const propTypes = {
  createDate: PropTypes.string,
  id: PropTypes.number,
  longReadableTime: PropTypes.string,
  status: PropTypes.string,
  tsIdentifier: PropTypes.string,
  unixTs: PropTypes.number,
}

function StatusContent({ createDate, id, longReadableTime, status, unixTs }) {
  const classes = useStyles()
  const labelClass = clsx('am-caption', classes.label)
  const valueClass = clsx('am-caption', classes.value)

  return (
    <div className={classes.container}>
      <div className={labelClass}>
        Status:&nbsp;
        <span className={clsx('am-overline', valueClass)}>{status}</span>
      </div>
      <div className={labelClass}>Generated by Alert Engine on</div>
      <div className={valueClass}>{createDate}</div>
      <div className={labelClass}>Timestamp on Appliance:</div>
      <div className={valueClass}>{longReadableTime}</div>
      <div className={labelClass}>
        Time identifier:&nbsp;
        <span className={clsx('am-overline', valueClass)}>{unixTs}</span>
      </div>
      <div className={labelClass}>
        ID:&nbsp;
        <span className={clsx('am-overline', valueClass)}>{id}</span>
      </div>
    </div>
  )
}

StatusContent.propTypes = propTypes

export default StatusContent
