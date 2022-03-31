import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import MuiSlider from '@material-ui/core/Slider'

const useStyles = makeStyles(({ palette }) => ({
  container: {
    width: 'calc(100% - 40px)',
    margin: '50px 20px',
  },
  mark: {
    backgroundColor: palette.primary.light,
  },
  rail: {
    backgroundColor: palette.grey[500],
  },
  track: {
    backgroundColor: palette.primary.main,
  },
}))

function Slider({ min, max, step, defaultValue, onChange }) {
  const classes = useStyles()

  const handleChange = (event, value) => {
    onChange(value)
  }

  return (
    <div className={classes.container}>
      <MuiSlider
        defaultValue={defaultValue}
        aria-labelledby='discrete-slider'
        valueLabelDisplay='auto'
        step={step}
        min={min}
        max={max}
        marks
        onChangeCommitted={handleChange}
        classes={{
          mark: classes.mark,
          rail: classes.rail,
          track: classes.track,
        }}
      />
    </div>
  )
}

Slider.defaultProps = {
  onChange: () => {},
}

Slider.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired,
  defaultValue: PropTypes.number.isRequired,
  onChange: PropTypes.func,
}

export default Slider
