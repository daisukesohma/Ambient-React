import React from 'react'
import PropTypes from 'prop-types'
import { isMobileOnly } from 'react-device-detect'
import { useSpring, animated, config } from 'react-spring'
import Grid from '@material-ui/core/Grid'
import clsx from 'clsx'

import LogoAnimated from '../LogoAnimated'

import useStyles from './styles'

function LoginAnimatedCard({ children }) {
  const classes = useStyles({ isMobileOnly })
  const { y, opacity } = useSpring({
    from: {
      opacity: 0,
      y: 0,
    },
    to: {
      opacity: 1,
      y: isMobileOnly ? 0 : 150,
    },
    config: config.slow,
  })

  return (
    <animated.div className={classes.base} style={{ marginTop: y, opacity }}>
      <Grid container className={classes.root}>
        <Grid container>
          <Grid
            item
            className={clsx(
              classes.children,
              classes.column,
              classes.logoContainer,
            )}
          >
            <LogoAnimated />
          </Grid>
          {children}
        </Grid>
      </Grid>
    </animated.div>
  )
}

LoginAnimatedCard.propTypes = {
  children: PropTypes.node,
}
export default LoginAnimatedCard
