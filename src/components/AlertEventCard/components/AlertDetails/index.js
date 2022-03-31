import React from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import { useTheme } from '@material-ui/core/styles'
import { Button, Grid, CircularProgress } from '@material-ui/core'
import { useSelector, useDispatch } from 'react-redux'
import {
  VisibilityOutlined as VisibilityOutlinedIcon,
  VisibilityOffOutlined as VisibilityOffOutlinedIcon,
} from '@material-ui/icons'
import { get } from 'lodash'

// src
import useFeature from 'common/hooks/useFeature'
import { resolveRequested } from 'components/NewsFeed/feedSlice'
import { ModalTypeEnum } from 'enums'
import { showModal } from 'redux/slices/modal'
import { Icons } from 'ambient_ui'
import Tooltip from 'components/Tooltip'
import Evidence from 'components/AlertCommon/Evidence'
import AlertOptionMenu from 'components/organisms/AlertOptionMenu'
import useStyles from './styles'
import msToUnix from 'utils/msToUnix'

const ICON_SIZE = 20

const propTypes = {
  activityVersion: PropTypes.bool,
  alertEvent: PropTypes.object,
  expanded: PropTypes.bool,
  isDispatchLoading: PropTypes.bool,
}

const defaultProps = {
  activityVersion: false,
  alertEvent: null,
  expanded: false,
  isDispatchLoading: false,
}

const AlertDetails = ({ activityVersion, alertEvent, expanded }) => {
  const { palette } = useTheme()
  const { account } = useParams()
  const darkMode = useSelector(state => state.settings.darkMode)

  const classes = useStyles({ darkMode })
  const dispatch = useDispatch()
  const stream = get(alertEvent, 'stream', null)
  const resolveAlert = () => {
    dispatch(
      resolveRequested({
        alertEventId: alertEvent.id,
        alertEventHash: alertEvent.eventHash,
      }),
    )
  }

  const dispatchAlert = () => {
    dispatch(
      showModal({
        content: {
          alertEventId: alertEvent.id,
          alertEventHash: alertEvent.eventHash,
        },
        type: ModalTypeEnum.RESPONDERS,
      }),
    )
  }

  const handleOpenModal = () => {
    let data
    if (activityVersion) {
      const initTs =
        get(alertEvent, 'tsIdentifier') || get(alertEvent, 'ts_identifier')
      data = {
        content: {
          streamName: get(alertEvent, 'stream.name'),
          streamId: get(alertEvent, 'stream.id'),
          nodeId: get(alertEvent, 'stream.node.identifier'),
          siteName: get(alertEvent, 'stream.site.name'),
          siteSlug: get(alertEvent, 'stream.site.slug'),
          timezone: get(alertEvent, 'stream.site.timezone'),
          initTs: msToUnix(initTs),
        },
        type: ModalTypeEnum.VIDEO,
      }
    } else {
      data = {
        content: {
          alertEvent,
        },
        type: ModalTypeEnum.ALERT,
      }
    }
    dispatch(showModal(data))
  }

  const isStreamActive = get(alertEvent, 'stream.active', false)
  const showAlertErrorReport = useFeature({
    accountSlug: account,
    feature: 'ALERT_ERROR_REPORT',
  })
  return (
    <Grid
      container
      direction='column'
      justify='center'
      alignItems='center'
      className={classes.video}
    >
      {expanded && stream && (
        <Evidence
          alertInstances={get(alertEvent, 'alertInstances', [alertEvent])}
        />
      )}
      <Grid
        container
        direction='row'
        justify='space-around'
        alignItems='center'
      >
        <Grid item>
          <Tooltip
            content={isStreamActive ? 'View Details' : 'Stream inactive'}
          >
            <Button
              disabled={!isStreamActive}
              type='button'
              onClick={handleOpenModal}
              className={classes.buttons}
            >
              {isStreamActive && (
                <VisibilityOutlinedIcon
                  fontSize='small'
                  htmlColor={palette.text.primary}
                />
              )}
              {!isStreamActive && (
                <VisibilityOffOutlinedIcon
                  fontSize='small'
                  htmlColor={palette.text.primary}
                />
              )}
            </Button>
          </Tooltip>
        </Grid>
        <Grid item>
          <Button
            type='button'
            onClick={dispatchAlert}
            className={classes.buttons}
          >
            <Tooltip content={'Dispatch'}>
              <Icons.Phone width={ICON_SIZE} height={ICON_SIZE} />
            </Tooltip>
          </Button>
        </Grid>

        {!activityVersion && !alertEvent.resolved && (
          <Grid item>
            <Button
              type='button'
              onClick={resolveAlert}
              className={classes.buttons}
              disabled={alertEvent.resolveLoading}
            >
              {alertEvent.resolveLoading ? (
                <CircularProgress size={24} />
              ) : (
                <Tooltip content='Resolve'>
                  <span>
                    <Icons.Check width={ICON_SIZE} height={ICON_SIZE} />
                  </span>
                </Tooltip>
              )}
            </Button>
          </Grid>
        )}
        <Grid item>
          {showAlertErrorReport && (
            <AlertOptionMenu
              darkMode={darkMode}
              lightIcon={true}
              siteSlug={get(alertEvent, 'alert.site.slug', null)}
              threatSignatureId={get(
                alertEvent,
                'alert.threatSignature.id',
                null,
              )}
              threatSignatureName={get(
                alertEvent,
                'alert.threatSignature.name',
                null,
              )}
              streamId={get(alertEvent, 'stream.id', null)}
              streamName={get(alertEvent, 'stream.name', null)}
              alertId={get(alertEvent, 'alert.id', null)}
            />
          )}
        </Grid>
      </Grid>
    </Grid>
  )
}

AlertDetails.defaultProps = defaultProps
AlertDetails.propTypes = propTypes

export default AlertDetails
