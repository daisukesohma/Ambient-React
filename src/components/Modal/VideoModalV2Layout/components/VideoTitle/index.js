import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import Grid from '@material-ui/core/Grid'
// src
import { Icons } from 'ambient_ui'
import InternetSpeedIndicator from 'components/organisms/InternetSpeedIndicator'
import Tooltip from 'components/Tooltip'
import TooltipText from 'components/Tooltip/TooltipText'

import useStyles from './styles'

const { Sites } = Icons

const propTypes = {
  subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  userActive: PropTypes.bool,
}

const VideoTitle = ({ subtitle, title, userActive }) => {
  const { palette } = useTheme()
  const classes = useStyles()
  return (
    <Grid
      container
      direction='row'
      alignItems='space-between'
      className={clsx(classes.titleRoot, {
        [classes.userActive]: userActive,
      })}
    >
      <div>
        <span className={clsx('am-h5', classes.title)} id='alert-modal-title'>
          {title}
        </span>
        {subtitle && (
          <div className={clsx('am-subtitle2', classes.subTitle)}>
            <span style={{ marginRight: 4 }}>
              <Sites stroke={palette.grey[700]} height={18} width={18} />
            </span>
            {subtitle}
          </div>
        )}
      </div>
      <div className={classes.internetSpeed}>
        <Tooltip
          content={<TooltipText>Internet connectivity speed</TooltipText>}
          placement='right'
        >
          <InternetSpeedIndicator />
        </Tooltip>
      </div>
    </Grid>
  )
}

VideoTitle.propTypes = propTypes
export default VideoTitle
