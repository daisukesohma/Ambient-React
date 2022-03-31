import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { Can } from 'rbac'
import Tooltip from 'components/Tooltip'
import { Button, Icon, CircularProgress } from 'ambient_ui'
import { useTheme } from '@material-ui/core/styles'
import get from 'lodash/get'
import { Icon as IconKit } from 'react-icons-kit'
import { save } from 'react-icons-kit/feather/save'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
// src
import { sendExportRequest } from 'redux/signal/actions'
import { makeUniqueId, msToUnix } from 'utils'
import { createNotification } from 'redux/slices/notifications'
import { ModalTypeEnum } from 'enums'
import { showModal } from 'redux/slices/modal'
import { setSelectedModal } from 'redux/slices/reId'
import { formatUnixTimeWithTZ } from 'utils/dateTime/formatTimeWithTZ'
import { useFlexStyles, useTextStyles } from 'common/styles/commonStyles'

import DefaultImage from './components/DefaultImage'
import useStyles from './styles'

const propTypes = {
  currentSnapshotTs: PropTypes.number,
  data: PropTypes.object,
  showTitles: PropTypes.bool,
  didImageError: PropTypes.bool,
  handleImgError: PropTypes.func,
  isHovering: PropTypes.bool,
  modalStartTs: PropTypes.number,
  name: PropTypes.string,
  nameClasses: PropTypes.string,
  onClickName: PropTypes.func,
  onClickSubtitle: PropTypes.func,
  onMouseEnterName: PropTypes.func,
  onMouseEnterSnapshot: PropTypes.func,
  onMouseLeaveName: PropTypes.func,
  onMouseLeaveSnapshot: PropTypes.func,
  onMouseMoveSnapshot: PropTypes.func,
  onClickSnapshot: PropTypes.func,
  percentHover: PropTypes.number,
  snapshotRef: PropTypes.any,
  snapshotToShow: PropTypes.string,
}

const defaultProps = {
  showTitles: true,
}

