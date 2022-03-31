import React, { useRef } from 'react'
import PropTypes from 'prop-types'

const propTypes = {
  shape: PropTypes.object,
  shapeProps: PropTypes.object,
}

// NakedShape is just a wrapper around the shape.
// Shape has a Transformer built in
//
function NakedShape({ shape, shapeProps }) {
  const shapeRef = useRef()

  return (
    <>
      <shape.component {...shape.props} {...shapeProps} ref={shapeRef} />
    </>
  )
}

NakedShape.propTypes = propTypes

export default NakedShape
