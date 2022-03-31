import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Transformer } from 'react-konva'

const propTypes = {
  shape: PropTypes.object,
  shapeProps: PropTypes.object,
  isSelected: PropTypes.bool,
}

const defaultProps = {
  rotationEnabled: true,
}

function Shape({ shape, isSelected, shapeProps }) {
  const shapeRef = useRef()
  const trRef = useRef()

  useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current.nodes([shapeRef.current])
      trRef.current.getLayer().batchDraw()
    }
  }, [isSelected])

  return (
    <>
      <shape.component {...shape.props} {...shapeProps} ref={shapeRef} />
      {isSelected && (
        <Transformer ref={trRef} rotateEnabled={shape.rotationEnabled} />
      )}
    </>
  )
}

Shape.propTypes = propTypes
Shape.defaultProps = defaultProps

export default Shape
