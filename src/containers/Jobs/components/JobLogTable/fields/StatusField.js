import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { useSelector } from 'react-redux'
// src
import { AlertLevelLabel, Icon } from 'ambient_ui'
import { NodeRequestStatusEnum, NodeRequestStatusToReadableEnum } from 'enums'

import useStyles from './styles'

export default function StatusField({ status }) {
  const { palette } = useTheme()
  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({ darkMode })

  const getLevelFromStatus = () => {
    switch (status) {
      case NodeRequestStatusEnum.INPROGRESS:
        return 'medium'
      case NodeRequestStatusEnum.INCOMPLETE:
        return 'medium'
      case NodeRequestStatusEnum.COMPLETED:
        return 'low'
      case NodeRequestStatusEnum.FAILED:
        return 'high'
      default:
        return 'low'
    }
  }

  const getIconFromStatus = () => {
    const size = 12
    switch (status) {
      case NodeRequestStatusEnum.INPROGRESS:
        return (
          <Icon
            icon='activity'
            color={darkMode ? palette.grey[300] : palette.grey[700]}
            size={size}
          />
        )
      case NodeRequestStatusEnum.INCOMPLETE:
        return (
          <Icon
            icon='activity'
            color={darkMode ? palette.grey[300] : palette.grey[700]}
            size={size}
          />
        )
      case NodeRequestStatusEnum.COMPLETED:
        return (
          <Icon
            icon='checkCircle'
            color={darkMode ? palette.primary[100] : palette.primary.main}
            size={size}
          />
        )
      case NodeRequestStatusEnum.FAILED:
        return (
          <Icon
            icon='alertCircle'
            color={darkMode ? palette.error.light : palette.error.main}
            size={size}
          />
        )
      default:
        return (
          <Icon
            icon='activity'
            color={darkMode ? palette.grey[300] : palette.grey[700]}
            size={size}
          />
        )
    }
  }

  return (
    <div className={clsx('am-subtitle2', classes.baseText)}>
      <AlertLevelLabel
        level={getLevelFromStatus()}
        darkMode={darkMode}
        classOverride={classes.alertLevelLabelContainer}
      >
        <div className={classes.rowCenter}>
          <span>{NodeRequestStatusToReadableEnum[status]}</span>
          <span className={classes.iconContainer}>{getIconFromStatus()}</span>
        </div>
      </AlertLevelLabel>
    </div>
  )
}

StatusField.defaultProps = {
  status: NodeRequestStatusEnum.INCOMPLETE,
}

StatusField.propTypes = {
  status: PropTypes.oneOf(Object.values(NodeRequestStatusEnum)),
}
