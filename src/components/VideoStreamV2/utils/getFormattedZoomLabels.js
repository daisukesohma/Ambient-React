import { BOTTOM_LABELS, VISIBLE_BOTTOM_LABELS_FOR_VALUES } from './constants'

// material-ui formatted Slider component marks
const getFormattedZoomLabels = () => {
  return VISIBLE_BOTTOM_LABELS_FOR_VALUES.map(v => ({
    value: v,
    label: BOTTOM_LABELS[v],
  }))
}

export default getFormattedZoomLabels
