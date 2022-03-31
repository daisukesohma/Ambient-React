import PropTypes from 'prop-types'

export default {
  xAxis: PropTypes.shape({
    name: PropTypes.string,
    fmt: PropTypes.string,
    values: PropTypes.arrayOf(PropTypes.string),
  }),
  yAxes: PropTypes.arrayOf(
    PropTypes.shape({
      fmt: PropTypes.string,
      values: PropTypes.arrayOf(PropTypes.string),
      compare: PropTypes.arrayOf(PropTypes.string),
      offset: PropTypes.number,
    }),
  ),
  breakdown: PropTypes.number,
  threshold: PropTypes.number,
}
