// Make it without animation?
import PropTypes from 'prop-types'

const propTypes = {
  children: PropTypes.node,
  isOpen: PropTypes.bool,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  contentHeight: PropTypes.string,
}

const defaultProps = {
  width: 500,
  contentHeight: 'auto',
}

function ExpandableSidebar({ children, isOpen, width, contentHeight }) {
  if (!isOpen) return false

  return children
}

ExpandableSidebar.propTypes = propTypes
ExpandableSidebar.defaultProps = defaultProps

export default ExpandableSidebar
