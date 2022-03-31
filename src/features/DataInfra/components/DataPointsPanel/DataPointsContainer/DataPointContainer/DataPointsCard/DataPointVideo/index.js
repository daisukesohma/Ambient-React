import React from 'react'
import PropTypes from 'prop-types'
import Skeleton from '@material-ui/lab/Skeleton'

import useStyles from '../../../../styles'
import './index.css'

const propTypes = {
  videoArchive: PropTypes.object,
}

const defaultProps = {
  videoArchive: {},
}

function DataPointVideo({ videoArchive }) {
  const classes = useStyles()

  const clipStyle = {
    width: '100%',
    height: 'auto',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  }

  return videoArchive.link ? (
    <video className={classes.media} style={clipStyle} controls>
      <source
        src={videoArchive.link}
        type='video/mp4'
        style={{ width: '100%', height: 'auto' }}
      />
    </video>
  ) : (
    <Skeleton animation='wave' variant='rect' width='100%' height='auto' />
  )
}

DataPointVideo.propTypes = propTypes
DataPointVideo.defaultProps = defaultProps

export default DataPointVideo
