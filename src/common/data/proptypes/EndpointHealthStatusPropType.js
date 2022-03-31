import PropTypes from 'prop-types'

export const EndpointHealthStatusPropType = PropTypes.shape({
  status: PropTypes.string.isRequired,
  ping: PropTypes.shape({
    ts: PropTypes.number,
    value: PropTypes.number,
  }),
})

export const EndpointHealthStatusPropTypeDefault = {
  1: {
    status: 'Unreachable',
    ping: {
      ts: 1.2,
      value: 0.33,
    },
  },
}
