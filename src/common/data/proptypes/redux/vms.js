import PropTypes from 'prop-types'

export const VmsPropType = PropTypes.shape({
  darkMode: PropTypes.bool,
  isAlertsVisible: PropTypes.bool,
  is24HourTime: PropTypes.bool,
  isFullscreenMode: PropTypes.bool,
  timeline: PropTypes.shape({
    settings: PropTypes.shape({
      position: PropTypes.oneOf(['overlay', 'below']),
      isAlwaysVisible: PropTypes.bool,
      isTimeMarkersAlwaysVisible: PropTypes.bool,
    }),
    shared: PropTypes.object,
    custom: PropTypes.object,
  }),
})

export const VmsPropTypeDefault = {
  darkMode: false,
  isAlertsVisible: false,
  is24HourTime: false,
  isFullscreenMode: false,
  timeline: {
    settings: {
      position: 'below',
      isAlwaysVisible: false,
      isTimeMarkersAlwaysVisible: false,
    },
    shared: {},
    custom: {},
  },
}
