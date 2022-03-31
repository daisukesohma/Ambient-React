import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import extend from 'lodash/extend'
import cloneDeep from 'lodash/cloneDeep'

// NOTE: This is WIP. Currently p and q top left and top right points are bottom right and bottom left coordinates
// since MP coordinate space is higher Y is lower in the screen
//
// input {x: 20, y: 30}
// output [20, 30]
export const transformPtToGqlArray = pt => ({
  x: get(pt, 'x'),
  y: get(pt, 'y'),
})
export const transformPtToLine = pt => [get(pt, 'x'), get(pt, 'y')]

const orderPointsClockwise = points => {
  if (isEmpty(points)) return []
  const orderedPoints = cloneDeep(points)

  orderedPoints.sort((a, b) => a.y - b.y)

  // Get center y
  const cy =
    (orderedPoints[0].y + orderedPoints[orderedPoints.length - 1].y) / 2

  // Sort from right to left
  orderedPoints.sort((a, b) => b.x - a.x)

  // Get center x
  const cx =
    (orderedPoints[0].x + orderedPoints[orderedPoints.length - 1].x) / 2

  // Center point
  const center = { x: cx, y: cy }

  // Pre calculate the angles as it will be slow in the sort
  // As the points are sorted from right to left the first point
  // is the rightmost

  // Starting angle used to reference other angles
  let startAng
  orderedPoints.forEach(point => {
    let ang = Math.atan2(point.y - center.y, point.x - center.x)
    if (!startAng) {
      startAng = ang
    } else if (ang < startAng) {
      // ensure that all points are clockwise of the start point
      ang += Math.PI * 2
    }
    extend(point, { angle: ang }) // add the angle to the point
  })

  // Sort clockwise;
  return orderedPoints.sort((a, b) => a.angle - b.angle)
}

const slopeOfPts = (pt1, pt2) => {
  return Math.abs((pt1.y - pt2.y) / (pt1.x - pt2.x))
}

// Orders 4 point annotation for gql
// Takes arbitrary arrangement of four (x,y) points [{x: 12, y: 12}, {x: 0, y: 12}, ...]
// and orders them TopLeft, TopRight, BottomRight, BottomLeft
//
export const orderPointsFromTopLeftClockwise = randomPts => {
  if (randomPts.length !== 4) return []

  // implementing this algorithm
  // https://math.stackexchange.com/questions/3675750/how-to-find-the-top-left-corner-of-an-arbitrary-convex-quadrilateral

  // max Y value object
  // https://stackoverflow.com/a/34087850/625044
  //
  // 1. Determine the point with the greatest y-value. Call it P. This is one of your upper corners.
  const p = randomPts.reduce((prev, current) => {
    return prev.y > current.y ? prev : current
  })

  // 2. Draw lines from P to both its neigbors. Take the endpoint of the line that has the shallower angle (closer to horizontal), and call it Q.
  const clockwiseOrdered = orderPointsClockwise(randomPts)
  const pIndex = clockwiseOrdered.findIndex(pt => pt.x === p.x && pt.y === p.y)
  const ccwPtToPIndex = pIndex === 0 ? 3 : pIndex - 1 // get point ccw to p
  const cwPtToPIndex = pIndex === 3 ? 0 : pIndex + 1 // get point cw to p
  const lastIndexToP = cwPtToPIndex + 1 > 3 ? 0 : cwPtToPIndex + 1

  const slopeOfCcwPt = slopeOfPts(
    clockwiseOrdered[pIndex],
    clockwiseOrdered[ccwPtToPIndex],
  )
  const slopeOfCwPt = slopeOfPts(
    clockwiseOrdered[pIndex],
    clockwiseOrdered[cwPtToPIndex],
  )
  const q =
    Math.min(slopeOfCcwPt, slopeOfCwPt) === slopeOfCcwPt
      ? clockwiseOrdered[ccwPtToPIndex]
      : clockwiseOrdered[cwPtToPIndex]
  const qIndex = clockwiseOrdered.findIndex(pt => pt.x === q.x && pt.y === q.y)
  const ccwPtToQIndex = qIndex === 0 ? 3 : qIndex - 1 // get point ccw to p
  const cwPtToQIndex = qIndex === 3 ? 0 : qIndex + 1 // get point cw to p
  const lastIndexToQ = cwPtToQIndex + 1 > 3 ? 0 : cwPtToQIndex + 1

  // 3. If P's x-value is less than Q's x-value, then P is your top left vertex and Q is top-right. If P's x is greater than Q's, exactly the opposite.
  let orderedCwTopLeftFirst = []
  if (p.x < q.x) {
    orderedCwTopLeftFirst = [clockwiseOrdered[pIndex], clockwiseOrdered[qIndex]]
  } else {
    orderedCwTopLeftFirst = [clockwiseOrdered[qIndex], clockwiseOrdered[pIndex]]
  }

  return orderedCwTopLeftFirst
}
