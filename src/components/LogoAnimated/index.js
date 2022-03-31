import React from 'react'
import PropTypes from 'prop-types'
import { useSpring, animated, config } from 'react-spring'
import clsx from 'clsx'

import Logo from 'assets/logo_icon.png'

import useStyles from './styles'

const propTypes = {
  label: PropTypes.string,
  containerStyles: PropTypes.object,
  logoWidth: PropTypes.number,
  logoEndOpacity: PropTypes.number,
  logoTextColor: PropTypes.string,
  logoTextSize: PropTypes.number,
}

const defaultProps = {
  label: 'Ambient.ai',
  containerStyles: {},
  logoWidth: 88,
  logoEndOpacity: 1,
  logoTextSize: 30,
}

function LogoAnimated({
  label,
  containerStyles,
  logoWidth,
  logoEndOpacity,
  logoTextColor,
  logoTextSize,
}) {
  const classes = useStyles({ logoWidth, logoTextSize, logoTextColor })

  const { y, opacity } = useSpring({
    from: {
      opacity: 0,
      y: 125,
    },
    to: {
      opacity: logoEndOpacity,
      y: 0,
    },
    config: config.molasses,
    delay: 125,
  })

  // the margin top animation creates a visual of logo coming down and name moving up
  // if you want to separate these animations, will need to use translate y
  return (
    <div className={classes.container} style={containerStyles}>
      <animated.div style={{ opacity }}>
        <img src={Logo} alt='Ambient' className={classes.logo} />
      </animated.div>
      <animated.div style={{ marginTop: y, opacity }}>
        <div className={clsx('am-h4', classes.logoText)}>{label}</div>
      </animated.div>
    </div>
  )
}

LogoAnimated.propTypes = propTypes
LogoAnimated.defaultProps = defaultProps

export default LogoAnimated
