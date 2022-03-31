import React from 'react'
import PropTypes from 'prop-types'
import Box from '@material-ui/core/Box'
import { useSelector } from 'react-redux'
import { Icon as IconKit } from 'react-icons-kit'
import { plus } from 'react-icons-kit/feather/plus'
import { minus } from 'react-icons-kit/feather/minus'
import { refreshCw } from 'react-icons-kit/feather/refreshCw'
import CircularIconButton from 'components/Buttons/CircularIconButton'
import { useFlexStyles } from 'common/styles/commonStyles'
import clsx from 'clsx'

import useStyles from './styles'

// ZOOM
//
function zoomStage(stage, scaleBy) {
  const oldScale = stage.scaleX()

  const pos = {
    x: stage.width() / 2,
    y: stage.height() / 2,
  }
  const mousePointTo = {
    x: pos.x / oldScale - stage.x() / oldScale,
    y: pos.y / oldScale - stage.y() / oldScale,
  }

  const newScale = Math.max(0.05, oldScale * scaleBy)

  const newPos = {
    x: -(mousePointTo.x - pos.x / newScale) * newScale,
    y: -(mousePointTo.y - pos.y / newScale) * newScale,
  }

  const newAttrs = limitAttributes(stage, { ...newPos, scale: newScale })

  if (newAttrs.scale < 1) {
    resetZoomStage(stage)
  } else {
    stage.to({
      x: newAttrs.x,
      y: newAttrs.y,
      scaleX: newAttrs.scale,
      scaleY: newAttrs.scale,
      duration: 0.1,
    })
    stage.batchDraw()
  }
}

function resetZoomStage(stage) {
  stage.to({
    x: 0,
    y: 0,
    scaleX: 1,
    scaleY: 1,
    duration: 0.1,
  })
  stage.batchDraw()
}

function limitAttributes(stage, newAttrs) {
  const box = stage.findOne('Image').getClientRect()
  const minX = -box.width + stage.width() / 2
  const maxX = stage.width() / 2

  const x = Math.max(minX, Math.min(newAttrs.x, maxX))

  const minY = -box.height + stage.height() / 2
  const maxY = stage.height() / 2

  const y = Math.max(minY, Math.min(newAttrs.y, maxY))

  const scale = Math.max(0.05, newAttrs.scale)

  return { x, y, scale }
}

// ZOOM

const defaultProps = {
  stageRef: null,
}

const propTypes = {
  stageRef: PropTypes.object,
}

function ZoomStageControl({ stageRef }) {
  const flexClasses = useFlexStyles()
  const activeStream = useSelector(
    state => state.streamConfiguration.activeStream,
  )
  const classes = useStyles({ activeStream })

  return (
    <Box
      className={clsx(
        flexClasses.column,
        flexClasses.startAll,
        classes.iconContainer,
      )}
    >
      <CircularIconButton
        handleClick={() => {
          zoomStage(stageRef.current, 1.2)
        }}
        iconNode={<IconKit icon={plus} />}
        tooltipContent='Zoom in'
        tooltipProps={{ placement: 'right' }}
        borderWidth={1}
      />
      <CircularIconButton
        handleClick={() => {
          zoomStage(stageRef.current, 0.8)
        }}
        iconNode={<IconKit icon={minus} />}
        tooltipContent='Zoom out'
        tooltipProps={{ placement: 'right' }}
        borderWidth={1}
      />
      <CircularIconButton
        handleClick={() => {
          resetZoomStage(stageRef.current)
        }}
        iconNode={<IconKit icon={refreshCw} />}
        tooltipContent={'Reset zoom and pan'}
        tooltipProps={{ placement: 'right' }}
        borderWidth={1}
      />
    </Box>
  )
}

ZoomStageControl.defaultProps = defaultProps
ZoomStageControl.propTypes = propTypes

export default ZoomStageControl
