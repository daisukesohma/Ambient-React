import { ZOOM_LEVELS } from './constants'

const getInverseZoomTS = (ts, zoomLevel = 5) => ts / ZOOM_LEVELS[zoomLevel]
export default getInverseZoomTS
