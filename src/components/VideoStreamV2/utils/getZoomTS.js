import { ZOOM_LEVELS } from './constants'

const getZoomTS = (ts, zoomLevel = 5) => ts * ZOOM_LEVELS[zoomLevel]
export default getZoomTS
