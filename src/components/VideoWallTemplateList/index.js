import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'
import { useSelector } from 'react-redux'
import { Grid } from '@material-ui/core'
import { map, get } from 'lodash'

import useStyles from './styles'

const propTypes = {
  templates: PropTypes.array,
  selectedTemplate: PropTypes.object,
  onSelect: PropTypes.func,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

function VideoWallTemplateList({
  templates,
  selectedTemplate,
  onSelect,
  width,
}) {
  const { palette } = useTheme()
  const classes = useStyles({ width })
  const darkMode = useSelector(state => state.settings.darkMode)

  const getBgFill = useCallback(
    template => {
      if (get(selectedTemplate, 'id') === template.id) {
        return darkMode ? palette.grey[500] : palette.grey[300]
      }
      return darkMode ? palette.common.black : palette.common.white
    },
    [selectedTemplate, darkMode],
  )

  // color of border
  const getBgStroke = useCallback(
    template => {
      if (get(selectedTemplate, 'id') === template.id) {
        return darkMode ? palette.grey[700] : palette.grey[500]
      }
      return darkMode ? palette.grey[700] : palette.grey[300]
    },
    [selectedTemplate, darkMode],
  )

  // color of the the panels within each icon, ie. 3x3 panel color
  const getFill = useCallback(
    template => {
      if (get(selectedTemplate, 'id') === template.id) {
        return darkMode ? palette.common.black : palette.grey[500] // (in design, this is GREY_500, and the grid itself is BLACK)
      }
      return palette.grey[500]
    },
    [selectedTemplate, darkMode],
  )

  return (
    <div className={classes.templateContent}>
      {map(templates, template => {
        return (
          <Grid
            id={`icon-template-${template.id}`}
            m={1}
            key={`template-selector-${template.id}`}
            onClick={event => {
              onSelect(event, template)
            }}
            className={classes.box}
          >
            <template.icon
              bgFill={getBgFill(template)}
              bgStroke={getBgStroke(template)}
              fill={getFill(template)}
            />
          </Grid>
        )
      })}
    </div>
  )
}

VideoWallTemplateList.propTypes = propTypes

export default VideoWallTemplateList
