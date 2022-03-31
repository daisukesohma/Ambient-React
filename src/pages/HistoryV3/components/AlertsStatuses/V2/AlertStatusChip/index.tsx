/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react'
import { Box, Chip } from '@material-ui/core'
import { useTheme } from '@material-ui/core/styles'
import { Done as DoneIcon } from '@material-ui/icons'
import { Icon } from 'ambient_ui'

// src
import useStyles from './styles'

interface Props {
  isResolved?: boolean
  isRequested?: boolean
  isAccepted?: boolean
  labelContent?: string
}

const defaultProps = {
  isResolved: false,
  isRequested: false,
  isAccepted: false,
  labelContent: '',
}

function AlertStatusChip({
  isResolved,
  isRequested,
  isAccepted,
  labelContent,
}: Props): JSX.Element | null {
  const { palette } = useTheme()

  let color = palette.text.primary
  let label
  let avatar

  if (isResolved) {
    color = palette.common.emerald
    label = `Resolved ${labelContent}`
    avatar = <DoneIcon htmlColor={palette.common.emerald} fontSize='small' />
  } else if (isRequested) {
    color = palette.common.lime
    label = `Requested ${labelContent}`
    // @ts-ignore
    avatar = <Icon icon='dispatch' size={24} color={palette.common.lime} />
  } else if (isAccepted) {
    color = palette.common.lime
    label = `Accepted ${labelContent}`
    // @ts-ignore
    avatar = <Icon icon='dispatch' size={24} color={palette.common.lime} />
  }

  const classes = useStyles({ color })

  if (!isResolved && !isRequested && !isAccepted) return null

  return (
    <Chip
      variant='outlined'
      classes={{ root: classes.root, label: classes.label }}
      label={(
        <Box
          display='flex'
          flexDirection='row'
          alignItems='center'
          className='am-subtitle2'
        >
          {label}
        </Box>
      )}
      avatar={avatar}
    />
  )
}

AlertStatusChip.defaultProps = defaultProps

export default  AlertStatusChip
