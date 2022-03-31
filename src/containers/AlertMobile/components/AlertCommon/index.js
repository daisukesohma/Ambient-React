import React, { useState, useEffect } from 'react'
import { Typography, Grid } from '@material-ui/core'
import PropTypes from 'prop-types'
import CardHeader from '@material-ui/core/CardHeader'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Box from '@material-ui/core/Box'
import Fab from '@material-ui/core/Fab'
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled'
import Grow from '@material-ui/core/Grow'
import get from 'lodash/get'
import join from 'lodash/join'
import compact from 'lodash/compact'
import { useSelector, useDispatch } from 'react-redux'
import { isMobile } from 'react-device-detect'
// src
import { MoreOptionMenu, CircularProgress } from 'ambient_ui'
import VideoStreamComponent from 'components/VideoStreamComponent'
import Evidence from 'components/AlertCommon/Evidence'
import {
  StreamTypeEnum,
  DatabaseModelTypeEnum,
  SignalServerAuthenticationTypeEnum,
} from 'enums'
import { setupP2PRequested } from 'redux/slices/webrtc'
import {
  DEFAULT_TIMEZONE,
  formatTimeWithTZ,
} from 'utils/dateTime/formatTimeWithTZ'
import { getElapsedTime } from 'utils'

import useStyles from './styles'

const defaultProps = {
  actions: () => {},
  alertEventOrInstance: {},
  modelType: null,
  displayDismiss: false,
  dismissAlert: () => {},
}

const propTypes = {
  actions: PropTypes.object,
  alertEventOrInstance: PropTypes.object,
  modelType: PropTypes.string,
  displayDismiss: PropTypes.bool,
  dismissAlert: PropTypes.func,
}

const AlertCommon = ({
  actions,
  alertEventOrInstance,
  modelType,
  displayDismiss,
  dismissAlert,
}) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [goneLive, setGoneLive] = useState(false)
  const [selectedEvidence, setSelectedEvidence] = useState(null)
  const dismissLoading = useSelector(state => state.feed.dismissLoading)
  const existingP2P = useSelector(state => state.webrtc.p2pActive)
  const stream = get(alertEventOrInstance, 'stream')
  const streamName = get(alertEventOrInstance, 'stream.name')
  const siteName = get(alertEventOrInstance, 'alert.site.name')
  const deviceId = get(alertEventOrInstance, 'accessReader.deviceId')
  const accountName = get(alertEventOrInstance, 'alert.site.account.name')
  const canRecall = get(alertEventOrInstance, 'canRecall', false)

  useEffect(() => {
    if (alertEventOrInstance) {
      const instances = alertEventOrInstance.alertInstances
      setSelectedEvidence(instances ? instances[0] : alertEventOrInstance)

      if (!existingP2P) {
        let nodeIds = []

        if (stream) {
          nodeIds = [stream.node.identifier]
        }

        dispatch(
          setupP2PRequested({
            authParams: {
              alertEventHash:
                alertEventOrInstance.eventHash ||
                alertEventOrInstance.alertHash,
              alertEventId: alertEventOrInstance.id,
              type: SignalServerAuthenticationTypeEnum.ALERT,
              nodeIds,
            },
          }),
        )
      }
    }
    // eslint-disable-next-line
  }, [alertEventOrInstance])

  const onEvidenceChange = instance => {
    setSelectedEvidence(instance)
  }

  let modelId = null
  let modelHash = null

  if (modelType) {
    modelId = get(alertEventOrInstance, 'id')

    if (modelType === DatabaseModelTypeEnum.ALERT_INSTANCE) {
      modelHash = get(alertEventOrInstance, 'alertHash')
    } else if (modelType === DatabaseModelTypeEnum.ALERT_EVENT) {
      modelHash = get(alertEventOrInstance, 'eventHash')
    }
  }

  const onDismiss = () => {
    dismissAlert()
  }

  return (
    <Grid container spacing={1}>
      <Grid item lg={12} md={12} sm={12} xs={12}>
        <Card className={classes.evidence}>
          <div className={classes.titleRow}>
            <CardHeader
              title={
                alertEventOrInstance
                  ? alertEventOrInstance.alert.name
                  : 'Loading...'
              }
              subheader={
                alertEventOrInstance
                  ? join(
                      compact([streamName, siteName, deviceId, accountName]),
                      ' / ',
                    )
                  : 'Loading...'
              }
            />
            {displayDismiss && canRecall && (
              <div className={classes.optionMenu}>
                {dismissLoading ? (
                  <CircularProgress size={20} />
                ) : (
                  <MoreOptionMenu
                    size={20}
                    menuItems={[
                      {
                        label: 'Mark as False Alert',
                        onClick: () => {
                          onDismiss()
                        },
                      },
                    ]}
                  />
                )}
              </div>
            )}
          </div>
          {alertEventOrInstance && stream && (
            <Evidence
              alertInstances={[alertEventOrInstance]}
              onChange={onEvidenceChange}
            />
          )}

          <CardContent>
            <Grid
              container
              justify='space-between'
              alignItems='center'
              direction='row'
            >
              <Grid item container direction='column' xs={7}>
                <Box>
                  <Typography
                    variant='subtitle1'
                    color='textSecondary'
                    component='p'
                  >
                    {selectedEvidence &&
                      formatTimeWithTZ(
                        selectedEvidence.tsIdentifier,
                        'MMMM dd, yyyy, h:mm:ss a zz',
                        get(alertEventOrInstance, 'stream.site.timezone'),
                      )}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant='caption'
                    color='textSecondary'
                    component='p'
                  >
                    {selectedEvidence &&
                      getElapsedTime(selectedEvidence.tsIdentifier / 1000)}
                  </Typography>
                </Box>
              </Grid>
              {stream && (
                <Grid item xs={5}>
                  <Box
                    display={goneLive ? 'none' : 'flex'}
                    flexDirection='row'
                    alignItems='right'
                    justifyContent='flex-end'
                    className={classes.goLiveButton}
                  >
                    <Fab variant='extended' onClick={() => setGoneLive(true)}>
                      <PlayCircleFilledIcon color='error' /> Go Live
                    </Fab>
                  </Box>
                </Grid>
              )}
            </Grid>
          </CardContent>
          {goneLive && (
            <Grow in={goneLive}>
              <VideoStreamComponent
                accountSlug={get(
                  alertEventOrInstance,
                  'alert.site.account.slug',
                )}
                siteSlug={get(alertEventOrInstance, 'alert.site.slug')}
                streamId={get(alertEventOrInstance, 'stream.id')}
                nodeId={get(alertEventOrInstance, 'stream.node.identifier')}
                viewMode={StreamTypeEnum.NORMAL}
                videoStreamKey='mobile-alert'
                willAutoLoad={!isMobile}
                isMobile={isMobile}
                key={get(alertEventOrInstance, 'id')}
                showPlaybackControls={false}
                showIndicator={false}
                initTS={null}
                modelType={modelType}
                modelId={modelId}
                modelHash={modelHash}
                timezone={get(
                  alertEventOrInstance,
                  'alert.site.timezone',
                  DEFAULT_TIMEZONE,
                )}
              />
            </Grow>
          )}
          <CardActions>
            <Box
              display='flex'
              flexDirection='row'
              alignItems='center'
              justifyContent='center'
              textAlign='center'
              className={classes.fullWidth}
            >
              {actions}
            </Box>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  )
}

AlertCommon.defaultProps = defaultProps
AlertCommon.propTypes = propTypes

export default AlertCommon
