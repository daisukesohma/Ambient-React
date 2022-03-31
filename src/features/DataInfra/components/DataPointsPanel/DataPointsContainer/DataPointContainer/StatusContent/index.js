import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import clsx from 'clsx'
import moment from 'moment'

import useStyles from './styles'

const propTypes = {
  createDate: PropTypes.string,
  tsIdentifierStart: PropTypes.string,
  tsIdentifierEnd: PropTypes.string,
  sourceType: PropTypes.string,
  source: PropTypes.string,
  streamId: PropTypes.string,
  id: PropTypes.number,
}

const defaultProps = {
  createDate: '',
  tsIdentifierStart: '',
  tsIdentifierEnd: '',
  sourceType: '',
  source: '',
  streamId: '',
  id: 0,
}

function StatusContent({
  createDate,
  tsIdentifierStart,
  tsIdentifierEnd,
  sourceType,
  source,
  streamId,
  id,
}) {
  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({ darkMode })
  const tsIdentifierStartReadable = moment
    .unix(tsIdentifierStart / 1000)
    .format('ddd MM/DD/YY HH:mm:ssA')
  const tsIdentifierEndReadable = moment
    .unix(tsIdentifierEnd / 1000)
    .format('ddd MM/DD/YY HH:mm:ssA')

  return (
    <div className={classes.container}>
      <div className={clsx('am-overline', classes.id)}>Data Point ID: {id}</div>
      <div className={clsx('am-overline', classes.id)}>
        Stream Id: {streamId}
      </div>
      <div className={clsx('am-overline', classes.status)}>
        Created At: {createDate}
      </div>
      <div className={clsx('am-overline', classes.status)}>
        Starts At: {tsIdentifierStartReadable}
      </div>
      <div className={clsx('am-overline', classes.status)}>
        Ends At: {tsIdentifierEndReadable}
      </div>
      <div className={clsx('am-overline', classes.status)}>
        Duration: {(tsIdentifierEnd - tsIdentifierStart) / 1000} seconds
      </div>
      <div className={clsx('am-overline', classes.status)}>
        Source Type: {sourceType}
      </div>
      <div className={clsx('am-overline', classes.status)}>
        Source: {source}
      </div>
    </div>
  )
}

StatusContent.propTypes = propTypes
StatusContent.defaultProps = defaultProps

export default StatusContent
