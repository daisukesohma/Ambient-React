import PropTypes from 'prop-types'

export default {
  dashboardId: PropTypes.number,
  metric: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    description: PropTypes.string,
    maxTimeRange: PropTypes.number,
    site: PropTypes.shape({
      name: PropTypes.string,
    }),
    metricType: PropTypes.string,
    chartType: PropTypes.string,
    breakdowns: PropTypes.arrayOf(
      PropTypes.shape({
        breakdown: PropTypes.number,
        label: PropTypes.string,
      }),
    ),
    streams: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
      }),
    ),
    timezone: PropTypes.string,
  }),
}
