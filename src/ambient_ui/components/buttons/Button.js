/*
 * author: rodaan@ambient.ai
 * The primary file of the ContainedButton
 */
import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import { Box } from '@material-ui/core'
import CircularProgress from '@material-ui/core/CircularProgress'

import '../design_system/Theme.css'

const useStyles = makeStyles(theme => ({
  amRoot: ({ height }) => ({
    height,
    borderRadius: 20,
    boxShadow: 'none',
    fontFamily: theme.typography.button.fontFamily,
  }),
  innerBox: {
    width: '100%',
  },
}))

function AmbientButton({
  onClick,
  children,
  variant,
  disabled,
  color,
  customStyle,
  height,
  loading,
  ...rest
}) {
  const classes = useStyles({ height })

  return (
    <Box display='flex' flexDirection='row' alignItems='center'>
      <Box className={classes.innerBox}>
        <Button
          color={color}
          variant={variant}
          onClick={onClick}
          disabled={disabled}
          classes={{ root: classes.amRoot }}
          className='button'
          style={customStyle}
          {...rest}
        >
          {children}
        </Button>
      </Box>
      {loading && (
        <Box ml={0.5}>
          <CircularProgress size={24} />
        </Box>
      )}
    </Box>
  )
}

AmbientButton.defaultProps = {
  onClick: () => {},
  color: 'primary',
  children: ['Empty Button'],
  disabled: false,
  variant: 'contained',
  customStyle: {},
  loading: false,
  height: 36,
}

AmbientButton.propTypes = {
  children: PropTypes.any,
  onClick: PropTypes.func,
  color: PropTypes.string,
  variant: PropTypes.string,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  customStyle: PropTypes.object,
  height: PropTypes.number,
}

export default AmbientButton
