// converts shape object to just the points - an array of {x: , y: }
export const convertShapesToPoints = shapes => {
  return shapes.map(s => convertShapeToPt(s))
}

export const convertShapeToPt = shape => {
  return { x: shape.props.x, y: shape.props.y }
}

// shapeComponent (string) - one of 'Circle', 'Line', or Konva component name
// pt is { x, y }
//
export const convertPtToShape = ({
  id,
  x,
  y,
  component = 'Circle',
  fill = '#18ffa6',
}) => {
  return {
    id,
    component,
    props: {
      x,
      y,
      fill,
      opacity: 1,
      radius: 3,
      stroke: 'white',
      strokeWidth: 1,
    },
  }
}

const ptToId = ({ x, y }) => {
  return `${x}${y}`
}

export const convertPtsToShapes = pts => {
  return pts.map(pt =>
    convertPtToShape({
      id: ptToId({ x: pt.x, y: pt.y }),
      x: pt.x,
      y: pt.y,
      component: 'Circle',
    }),
  )
}
