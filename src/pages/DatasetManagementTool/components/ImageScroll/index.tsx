import { Grid } from '@material-ui/core'
import { get } from 'lodash'
import React, { useRef, useState } from 'react'
import { Stage, Layer, Image } from 'react-konva'
import useImage from 'use-image'

// src
import useStyles from './styles'

interface ImageScrollProps {
  source: string
}

interface ScrollEvent {
  deltaY: number
  clientX: number
  clientY: number
}

const STAGE_WIDTH = 600
const STAGE_HEIGHT = 500

export default function ImageScroll({ source }: ImageScrollProps): JSX.Element {
  const classes = useStyles()
  const [image] = useImage(source)
  const stageRef = useRef(null)

  const imageBigger =
    (image && STAGE_WIDTH < image.width) ||
    (image && STAGE_HEIGHT < image.height)
  const [zoom, setZoom] = useState(imageBigger ? 0.3 : 0.7)

  const onScroll = (e: ScrollEvent) => {
    if (e.deltaY > 0) {
      setZoom(zoom + 0.1)
    } else {
      setZoom(zoom - 0.1)
    }
  }

  return (
    <Grid
      container
      alignItems='center'
      justify='space-around'
      onWheelCapture={onScroll}
      className={classes.imageContainer}
    >
      {image && (
        <Stage
          className={classes.imageStage}
          height={STAGE_HEIGHT}
          width={STAGE_WIDTH}
          ref={stageRef}
          draggable
          offsetX={-get(image, 'width', 0) / 2}
          offsetY={-get(image, 'height', 0) / 2}
        >
          <Layer opacity={1}>
            <Image
              image={image}
              scaleX={zoom}
              scaleY={zoom}
              x={STAGE_WIDTH / 2 - get(image, 'width', 0) / 2}
              y={STAGE_HEIGHT / 2 - get(image, 'height', 0) / 2}
              offsetX={get(image, 'width', 0) / 2}
              offsetY={get(image, 'height', 0) / 2}
            />
          </Layer>
        </Stage>
      )}
    </Grid>
  )
}
