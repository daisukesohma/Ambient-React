import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import clsx from 'clsx'
import { isBrowser } from 'react-device-detect'
import { isWidthDown } from '@material-ui/core/withWidth'
// src
import { formatUnixTimeWithTZ } from 'utils/dateTime/formatTimeWithTZ'
import { ActivityTypeEnum, ModalTypeEnum } from 'enums'
import { removeHighlight } from 'components/NewsFeed/feedSlice'
import { getElapsedTime, getActivitySiteName, getActivitySite } from 'utils'
import ActivityDescription from 'components/Activity/ActivityDescription'
import ActivityIcon from 'components/Activity/ActivityIcon'
import Tooltip from 'components/Tooltip'
import TooltipText from 'components/Tooltip/TooltipText'
import Evidence from 'components/Evidence'
import { Icon } from 'ambient_ui'
import { useTheme } from '@material-ui/core/styles'
import { showModal } from 'redux/slices/modal'
import { useInterval } from 'common/hooks'
import useWidth from 'common/hooks/useWidth'

import useStyles from './styles'

const propTypes = {
  activityLog: PropTypes.object,
}

const ActivityCard = ({ activityLog }) => {
  const { palette } = useTheme()
  const dispatch = useDispatch()
  const [expanded, setExpanded] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(
    getElapsedTime(get(activityLog, 'ts', 0), true),
  )
  const timezone = get(getActivitySite(activityLog), 'timezone')
  const readableTime = formatUnixTimeWithTZ(
    get(activityLog, 'ts'),
    'HH:mm:ss zzz',
    timezone,
  )
  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({ darkMode })

  const width = useWidth()

  useInterval(() => {
    setElapsedTime(getElapsedTime(Number(get(activityLog, 'ts')), true))
  }, 1000)

  useEffect(() => {
    let timer
    if (activityLog.highlightDuration) {
      timer = setTimeout(() => {
        dispatch(removeHighlight({ activity: activityLog }))
      }, activityLog.highlightDuration)
    }
    return () => clearTimeout(timer)
  }, [activityLog, dispatch])

  const handleOpenModal = () => {
    const initTs = get(activityLog, 'ts', null)
    const siteName = getActivitySiteName(activityLog)
    const { reader } = activityLog
    const streamName = get(reader, 'stream.name')
    const streamId = get(reader, 'stream.id')
    const nodeId = get(reader, 'stream.node.identifier', '')
    const siteSlug = get(reader, 'site.slug', '')
    dispatch(
      showModal({
        content: {
          streamName,
          streamId,
          nodeId,
          siteName,
          siteSlug,
          initTs,
          timezone,
        },
        type: ModalTypeEnum.VIDEO,
      }),
    )
  }

  return (
    <Accordion
      square
      expanded={expanded}
      onChange={() => setExpanded(!expanded)}
      classes={{
        root: classes.accordionRoot,
        disabled: classes.accordionRoot,
        expanded: classes.expanded,
      }}
      disabled={!activityLog.evidenceAvailable}
    >
      <AccordionSummary
        classes={{
          root: classes.accordionSummary,
          disabled: classes.accordionSummaryDisabled,
        }}
      >
        <Grid
          container
          direction='row'
          alignItems='center'
          className={clsx({
            [classes.highlight]: activityLog.highlightDuration,
          })}
        >
          <Grid item xs={1} spacing={1} container justify='center'>
            <div className={clsx('am-body1', classes.title)}>
              <ActivityIcon
                size={isBrowser && isWidthDown('md', width) ? 16 : 20}
                activity={activityLog}
                type={get(activityLog, '__typename')}
              />
            </div>
          </Grid>
          <Grid xs={11} spacing={1}>
            <Grid container className={classes.body}>
              <Grid
                item
                container
                direction='row'
                justify='flex-start'
                alignItems='center'
                lg={11}
                md={11}
                sm={11}
                xs={11}
              >
                <ActivityDescription
                  activity={activityLog}
                  type={get(activityLog, '__typename')}
                  fontSizeClass='am-subtitle2'
                  darkMode={darkMode}
                />
              </Grid>
            </Grid>
            <Grid container className={classes.footer} spacing={2}>
              <Grid
                item
                container
                direction='row'
                justify='flex-start'
                alignItems='center'
                xs={6}
              >
                <Tooltip
                  distance={8}
                  placement='bottom-start'
                  content={
                    <TooltipText text={getActivitySiteName(activityLog)} />
                  }
                >
                  <div
                    className={clsx(
                      'am-caption',
                      classes.truncate,
                      classes.pointer,
                      classes.title,
                    )}
                  >
                    {getActivitySiteName(activityLog)}
                  </div>
                </Tooltip>
              </Grid>

              <Grid
                item
                container
                direction='row'
                justify='flex-end'
                alignItems='center'
                xs={6}
              >
                <Tooltip
                  distance={8}
                  placement='bottom-start'
                  content={<TooltipText text={readableTime} />}
                >
                  <div
                    className={clsx(
                      'am-caption',
                      classes.title,
                      classes.pointer,
                    )}
                  >
                    {elapsedTime}
                  </div>
                </Tooltip>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </AccordionSummary>
      {activityLog.__typename === ActivityTypeEnum.AccessAlarmType &&
        activityLog.evidenceAvailable && (
          <AccordionDetails classes={{ root: classes.accordionDetails }}>
            <Box>
              <Evidence data={activityLog} type={activityLog.__typename} />
              <Grid
                container
                direction='row'
                justify='space-around'
                alignItems='center'
              >
                <Button
                  type='button'
                  onClick={handleOpenModal}
                  className={classes.buttons}
                >
                  <Tooltip content='View Stream'>
                    <span>
                      <Icon
                        icon='eye'
                        size={20}
                        color={
                          darkMode ? palette.common.white : palette.common.black
                        }
                      />
                    </span>
                  </Tooltip>
                </Button>
              </Grid>
            </Box>
          </AccordionDetails>
        )}
    </Accordion>
  )
}

ActivityCard.propTypes = propTypes

export default ActivityCard
