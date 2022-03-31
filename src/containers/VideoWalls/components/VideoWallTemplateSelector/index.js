import React, { useEffect, useMemo, useRef } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Grid from '@material-ui/core/Grid'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import map from 'lodash/map'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import { useSelector, useDispatch } from 'react-redux'
import clsx from 'clsx'
import Typography from '@material-ui/core/Typography'
import { Button } from 'ambient_ui'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'

import {
  clearStreamList,
  setTemplate,
  toggleWallPrivacy,
  videoWallTemplatesFetchRequested,
} from 'redux/slices/videoWall'
import { videoWallEditRequested } from 'components/VideoWallToolbar/videoWallToolbarSlice'
import VideoWallTemplateList from 'components/VideoWallTemplateList'
import getTemplateIcon from 'common/data/videoWallTemplateIcons/templates'

import useStyles from './styles'

const SCROLL_OFFSET = 40

function VideoWallTemplateSelector() {
  const history = useHistory()
  const { account } = useParams()
  const dispatch = useDispatch()

  const videoWallTemplates = useSelector(
    state => state.videoWall.videoWallTemplates,
  )
  const activeVideoWall = useSelector(state => state.videoWall.activeVideoWall)
  const darkMode = useSelector(state => state.settings.darkMode)
  const editLoading = useSelector(state => state.videoWallToolbar.editLoading)
  const templateContainerRef = useRef(null)

  const classes = useStyles({ darkMode })

  const templateSelectorScrollable = useMediaQuery('(max-width:1760px)')

  useEffect(() => {
    dispatch(videoWallTemplatesFetchRequested())
  }, [dispatch])

  const templates = useMemo(() => {
    return !isEmpty(videoWallTemplates)
      ? map(videoWallTemplates, templateItem => {
          return { ...templateItem, icon: getTemplateIcon(templateItem.name) }
        })
      : []
  }, [videoWallTemplates])

  const onEdit = () => {
    dispatch(
      videoWallEditRequested({
        variables: {
          streamFeeds: activeVideoWall.streamFeeds
            ? activeVideoWall.streamFeeds.map(streamFeed => {
                return {
                  id: streamFeed.id,
                  orderIndex: streamFeed.orderIndex,
                  streamId: streamFeed.streamId,
                }
              })
            : [],
          public: activeVideoWall.public,
          videoWallId: activeVideoWall.id,
          templateId: get(activeVideoWall, 'template.id', null),
        },
        onRequestDone: ({ videoWall }) =>
          history.push(`/accounts/${account}/video-walls/${videoWall.id}`),
      }),
    )
  }

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
          Select the layout for
        </Typography>
        <Typography>{activeVideoWall.name}</Typography>
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
              style={{
                left: 'auto',
                right: 0,
              }}
              onClick={() => onScroll(false)}
            >
              <ChevronRightIcon />
            </div>
          </>
        )}

        <div className={classes.templateContainer} ref={templateContainerRef}>
          <VideoWallTemplateList
            templates={templates}
            onSelect={(_, template) => dispatch(setTemplate({ template }))}
            selectedTemplate={activeVideoWall.template}
          />
        </div>
      </div>

      <div className={classes.actionsContainer}>
        <Grid container direction='column' alignItems='center'>
          <FormControlLabel
            control={
              <Checkbox
                checked={!activeVideoWall.public}
                disabled={editLoading}
                onChange={() => dispatch(toggleWallPrivacy())}
                color='primary'
              />
            }
            label='Private'
            classes={{
              label: classes.checkboxLabel,
            }}
          />

          <Button
            variant='outlined'
            onClick={() => dispatch(clearStreamList())}
            customStyle={{ marginRight: 5 }}
          >
            Clear Streams
          </Button>
        </Grid>
        <Button onClick={onEdit}>Save</Button>
      </div>
    </Grid>
  )
}

export default VideoWallTemplateSelector
