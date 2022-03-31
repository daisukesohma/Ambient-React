import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import logo from 'assets/logo_icon.png'
import { useFlexStyles } from 'common/styles/commonStyles'

import useStyles from './styles'

const defaultProps = {
  text: 'Image Not Found',
}

const propTypes = {
  text: PropTypes.string,
}

function DefaultImage({ text }) {
  const classes = useStyles()
  const flexClasses = useFlexStyles()

  return (
    <div
      className={clsx(flexClasses.column, flexClasses.centerAll, classes.root)}
    >
      <img src={logo} className={classes.img} alt='not found' />
      <div className={clsx('am-caption', classes.text)}>{text}</div>
    </div>
  )
}

DefaultImage.propTypes = propTypes
DefaultImage.defaultProps = defaultProps

export default DefaultImage
