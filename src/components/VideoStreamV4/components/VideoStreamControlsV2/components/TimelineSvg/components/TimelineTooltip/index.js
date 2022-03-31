import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { useTheme } from '@material-ui/core/styles'
import get from 'lodash/get'
import clsx from 'clsx'
// src
import hoveredData from 'selectors/videoStreamControls/hoveredData'
import { Icons, CircularProgress } from 'ambient_ui'
import { CURVE_ICONS } from 'components/VideoStreamV4/components/VideoStreamControlsV2/constants'
import { useFlexStyles } from 'common/styles/commonStyles'
import {
  fetchStreamSnapshotsRequested,
  clearSnapshot,
} from 'redux/slices/videoStreamControls'

import useStyles from './styles'

const TIME_BETWEEN_SNAPSHOTS = 3

const propTypes = {
  time: PropTypes.instanceOf(Date),
  timezone: PropTypes.string,
  visible: PropTypes.bool,
  videoStreamKey: PropTypes.string,
  x: PropTypes.number,
  streamId: PropTypes.number,
}

function TimelineTooltip({
  time,
  timezone,
  visible,
  videoStreamKey,
  x,
  streamId,
}) {
  const { palette } = useTheme()
  const dispatch = useDispatch()
  const flexClasses = useFlexStyles()
  const [lastTs, setLastTs] = useState(null)
  const data = useSelector(
    hoveredData({
      videoStreamKey,
      time,
    }),
  )

  const { metadata, isInCatalog, snapshotUrl, snapshotLoading } = data
  const classes = useStyles({ isInCatalog })

  const startTs = time.getTime() / 1000
  const differenceEnoughToChange =
    Math.abs(startTs - lastTs) > TIME_BETWEEN_SNAPSHOTS

  useEffect(() => {
    if (isInCatalog) {
      if (differenceEnoughToChange) {
        dispatch(
          clearSnapshot({
            videoStreamKey,
          }),
        )
      }
      dispatch(
        fetchStreamSnapshotsRequested({
          streamId,
          startTs,
          videoStreamKey,
        }),
      )
      setLastTs(startTs)
    } else {
      dispatch(
        clearSnapshot({
          videoStreamKey,
        }),
      )
    }
  }, [
    streamId,
    startTs,
    videoStreamKey,
    dispatch,
    isInCatalog,
    differenceEnoughToChange,
  ])

  const metadataDetected = Object.keys(metadata).filter(k => metadata[k].date)

  if (!visible) return null
  if (metadataDetected.length === 0 && !isInCatalog && !snapshotUrl) return null

  return (
    <div
      className={clsx(classes.root)}
      style={{
        color: 'white',
        transform: `translate(${x}px)`,
        width: snapshotUrl ? 240 : 88,
      }}
    >
      {snapshotUrl && (
        <div className={classes.snapshot}>
          <img alt='snapshot' src={snapshotUrl} className={classes.img} />
          {snapshotLoading && (
            <span className={classes.loader}>
              <CircularProgress size='16px' />
            </span>
          )}
        </div>
      )}
      {isInCatalog && (
        <div
          className={clsx(
            flexClasses.row,
            flexClasses.centerStart,
            classes.details,
          )}
        >
          <div
            className={clsx(flexClasses.row, flexClasses.centerAll)}
            style={{ height: 20, width: 20 }}
          >
            <div
              style={{
                background: palette.primary.main,
                height: 3,
                width: '90%',
                borderRadius: 1.5,
              }}
            />
          </div>
          <span className={clsx('am-caption', classes.label)}>Motion</span>
        </div>
      )}
      {metadataDetected.map(k => {
        const iconData = CURVE_ICONS.find(icon => icon.key === k)
        const iconKey = get(iconData, 'iconKey', null)
        const CurveIcon = iconKey ? Icons[iconKey] : null
        return (
          <div
            key={`motion-status-${k}`}
            className={clsx(
              flexClasses.row,
              flexClasses.centerStart,
              classes.motionWrapper,
            )}
          >
            {CurveIcon && (
              <div
                className={clsx(
                  classes.curveIcon,
                  flexClasses.row,
                  flexClasses.centerAll,
                )}
                style={{ border: `solid .5px ${iconData.activeColor}` }}
              >
                <CurveIcon
                  stroke={iconData.activeColor}
                  width={14}
                  height={14}
                />
              </div>
            )}
            <span className={clsx('am-caption', classes.label)}>
              {iconData.iconKey}
            </span>
          </div>
        )
      })}
    </div>
  )
}

TimelineTooltip.propTypes = propTypes
export default TimelineTooltip
