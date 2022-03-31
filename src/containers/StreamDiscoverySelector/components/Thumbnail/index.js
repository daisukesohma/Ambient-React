import React from 'react'
import PropTypes from 'prop-types'

import { useStyles } from './styles'

// can provide sizeme 'size' or override with height and width
// ideally we remove size later.
//
export default function Thumbnail({ src, hovering, height }) {
  const WIDTH = 250
  const HEIGHT = 250
  const ASPECT_RATIO_WIDTH_HEIGHT = WIDTH / HEIGHT
  const classes = useStyles({ height, ratio: ASPECT_RATIO_WIDTH_HEIGHT })

  return (
    <div
      id='alert-gif-container'
      style={{ display: 'block', position: 'relative' }}
    >
      <div className={classes.imageContainer}>
        {src && (
          <img
            className={classes.image}
            src={src}
            alt=''
            style={{ opacity: hovering ? 0.5 : 1 }}
          />
        )}
      </div>
    </div>
  )
}

Thumbnail.propTypes = {
  size: PropTypes.object,
  src: PropTypes.string,
  hovering: PropTypes.bool,
}
