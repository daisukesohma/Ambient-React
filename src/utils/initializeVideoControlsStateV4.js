export const presetVideoControlsState = ({
  initTs,
  tsTimelineHighlight,
}) => {

  return {
    tsTimelineHighlight,
  }
}

const initializeVideoControlsState = (
  initTs,
  initZoomIn,
  tsTimelineHighlight,
) => ({
  initTs,
  metadata: [],
  catalogueLoading: true,
  activeVideoTSInterval: true,
  availableDays: [],
  catalogue: [],
  entitySelections: [],
  retention: {},
  originalEntities: [],
  videoStreamKey: null,
  isZoomIn: 1,
  showDispatchMenu: false,
  creatingDispatchRequest: false,
  isDatePickerVisible: false,
  selectedEntities: [],
  hoverIndicatorX: 0,
  currentCataloguePlaying: 0,
  clipLeftPosition: 0,
  clipRightPosition: 0,
  clipWidth: 0,
  initClipControlsPosition: 0,
  isFollowing: false,
  message: '',
  displayMessage: false,
  dragging: false,
  exportMode: false,
  ready: false,
  ...presetVideoControlsState({
    initTs,
    initZoomIn,
    tsTimelineHighlight,
  }),
})

export default initializeVideoControlsState
