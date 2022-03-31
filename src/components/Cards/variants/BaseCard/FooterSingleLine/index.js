import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import clsx from 'clsx'

// src
import { useFlexStyles } from 'common/styles/commonStyles'
import OverflowTip from 'components/OverflowTip'

import useStyles from './styles'

function FooterSingleLine({
  children,
  darkMode,
  name,
  noBorder,
  time,
  info,
  height,
  inlineStyle,
}) {
  const classes = useStyles({
    darkMode,
    noBorder,
    height,
  })

  const flexClasses = useFlexStyles()

  return (
    <div
      id='card-footer-single-container'
      className={classes.root}
      style={inlineStyle}
    >
      {!children && (
        <div
          className={clsx(
            flexClasses.row,
            flexClasses.centerBetween,
            classes.descriptionBottomRowContainer,
          )}
        >
          <Typography className='am-subtitle1'>
            <span className={classes.text}>{name}</span>
            {info && (
              <Box mt={1}>
                <OverflowTip text={info} width={150} className={classes.text} />
              </Box>
            )}
          </Typography>
          <Typography className='am-subtitle1'>
            <span className={classes.text}>{time}</span>
          </Typography>
        </div>
      )}
      {children && children}
    </div>
  )
}

FooterSingleLine.defaultProps = {
  children: null,
  darkMode: false,
  name: '',
  info: '',
  noBorder: false,
  time: '',
}

FooterSingleLine.propTypes = {
  children: PropTypes.node,
  darkMode: PropTypes.bool,
  name: PropTypes.string,
  info: PropTypes.string,
  noBorder: PropTypes.bool,
  time: PropTypes.string,
}

export default FooterSingleLine
