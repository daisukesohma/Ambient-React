import React from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'

import useStyles from './styles'

function Footer({ darkMode, description, isMini, name, time }) {
  const { palette } = useTheme()
  const classes = useStyles({ darkMode, isMini })

  return (
    <Grid
      id='card-footer-container'
      container
      justify='space-evenly'
      direction='column'
      className={classes.root}
    >
      <Grid container justify='space-between'>
        <Typography className={isMini ? 'am-subtitle1' : 'am-body'}>
          {name}
        </Typography>
      </Grid>
      <Grid
        container
        justify='space-between'
        className={classes.descriptionBottomRowContainer}
      >
        <Typography className={isMini ? 'am-caption' : 'am-subtitle1'}>
          <span style={{ color: palette.grey[700] }}>{description}</span>
        </Typography>
        <Typography className={isMini ? 'am-caption' : 'am-subtitle1'}>
          <span style={{ color: palette.grey[700] }}>{time}</span>
        </Typography>
      </Grid>
    </Grid>
  )
}

Footer.defaultProps = {
  darkMode: false,
  description: '',
  isMini: false,
  name: '',
  time: '',
}

Footer.propTypes = {
  darkMode: PropTypes.bool,
  description: PropTypes.string,
  isMini: PropTypes.bool,
  name: PropTypes.string,
  time: PropTypes.string,
}

export default Footer
