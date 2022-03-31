import React from 'react'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import clsx from 'clsx'
import { useTheme } from '@material-ui/core/styles'

import useStyles from './styles'
import OverflowTip from 'components/OverflowTip'

function HeaderDoubleLine({
  darkMode,
  description,
  title,
  titleDecorator,
  topRight,
  bottomRight,
  inlineStyle,
}) {
  const { palette } = useTheme()
  const classes = useStyles({ darkMode })

  return (
    <div
      id='card-header-double-container'
      className={classes.root}
      style={inlineStyle}
    >
      <Grid container>
        <Grid container item xs={11} justify='flex-start'>
          <Box pl={2}>
            <div>{titleDecorator}</div>
            <div
              id='card-header-title'
              className={clsx('am-body', classes.title)}
            >
              <OverflowTip text={title} />
            </div>
          </Box>
        </Grid>
        <Grid container pl={1} item xs={1} justify='flex-end'>
          {topRight}
        </Grid>
      </Grid>
      <Grid container justify='space-between'>
        <Box pl={2}>
          <div id='card-header-subtitle' className='am-subtitle2'>
            <span style={{ color: palette.grey[700] }}>{description}</span>
          </div>
          <div>{bottomRight}</div>
        </Box>
      </Grid>
    </div>
  )
}

HeaderDoubleLine.defaultProps = {
  isMini: false,
  name: '',
  time: '',
  bottomRight: null,
  topRight: null,
  titleDecorator: null,
  title: null,
  description: null,
  darkMode: null,
}

HeaderDoubleLine.propTypes = {
  isMini: PropTypes.bool,
  name: PropTypes.string,
  time: PropTypes.string,
  bottomRight: PropTypes.node,
  topRight: PropTypes.node,
  titleDecorator: PropTypes.node,
  title: PropTypes.string,
  description: PropTypes.node,
  darkMode: PropTypes.bool,
}

export default HeaderDoubleLine
