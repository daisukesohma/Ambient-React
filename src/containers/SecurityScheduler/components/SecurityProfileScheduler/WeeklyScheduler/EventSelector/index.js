import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'

import map from 'lodash/map'

// src
import useStyles from './style'

const propTypes = {
  events: PropTypes.array,
  selectedEvent: PropTypes.object,
  selectEvent: PropTypes.func,
  legendTitle: PropTypes.string,
}

const defaultProps = {
  events: [],
  selectEvent: () => {},
  selectedEvent: {},
  legendTitle: 'Events: ',
}

export default function EventSelector({
  events,
  selectEvent,
  selectedEvent,
  legendTitle,
}) {
  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({ darkMode })

  const onRadioClick = eventSelected => () => {
    selectEvent(eventSelected)
  }

  return (
    <fieldset id='EventSelector'>
      <div className='legend-body'>
        <RadioGroup className={classes.formGroup}>
          {map(events, event => (
            <Fragment key={event.event}>
              <FormControlLabel
                className={classes.formLabel}
                value={event.event}
                label={event.event}
                checked={selectedEvent.event === event.event}
                control={<Radio style={{ color: event.color }} />}
                onChange={onRadioClick(event)}
              />
            </Fragment>
          ))}
        </RadioGroup>
      </div>
    </fieldset>
  )
}

EventSelector.propTypes = propTypes
EventSelector.defaultProps = defaultProps
