import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import IconButton from '@material-ui/core/IconButton'
// src
import { Icon } from 'ambient_ui'
import Tooltip from 'components/Tooltip'
import TooltipText from 'components/Tooltip/TooltipText'
import { useCursorStyles } from 'common/styles/commonStyles'

import useStyles from './styles'

const propTypes = {
  handleClose: PropTypes.func,
  userActive: PropTypes.bool,
}

const CloseButton = ({ handleClose, userActive }) => {
  const { palette } = useTheme()
  const classes = useStyles()
  const cursorClasses = useCursorStyles()

  return (
    <div
      onClick={handleClose}
      className={clsx(
        classes.closeRoot,
        { [classes.userActive]: userActive },
        cursorClasses.pointer,
      )}
    >
      <Tooltip
        content={<TooltipText>Close</TooltipText>}
        placement='bottom'
        offset={[0, 24]}
      >
        <span>
          <IconButton
            color='primary'
            size='small'
            classes={{ root: classes.iconButtonRoot }}
          >
            <Icon icon='close' color={palette.grey[300]} size={40} />
          </IconButton>
        </span>
      </Tooltip>
    </div>
  )
}

CloseButton.propTypes = propTypes

export default CloseButton
