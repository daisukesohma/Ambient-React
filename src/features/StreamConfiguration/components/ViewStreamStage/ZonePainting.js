import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import isEmpty from 'lodash/isEmpty'
import { LINE_OPACITY } from 'features/StreamConfiguration/constants'

import ZoneUrlImage from './ZoneUrlImage'

const defaultProps = {
  visible: true,
  src: undefined,
}

const propTypes = {
  visible: PropTypes.bool,
  src: PropTypes.string,
}

function ZonePainting({ visible, src }) {
  const imageRef = useRef()

  return (
    <>
      {visible && !isEmpty(src) && (
        <ZoneUrlImage
          ref={imageRef}
          src={src}
          x={0}
          y={0}
          opacity={LINE_OPACITY}
        />
      )}
    </>
  )
}

ZonePainting.defaultProps = defaultProps
ZonePainting.propTypes = propTypes

export default ZonePainting
