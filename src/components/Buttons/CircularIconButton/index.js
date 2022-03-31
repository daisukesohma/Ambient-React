import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import Tooltip from 'components/Tooltip'
import TooltipText from 'components/Tooltip/TooltipText'
import clsx from 'clsx'
import IconButton from '@material-ui/core/IconButton'
import { Icon } from 'ambient_ui'

import useStyles from './styles'

const defaultProps = {
  borderVisible: false,
  borderWidth: 2,
  handleClick: () => {},
  iconButtonProps: {
    size: 'small',
    color: 'primary',
  },
  iconName: null,
  iconNode: null,
  iconProps: {},
  iconButtonStyle: {},
  tooltipContent: 'tooltip',
  tooltipDisabled: false,
  tooltipProps: {},
}

const propTypes = {
  borderVisible: PropTypes.bool,
  borderWidth: PropTypes.number,
  handleClick: PropTypes.func,
  iconButtonProps: PropTypes.object,
  iconButtonSize: PropTypes.string,
  iconButtonStyle: PropTypes.object,
  iconName: PropTypes.string,
  iconNode: PropTypes.node,
  iconProps: PropTypes.object,
  tooltipContent: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  tooltipDisabled: PropTypes.bool,
  tooltipProps: PropTypes.object,
}

function CircularIconButton({
  borderVisible,
  borderWidth,
  handleClick,
  iconButtonProps,
  iconButtonStyle,
  iconName,
  iconNode,
  iconProps,
  tooltipContent,
  tooltipDisabled,
  tooltipProps,
}) {
  const { palette } = useTheme()
  const classes = useStyles({ borderVisible, borderWidth })
  let content = tooltipContent // by default allow nodes in content
  if (typeof tooltipContent === 'string') {
    content = <TooltipText>{tooltipContent}</TooltipText>
  }

  let finalIcon
  if (iconNode) {
    finalIcon = iconNode
  } else if (iconName) {
    finalIcon = (
      <Icon
        icon={iconName}
        color={palette.primary[500]}
        size={24}
        {...iconProps}
      />
    )
  } else {
    finalIcon = null
  }

  return (
    <Tooltip content={content} disabled={tooltipDisabled} {...tooltipProps}>
      <span onClick={handleClick}>
        <IconButton
          classes={{ root: clsx(classes.root, classes.borderRoot) }}
          {...iconButtonProps}
          style={iconButtonStyle}
        >
          {finalIcon}
        </IconButton>
      </span>
    </Tooltip>
  )
}

CircularIconButton.propTypes = propTypes
CircularIconButton.defaultProps = defaultProps
export default CircularIconButton
