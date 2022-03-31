
const parseLatLng = (latlng) => {
  const dispatchCenterArr = latlng
      ? latlng.split(',')
      : null
    
  const lat = dispatchCenterArr ? dispatchCenterArr[0] : null
  const lng = dispatchCenterArr ? dispatchCenterArr[1] : null
  return { lat, lng }
}

export default parseLatLng
