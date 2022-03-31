import React from 'react'
import PropTypes from 'prop-types'
import { Button, Icons } from 'ambient_ui'
import { useTheme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import clsx from 'clsx'

import useStyles from './styles'

const { Check, Close } = Icons

const propTypes = {
  actionOne: PropTypes.func,
  actionOneTitle: PropTypes.string,
  actionTwo: PropTypes.func,
  actionTwoTitle: PropTypes.string,
  type: PropTypes.oneOf(['button', 'panel']),
  layout: PropTypes.oneOf(['horizontal', 'vertical']),
}

const defaultProps = {
  actionOne: () => {},
  actionOneTitle: 'Confirm',
  actionTwo: () => {},
  actionTwoTitle: 'Deny',
  type: 'button',
  layout: 'vertical',
}

const ActionOverlay = ({
  actionOne,
  actionOneTitle,
  actionTwo,
  actionTwoTitle,
  type,
  layout,
}) => {
  const { palette } = useTheme()
  const isHorizontalLayout = layout === 'horizontal'
  const isButtonType = type === 'button'
  const classes = useStyles({ isButtonType, isHorizontalLayout })
  let one
  let two

  if (type === 'button') {
    one = (
      <div className={classes.oneContainer}>
        <Button variant='contained' onClick={actionOne}>
          {actionOneTitle}
        </Button>
      </div>
    )

    two = (
      <Button
        variant='outlined'
        customStyle={{
          color: palette.common.white,
          backgroundColor: 'rgba(255,255,255,.2)',
          borderColor: palette.common.white,
        }}
        onClick={actionTwo}
      >
        {actionTwoTitle}
      </Button>
    )
  } else {
    const size = 40
    const color = palette.common.white

    one = (
      <div
        className={clsx(classes.panelContainer, classes.panelOneContainer)}
        onClick={actionOne}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Check stroke={color} width={size} height={size} />
          <Typography className='am-h5'>Verify</Typography>
        </div>
      </div>
    )

    two = (
      <div
        className={clsx(classes.panelContainer, classes.panelTwoContainer)}
        onClick={actionTwo}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Close stroke={color} width={size} height={size} />
          <Typography className='am-h5'>Dismiss</Typography>
        </div>
      </div>
    )
  }

  return (
    <div className={classes.layoutContainer}>
      {one}
      {two}
    </div>
  )
}

ActionOverlay.propTypes = propTypes
ActionOverlay.defaultProps = defaultProps

export default ActionOverlay