function ForensicsCard({
  currentSnapshotTs,
  data,
  showTitles,
  didImageError,
  handleImgError,
  isHovering,
  modalStartTs,
  name,
  nameClasses,
  onClickName,
  onClickSubtitle,
  onMouseEnterName,
  onMouseEnterSnapshot,
  onMouseLeaveName,
  onMouseLeaveSnapshot,
  onMouseMoveSnapshot,
  percentHover,
  snapshotRef,
  snapshotToShow,
  onClickSnapshot,
}) {
  const { palette } = useTheme()
  const classes = useStyles({ showTitles })
  const textClasses = useTextStyles()
  const flexClasses = useFlexStyles()
  const dispatch = useDispatch()
  const history = useHistory()
  const { account } = useParams()
  const loadingSnapshots = useSelector(
    state => state.forensics.loadingSnapshots,
  )
  const timezone = get(data, 'stream.site.timezone')

  // ARCHIVE
  const handleSaveArchive = e => {
    const durationMs = 60000
    e.stopPropagation()
    const exportStartTs = Number(data.ts)
    const exportEndTs = Number(data.ts) + durationMs

    const stream = get(data, 'stream')
    const streamId = get(stream, 'id')

    dispatch(
      sendExportRequest({
        streamId,
        // Math.floor is needed because video exports URL does not take in decimal so must be a round number
        uniqId: `${makeUniqueId()}-${streamId}-${Math.floor(
          exportStartTs,
        )}-${Math.floor(exportEndTs)}`,
        nodeId: get(stream, 'node.identifier'),
        sessionId: makeUniqueId(),
        startTs: exportStartTs,
        endTs: exportEndTs,
      }),
    )

    dispatch(
      createNotification({
        message: 'Instance recording saved in Archives page',
        action: (
          <Button
            variant='outlined'
            onClick={() =>
              history.push(`/accounts/${account}/history/archives`)
            }
          >
            View
          </Button>
        ),
      }),
    )
  }

  // MODAL
  const viewStreamModal = (stream, ts) => () => {
    const modalData = {
      content: {
        streamName: get(stream, 'name'),
        streamId: get(stream, 'id'),
        nodeId: get(stream, 'node.identifier'),
        retentionMotionDays: get(stream, 'node.retentionMotionDays', 0),
        retentionNonmotionDays: get(stream, 'node.retentionNonmotionDays', 0),
        siteName: get(stream, 'site.name'),
        siteSlug: get(stream, 'site.slug'),
        initTs: ts,
        tsTimelineHighlight: ts,
        isZoomInInit: 1,
        timezone: get(stream, 'site.timezone'),
      },
      type: ModalTypeEnum.VIDEO,
    }

    dispatch(showModal(modalData))
    dispatch(setSelectedModal(modalData))
  }

  const { snapshotUrl } = data

  return (
    <>
      <div className={classes.heading}>
        {showTitles && (
          <div
            className={clsx(
              'am-body1',
              classes.name,
              textClasses.ellipsis,
              nameClasses,
            )}
            onMouseEnter={onMouseEnterName}
            onMouseLeave={onMouseLeaveName}
            onClick={onClickName}
          >
            <Tooltip content={name} placement='bottom-start'>
              <div className={textClasses.ellipsis}>{name}</div>
            </Tooltip>
          </div>
        )}
        <Can I='create' on='Archives'>
          <IconKit
            icon={save}
            size={20}
            style={{ color: palette.primary.main, cursor: 'pointer' }}
            onClick={handleSaveArchive}
          />
        </Can>
      </div>
      {showTitles && (
        <div
          className={clsx(
            flexClasses.row,
            flexClasses.centerStart,
            'am-caption',
            classes.subtitle,
          )}
          onClick={onClickSubtitle}
        >
          {get(data, 'stream.region.name') && (
            <>
              <span className={classes.icon}>
                <Icon
                  icon='compass'
                  color={palette.primary[300]}
                  size={14}
                  style={{ transform: 'translate(0,2px)' }}
                />
              </span>
              <div className={textClasses.ellipsis}>
                <Tooltip
                  content={data.stream.region.name}
                  placement='bottom-start'
                >
                  <div className={textClasses.ellipsis}>
                    {data.stream.region.name}
                  </div>
                </Tooltip>
              </div>
            </>
          )}
        </div>
      )}
      <div
        className={clsx(
          flexClasses.row,
          flexClasses.centerAll,
          classes.snapshotContainer,
        )}
        style={{ position: 'relative' }}
      >
        {(!isHovering || loadingSnapshots) && snapshotUrl && (
          <div
            className={clsx(
              flexClasses.column,
              flexClasses.centerAll,
              classes.root,
            )}
            ref={snapshotRef}
            onMouseEnter={onMouseEnterSnapshot}
            onMouseLeave={onMouseLeaveSnapshot}
            onMouseMove={onMouseMoveSnapshot}
            onClick={
              onClickSnapshot
                ? () => onClickSnapshot()
                : viewStreamModal(data.stream, modalStartTs)
            }
          >
            <img
              src={snapshotUrl}
              className={classes.snapshot}
              alt='snapshot'
              onError={handleImgError}
            />
            <div className={classes.baseProgressLine} />
          </div>
        )}
        {isHovering && !loadingSnapshots && snapshotToShow && (
          <div
            className={clsx(
              flexClasses.column,
              flexClasses.centerAll,
              classes.root,
            )}
            ref={snapshotRef}
            onMouseEnter={onMouseEnterSnapshot}
            onMouseLeave={onMouseLeaveSnapshot}
            onMouseMove={onMouseMoveSnapshot}
            onClick={
              onClickSnapshot
                ? () => onClickSnapshot()
                : viewStreamModal(data.stream, modalStartTs)
            }
          >
            <img
              src={snapshotToShow}
              className={classes.snapshot}
              alt='snapshot'
              onError={handleImgError}
            />
            <div className={classes.baseProgressLine}>
              <div
                style={{
                  width: `${percentHover}%`,
                  height: 4,
                  background: palette.secondary.main,
                  opacity: 1,
                }}
              />
            </div>
          </div>
        )}
        {didImageError && <div className={'am-caption'}>Image Not Found</div>}
        {(!snapshotUrl || !snapshotToShow) && <DefaultImage />}
      </div>
      <div
        className={clsx(
          'am-caption',
          flexClasses.row,
          flexClasses.centerBetween,
          classes.time,
        )}
      >
        <div>
          {isHovering && loadingSnapshots && <CircularProgress size={12} />}
        </div>
        <div>
          {(!isHovering || loadingSnapshots) &&
            formatUnixTimeWithTZ(
              msToUnix(data.ts),
              'M/dd hh:mm aa zzz',
              timezone,
            )}
          {isHovering &&
            !loadingSnapshots &&
            formatUnixTimeWithTZ(
              currentSnapshotTs,
              'M/dd hh:mm:ss aa zzz',
              timezone,
            )}
        </div>
      </div>
    </>
  )
}

ForensicsCard.propTypes = propTypes
ForensicsCard.defaultProps = defaultProps

export default ForensicsCard
