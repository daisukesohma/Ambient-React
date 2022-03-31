import React, { useRef, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { ReactReduxContext, Provider, useSelector } from 'react-redux'
import { Stage, Layer, Image } from 'react-konva'
import { Box, Grid } from '@material-ui/core'
import { get } from 'lodash'
import useImage from 'use-image'
// src
import {
  CANVAS_SIZE,
  PAINTING_TOOLS,
} from 'features/StreamConfiguration/constants'
import LogoAnimated from 'components/LogoAnimated'

import ZoomStageControl from './components/ZoomStageControl'
import useStyles from './styles'

const canvasSize = [CANVAS_SIZE.x, CANVAS_SIZE.y]

const propTypes = {
  children: PropTypes.node,
  onMouseEnter: PropTypes.func,
  stageProps: PropTypes.object,
}

const defaultProps = {
  children: null,
  onMouseEnter: () => {},
  stageProps: {},
}

// This also  provides ReactReduxContext for Konva to bridge provider INTO the stage.
// It consumes it outside and passes it inside Stage
// https://github.com/konvajs/react-konva/issues/311
//
function StreamStage({ children, onMouseEnter, ...stageProps }) {
  const activeStream = useSelector(
    state => state.streamConfiguration.activeStream,
  )
  const activeStreamSnapshotLoading = useSelector(
    state => state.streamConfiguration.activeStreamSnapshotLoading,
  )
  const isHoveringOnAnnotationPoint = useSelector(
    state => state.streamConfiguration.isHoveringOnAnnotationPoint,
  )
  const [image] = useImage(get(activeStream, 'snapshot.dataStr'))
  const layerRef = useRef()
  const containerRef = useRef()
  const stageRef = useRef()
  const [scale, setScale] = useState(1)
  const classes = useStyles({ activeStream })

  const tool = useSelector(state => state.streamConfiguration.tool)
  const getCursorStyle = toolName => {
    if (toolName === PAINTING_TOOLS.PEN) {
      return 'crosshair'
    }
    return 'grab'
  }

  // ZOOM
  useEffect(() => {
    setScale(scale)
  }, [scale])

  return (
    <Grid
      style={{ height: '100%' }}
      container
      direction='row'
      justify='center'
      alignItems='center'
    >
      <ZoomStageControl stageRef={stageRef} />
      <Box ref={containerRef} height={canvasSize[1]} width={canvasSize[0]}>
        <ReactReduxContext.Consumer>
          {({ store }) => (
            <Stage
              height={canvasSize[1]}
              width={canvasSize[0]}
              ref={stageRef}
              style={{ position: 'absolute' }}
              scaleX={scale}
              scaleY={scale}
              draggable={!isHoveringOnAnnotationPoint}
              onMouseEnter={e => {
                e.target.container().style.cursor = getCursorStyle(tool)
                onMouseEnter(e)
              }}
              {...stageProps}
            >
              <Provider store={store}>
                <Layer opacity={activeStreamSnapshotLoading ? 0.4 : 1}>
                  <Image image={image} />
                </Layer>
                <Layer ref={layerRef}>{children}</Layer>
              </Provider>
            </Stage>
          )}
        </ReactReduxContext.Consumer>
      </Box>
    </Grid>
  )
}

StreamStage.propTypes = propTypes
StreamStage.defaultProps = defaultProps

export default StreamStage
