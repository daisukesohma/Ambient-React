import React from 'react'
import PropTypes from 'prop-types'
import { Typography } from '@material-ui/core'

const propTypes = {
  title: PropTypes.string,
}

function Title({ title }) {
  return <Typography className={'am-h5'}>{title}</Typography>
}

Title.propTypes = propTypes

export default Title
