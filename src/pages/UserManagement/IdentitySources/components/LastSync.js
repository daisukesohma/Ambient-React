import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import moment from 'moment'
import isEmpty from 'lodash/isEmpty'

const useStyles = makeStyles(({ palette }) => ({
  date: {
    fontWeight: 'bold',
    letterSpacing: 0.15,
    color: palette.common.black,
  },
}))

const LastSync = ({ date }) => {
  const classes = useStyles()
  if (isEmpty(date)) return 'Never'

  const momentDate = moment.unix(date.tsCreated)

  return (
    <>
      <span className={classes.date}>{momentDate.format('MM/DD/YYYY')}</span>
      &nbsp;
      <span>{momentDate.format('HH:mm:ss')}</span>
    </>
  )
}

LastSync.propTypes = {
  date: PropTypes.any,
}

export default LastSync
