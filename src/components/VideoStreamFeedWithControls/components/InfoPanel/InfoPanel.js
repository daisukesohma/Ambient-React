import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'ambient_ui'
import clsx from 'clsx'

import useStyles from './styles'

const propTypes = {
  onCancel: PropTypes.func.isRequired,
  onConfirmChange: PropTypes.func.isRequired,
}

const InfoPanel = memo(({ onCancel, onConfirmChange }) => {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <div className={clsx('datepicker-buttons', classes.buttons)}>
        <Button onClick={onCancel} variant='outlined'>
          Cancel
        </Button>
        <Button onClick={onConfirmChange}>Confirm</Button>
      </div>
    </div>
  )
})

InfoPanel.propTypes = propTypes

export default InfoPanel
