import React from 'react'
import PropTypes from 'prop-types'
import { Alert, AlertTitle } from '@material-ui/lab'
import { InfoBoxContentEnum } from 'enums'

import useStyles from './styles'

const propTypes = {
  type: PropTypes.string.isRequired,
}

export default function InfoBox({ type }) {
  const classes = useStyles()
  return (
    <Alert severity='warning' className={classes.alertPanel}>
      <AlertTitle className={classes.alertTitle}>
        {InfoBoxContentEnum[type]}
      </AlertTitle>
    </Alert>
  )
}

InfoBox.propTypes = propTypes