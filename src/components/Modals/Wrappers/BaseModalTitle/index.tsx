/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react'
import Box from '@material-ui/core/Box'
import { useTheme } from '@material-ui/core/styles'
// src
import { Icon } from 'ambient_ui'
import Tooltip from 'components/Tooltip'
import TooltipText from 'components/Tooltip/TooltipText'
import { hexRgba } from 'utils'

interface Props {
  handleClose: () => void
  title: string
}

function BaseModalTitle({ handleClose, title }: Props): JSX.Element {
  const { palette } = useTheme()

  return (
    <Box
      display='flex'
      flexDirection='row'
      alignItems='center'
      justifyContent='space-between'
      pl={2}
      pr={2}
      pt={1}
      pb={2}
      borderBottom={`1px solid ${hexRgba(palette.grey[800], 0.5)}`}
    >
      <div className='am-h5'>{title}</div>
      <div onClick={handleClose} style={{ cursor: 'pointer' }}>
        <Tooltip content={<TooltipText text='Close' />} placement='left'>
          <Icon icon='close' />
        </Tooltip>
      </div>
    </Box>
  )
}

export default BaseModalTitle
