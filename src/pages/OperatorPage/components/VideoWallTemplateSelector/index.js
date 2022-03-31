import React, { useEffect, useMemo, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Grid from '@material-ui/core/Grid'
import map from 'lodash/map'
import get from 'lodash/get'
import { useSelector, useDispatch } from 'react-redux'
import clsx from 'clsx'
import Typography from '@material-ui/core/Typography'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'

import { videoWallTemplatesFetchRequested } from 'redux/slices/videoWall'
import getTemplateIcon from 'common/data/videoWallTemplateIcons/templates'
import VideoWallTemplateList from 'components/VideoWallTemplateList'

import useStyles from './styles'

const propTypes = {
  activeVideoWall: PropTypes.object,
  onTemplateSelect: PropTypes.func,
}

const defaultProps = {
  onTemplateSelect: () => {},
}

const VideoWallTemplateSelector = ({ activeVideoWall, onTemplateSelect }) => {
  const SCROLL_OFFSET = 40
  const dispatch = useDispatch()
  const darkMode = useSelector(state => state.settings.darkMode)
  const videoWallTemplates = useSelector(
    state => state.videoWall.videoWallTemplates,
  )
  const templateContainerRef = useRef(null)

  const classes = useStyles({ darkMode })
  const [templates, setTemplates] = useState([])

  const templateSelectorScrollable = useMediaQuery('(max-width:1650px)')

  useEffect(() => {
    dispatch(videoWallTemplatesFetchRequested())
  }, [dispatch])

  // useMemo to only calculate values once
  useMemo(() => {
    if (!videoWallTemplates) return
    setTemplates(
      map(videoWallTemplates, templateItem => {
        return { ...templateItem, icon: getTemplateIcon(templateItem.name) }
      }),
    )
  }, [videoWallTemplates])

  const onScroll = isLeft => {
    if (templateContainerRef) {
      templateContainerRef.current.scrollLeft += isLeft
        ? -SCROLL_OFFSET
        : SCROLL_OFFSET
    }
  }

  return (
    <Grid
      container
      direction='row'
      justify='flex-start'
      alignItems='center'
      className={classes.wrapper}
    >
      <div className={classes.hintBlock}>
        <Typography className={clsx('am-subtitle1', classes.hint)}>
          Select Wall Layout
        </Typography>
      </div>

      <div className={classes.templateContainerScrollWrapper}>
        {templateSelectorScrollable && (
          <>
            <div
              className={classes.templateContainerScrollIndicator}
              onClick={() => onScroll(true)}
            >
              <ChevronLeftIcon />
            </div>

            <div
              className={classes.templateContainerScrollIndicator}
              style={{ left: 'auto', right: 0 }}
              onClick={() => onScroll(false)}
            >
              <ChevronRightIcon />
            </div>
          </>
        )}

        <div className={classes.templateContainer} ref={templateContainerRef}>
          <VideoWallTemplateList
            onSelect={(_, newTemplate) => onTemplateSelect(newTemplate)}
            templates={templates}
            selectedTemplate={get(activeVideoWall, 'template')}
          />
        </div>
      </div>
    </Grid>
  )
}

VideoWallTemplateSelector.propTypes = propTypes
VideoWallTemplateSelector.defaultProps = defaultProps

export default VideoWallTemplateSelector
