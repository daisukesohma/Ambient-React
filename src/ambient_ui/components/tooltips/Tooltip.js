import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import MuiTooltip from '@material-ui/core/Tooltip'

const useStyles = makeStyles(({ palette }) => ({
  tooltip: {
    color: props => props.color || palette.grey[700],
    border: props => props.border || `1px solid ${palette.grey[300]}`,
    boxShadow: props =>
      props.boxShadow || '0px 1px 50px rgba(215, 215, 215, 0.67)',
    borderRadius: props => props.borderRadius || 12,
    backgroundColor: props => props.backgroundColor || palette.grey[50],
    fontSize: props => props.fontSize || '0.8rem',
  },
}))

function Tooltip({ title, placement, customStyle, children }) {
  const classes = useStyles(customStyle)

  return (
    <MuiTooltip title={title} placement={placement} classes={classes}>
      {children}
    </MuiTooltip>
  )
}

Tooltip.defaultProps = {
  title: 'default',
  placement: 'bottom',
  customStyle: {},
}

Tooltip.propTypes = {
  title: PropTypes.string,
  placement: PropTypes.string,
  customStyle: PropTypes.object,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
}

export default Tooltip
