import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import Button from '@material-ui/core/Button'
// src
import { useCursorStyles, useFlexStyles } from 'common/styles/commonStyles'

import useStyles from './styles'

const EscalationDuration = props => {
  const flexClasses = useFlexStyles()
  const cursorClasses = useCursorStyles()
  const isValid =
    Number(props.edited_duration_secs) > 0 &&
    props.edited_duration_secs !== props.durationSecs
  const activeEdit = props.editEnabled && isValid
  const classes = useStyles({activeEdit})

  return (
    <div
      id='escalation-duration'
      className={clsx(flexClasses.row, flexClasses.centerBetween, classes.root)}
    >
      <div className={classes.durationTextContainer}>
        <div className={clsx('am-body2', classes.durationLabel)}>
          Escalates after:
        </div>
        <div className={clsx(flexClasses.row, flexClasses.centerStart)}>
          <div className={classes.durationContainer}>
            {props.editEnabled ? (
              <input
                className={classes.durationInput}
                value={props.edited_duration_secs}
                onChange={props.onDurationChange}
              />
            ) : (
              <div
                className={clsx('am-body2', cursorClasses.pointer)}
                onClick={props.toggleUpdatingDurationSecs}
              >
                {props.durationSecs}
              </div>
            )}
          </div>
          <div className={clsx('am-body2')}>seconds</div>

          {props.editEnabled && isValid && (
            <div className={classes.buttonContainer}>
              <Button onClick={props.updateDurationSecs} color='primary'>
                Update
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

EscalationDuration.propTypes = {
  editEnabled: PropTypes.bool,
  updatingDuration: PropTypes.bool,
  durationSecs: PropTypes.number,
  edited_duration_secs: PropTypes.number,
  onDurationChange: PropTypes.func,
  toggleUpdatingDurationSecs: PropTypes.func,
  updateDurationSecs: PropTypes.func,
}

EscalationDuration.defaultProps = {
  editEnabled: false,
  updatingDuration: false,
  durationSecs: 5,
  edited_duration_secs: 5,
  onDurationChange: () => {},
  toggleUpdatingDurationSecs: () => {},
  updateDurationSecs: () => {},
}

export default EscalationDuration
