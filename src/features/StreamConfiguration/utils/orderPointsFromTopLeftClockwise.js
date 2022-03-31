import get from 'lodash/get'

// input {x: 20, y: 30}
// output [20, 30]
export const transformPtToGqlArray = pt => ({
  x: get(pt, 'x'),
  y: get(pt, 'y'),
})
export const transformPtToLine = pt => [get(pt, 'x'), get(pt, 'y')]

// NOTE: This function is a bit broken with very skewed door points
//
// Orders 4 point annotation for gql
// Takes arbitrary arrangement of four (x,y) points [{x: 12, y: 12}, {x: 0, y: 12}, ...]
// and orders them TopLeft, TopRight, BottomRight, BottomLeft
//
export const orderPointsFromTopLeftClockwise = randomPts => {
  if (randomPts.length !== 4) return []

  const topTwoPoints = randomPts
    .slice()
    .sort((a, b) => get(a, 'y') - get(b, 'y'))
    .slice(0, 2)

  const leftTwoPoints = randomPts
    .slice()
    .sort((a, b) => get(a, 'x') - get(b, 'x'))
    .slice(0, 2)

  const bottomTwoPoints = randomPts
    .slice()
    .sort((a, b) => get(b, 'y') - get(a, 'y'))
    .slice(0, 2)

  // top left will be the point that is in both top and left arrays
  const topLeft = topTwoPoints.find(topPt =>
    leftTwoPoints.find(
      leftPt =>
        get(leftPt, 'x') === get(topPt, 'x') &&
        get(leftPt, 'y') === get(topPt, 'y'),
    ),
  )

  // top right is the one in the top array that isn't topLeft
  const topRight = topTwoPoints.find(
    topPt =>
      get(topPt, 'x') !== get(topLeft, 'x') ||
      get(topPt, 'y') !== get(topLeft, 'y'),
  )

  // same for bottom left
  const bottomLeft = leftTwoPoints.find(
    leftPt =>
      get(leftPt, 'x') !== get(topLeft, 'x') ||
      get(leftPt, 'y') !== get(topLeft, 'y'),
  )
  const bottomRight = bottomTwoPoints.find(
    bottomPt => bottomPt.x !== bottomLeft.x || bottomPt.y !== bottomLeft.y,
  )

  return [topLeft, topRight, bottomRight, bottomLeft]
}
