import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Slider from '@material-ui/core/Slider'

import { INVERSE_ZOOM_LEVEL_LABELS } from '../../../utils/constants'
import { getFormattedZoomLabels } from '../../../utils'

const useStyles = makeStyles(({ palette }) => ({
  root: {
    width: 150,
  },
  markLabel: ({ darkMode }) => ({
    color: darkMode ? palette.common.white : palette.common.black,
    userSelect: 'none',
    pointerEvents: 'none',
  }),
}))

const marks = getFormattedZoomLabels()
const valueLabelFormat = value => INVERSE_ZOOM_LEVEL_LABELS[value]
const convertToZoomLevel = value => 10 - value // inverse value 0..10 to zoom 10..0

const ZoomLevelControl = ({ darkMode, setZoomLevel }) => {
  const classes = useStyles({ darkMode })
  const [value, setValue] = React.useState(5)

  const handleChange = (event, newValue) => {
    setValue(newValue)
    setZoomLevel(convertToZoomLevel(newValue))
  }

  return (
    <div className={classes.root}>
      <Slider
        classes={{
          markLabel: classes.markLabel,
        }}
        marks={marks}
        value={value}
        min={0}
        step={1}
        max={10}
        getAriaValueText={valueLabelFormat}
        valueLabelFormat={valueLabelFormat}
        onChange={handleChange}
        valueLabelDisplay='auto'
        aria-labelledby='non-linear-slider'
      />
    </div>
  )
}

ZoomLevelControl.defaultProps = {
  darkMode: false,
  setZoomLevel: () => {},
}

ZoomLevelControl.propTypes = {
  darkMode: PropTypes.bool,
  setZoomLevel: PropTypes.func,
}

export default ZoomLevelControl
