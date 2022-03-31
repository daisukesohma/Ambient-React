/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { useTheme, makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import CheckIcon from '@material-ui/icons/Check'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import PhoneIcon from '@material-ui/icons/Phone'
import get from 'lodash/get'
import { useDispatch, useSelector } from 'react-redux'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import FastForwardIcon from '@material-ui/icons/FastForward'
import SettingsIcon from '@material-ui/icons/Settings'
import LinearProgress from '@material-ui/core/LinearProgress'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Typography from '@material-ui/core/Typography'
import Moment from 'react-moment'
import { createNotification } from 'redux/slices/notifications'
// TODO: Move to sagas
import {
  RESOLVE_ALERT_EVENT,
  DISPATCH_INTERNAL,
  GET_DISPATCH_STATUS,
} from 'components/NewsFeed/saga/gql'
import {
  escalationContactFetchRequested,
  snoozeEscalationMethodRequested,
  unsnoozeEscalationMethodRequested,
} from 'redux/mobileEscalation/actions'
import { dismissAlertEventRequested } from 'components/NewsFeed/feedSlice'
import ConfirmDialog from 'components/ConfirmDialog'
import parseLatLng from 'utils/parseLatLng'
import { DatabaseModelTypeEnum, AckStatusEnum } from 'enums'

import AlertCommon from './components/AlertCommon'
import DispatchInfo from './components/DispatchInfo'
import StatusList from './components/StatusList'

const useStyles = makeStyles(({ palette }) => ({
  dispatch: {
    backgroundColor: '#FD235C',
    color: palette.common.white,
    '&:hover': {
      backgroundColor: 'purple',
    },
  },
}))

const Acknowledgement = ({ match }) => {
  const { palette } = useTheme()
  const classes = useStyles()
  const dispatch = useDispatch()

  const escalationContact = useSelector(
    state => state.mobileEscalation.escalationContact,
  )
  const escalationContactLoading = useSelector(
    state => state.mobileEscalation.escalationContactLoading,
  )
  const snoozeEscalationMethodLoading = useSelector(
    state => state.mobileEscalation.snoozeEscalationMethodLoading,
  )
  const unsnoozeEscalationMethodLoading = useSelector(
    state => state.mobileEscalation.unsnoozeEscalationMethodLoading,
  )
  const dismissLoading = useSelector(state => state.feed.dismissLoading)
  const settingsLoading =
    escalationContactLoading ||
    snoozeEscalationMethodLoading ||
    unsnoozeEscalationMethodLoading ||
    dismissLoading

  const [resolved, setResolved] = useState(false)
  const [alertEvent, setAlertEvent] = useState(null)
  const [responders, setResponders] = useState([])
  const [timeline, setTimeline] = React.useState(null)
  const [center, setCenter] = React.useState(null)
  const [statuses, setStatuses] = React.useState([])
  const [hasDipatched, setHasDispatched] = React.useState(false)
  const [tabValue, setTabValue] = React.useState(0)
  const [dismissModalOpened, setDismissModalOpened] = React.useState(false)

  const {
    alertEventId,
    alertEventHash,
    escalationLevelId,
    escalationContactId,
  } = match.params

  const variables = {
    alertEventId,
    alertEventHash,
    escalationLevelId,
    escalationContactId,
  }

  const [
    dispatchInternalRequest,
    { loading: dispatchInternalLoading, data: dispatchInternalData },
  ] = useMutation(DISPATCH_INTERNAL)

  /*
  const [
    acknowledgeAlertEventRequest,
    { loading: acknowledgeAlertEventLoading, data: acknowledgeAlertEventData },
  ] = useMutation(ACKNOWLEDGE_ALERT_EVENT_ESCALATION)
  */

  const [
    resolveAlertEventRequest,
    { loading: resolveAlertEventLoading, data: resolveAlertEventData },
  ] = useMutation(RESOLVE_ALERT_EVENT)

  const { data: dispatchStatusData } = useQuery(GET_DISPATCH_STATUS, {
    variables: {
      alertEventId,
      alertEventHash,
    },
    pollInterval: 5000,
    // DO NOT REMOVE THIS: useEffect will NOT be called with pollInterval
    // without this flag
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
  })

  const dismissModalOpen = () => {
    setDismissModalOpened(true)
  }

  const confirmMarkFalse = () => {
    dispatch(
      dismissAlertEventRequested({
        alertEventId,
        alertEventHash,
      }),
    )
    setDismissModalOpened(false)
  }

  const onCancelMarkFalse = () => {
    setDismissModalOpened(false)
  }

  useEffect(() => {
    if (dispatch && escalationContactId) {
      dispatch(escalationContactFetchRequested(escalationContactId))
    }
  }, [dispatch, escalationContactId])

  /*
   * TODO: Auto-acknowledge
  useEffect(() => {
    if (acknowledgeAlertEventData) {
      const data = acknowledgeAlertEventData.acknowledgeAlertEventEscalation
      dispatch(createNotification({ message: data.message }))
    }
  }, [acknowledgeAlertEventData])
  */

  // This event has been detected frequently in the last few minutes on this stream. Is this a false alert?

  useEffect(() => {
    if (resolveAlertEventData) {
      const data = resolveAlertEventData.resolveAlertEvent
      setResolved(data.ok)
      dispatch(createNotification({ message: data.message }))
    }
  }, [resolveAlertEventData, dispatch])

  useEffect(() => {
    if (dispatchInternalData) {
      const data = dispatchInternalData.dispatchInternal
      setHasDispatched(data.ok)
      dispatch(createNotification({ message: data.message }))
    }
  }, [dispatchInternalData, dispatch])

  // FIXME: This is not updating in real-time
  useEffect(() => {
    if (dispatchStatusData) {
      const data = dispatchStatusData.dispatchStatus
      const { lat, lng } = parseLatLng(data.alertEvent.alert.site.latlng)
      setCenter({ lat, lng })
      setAlertEvent(data.alertEvent)
      setResolved(data.alertEvent.resolved)
      setResponders(data.responders)
      setStatuses(data.statuses)
      setTimeline(data.timeline)
    }
  }, [dispatchStatusData])

  const snoozeOptions = [
    { label: '15m', value: 900 },
    { label: '30m', value: 1800 },
    { label: '1h', value: 3600 },
  ]

  const actions = (
    <Box display='flex' flexDirection='column' width={1}>
      {resolved && (
        <Box
          display='flex'
          flexDirection='row'
          mt={1.0}
          alignItems='center'
          justifyContent='center'
        >
          <Box mt={1}>
            <CheckCircleIcon color='primary' className={classes.iconBtn} />
          </Box>
          <Box ml={0.75}>This alert has been resolved</Box>
        </Box>
      )}
      <Box
        display='flex'
        flexDirection='row'
        mt={0.5}
        justifyContent='center'
        width={1}
      >
        <Box m={1} width={1}>
          <Button
            variant='contained'
            color={resolved ? 'secondary' : 'primary'}
            disabled={!alertEvent || resolved || resolveAlertEventLoading}
            onClick={() => {
              resolveAlertEventRequest({
                variables,
              })
            }}
            fullWidth
          >
            <CheckIcon className={classes.iconBtn} />{' '}
            {resolved ? 'Resolved' : 'Resolve'}
          </Button>
        </Box>
        <Box m={1} width={1}>
          <Button
            variant='contained'
            className={classes.dispatch}
            disabled={!alertEvent || dispatchInternalLoading || hasDipatched}
            onClick={() => {
              dispatchInternalRequest({
                variables,
              })
            }}
            fullWidth
          >
            <PhoneIcon className={classes.iconBtn} /> Dispatch
          </Button>
        </Box>
      </Box>
      <Box m={1}>
        <Button
          disableElevation
          fullWidth
          variant='contained'
          color='secondary'
          style={{ padding: '10px' }}
          onClick={() => {
            window.open('tel:911')
          }}
        >
          Call 911
        </Button>
      </Box>
    </Box>
  )

  return (
    <div>
      <ConfirmDialog
        open={dismissModalOpened}
        onConfirm={confirmMarkFalse}
        onClose={onCancelMarkFalse}
        loading={false}
        content={
          'This event has been detected frequently in the last few minutes on this stream. Is this a false alert?'
        }
      />
      <AlertCommon
        actions={actions}
        alertEventOrInstance={alertEvent}
        modelType={DatabaseModelTypeEnum.ALERT_EVENT}
        displayDismiss={true}
        dismissAlert={dismissModalOpen}
      />
      <Tabs
        value={tabValue}
        onChange={(e, value) => {
          setTabValue(value)
        }}
        centered
        indicatorColor='primary'
        variant='fullWidth'
      >
        <Tab icon={<PhoneIcon />} label='Dispatch' />
        <Tab icon={<FastForwardIcon />} label='Escalation' />
        <Tab icon={<SettingsIcon />} label='Settings' />
      </Tabs>
      <Box hidden={tabValue !== 0}>
        <DispatchInfo
          lat={center ? center.lat : null}
          lng={center ? center.lng : null}
          responders={responders}
          timeline={timeline}
        />
      </Box>
      <Box hidden={tabValue !== 1}>
        <StatusList
          statuses={statuses
            .filter(
              item =>
                [AckStatusEnum.RAISED, AckStatusEnum.RESOLVED].indexOf(
                  item.status,
                ) >= 0,
            )
            .map(item => {
              const userName = get(item, 'user.firstName')
              const contactName = get(
                item,
                'contact.profile.user.firstName',
                'Operator Page',
              )
              const name = userName || contactName

              const label =
                item.status === AckStatusEnum.RAISED
                  ? `Raised to ${name}`
                  : `Resolved by ${name}`

              return {
                id: item.id,
                ts: item.ts,
                user: {
                  name,
                  img: get(item, 'user.profile.img'),
                },
                label,
              }
            })}
        />
      </Box>
      <Box hidden={tabValue !== 2}>
        {escalationContactLoading && <LinearProgress />}
        {escalationContact && (
          <List>
            {escalationContact &&
              escalationContact.contactMethods.map(es => {
                const isSnoozed = es.snooze && es.snooze.active
                return (
                  <ListItem divider key={es.method}>
                    <Grid container>
                      <Box
                        display='flex'
                        alignItems='center'
                        justifyContent='center'
                        width={1}
                      >
                        <Grid item lg={3} md={3} sm={3} xs={3}>
                          <Box p={1}>
                            <Typography variant='button'>
                              {es.method}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item lg={9} md={9} sm={9} xs={9}>
                          {!isSnoozed && (
                            <Box
                              display='flex'
                              justifyContent='center'
                              width={1}
                              p={1}
                            >
                              <ButtonGroup size='large' color='primary'>
                                {snoozeOptions.map(option => {
                                  return (
                                    <Button
                                      key={`${es.method}-${option.value}`}
                                      style={{ padding: '25px' }}
                                      onClick={() => {
                                        dispatch(
                                          snoozeEscalationMethodRequested({
                                            profileId:
                                              escalationContact.profile.id,
                                            method: es.method,
                                            duration: option.value,
                                          }),
                                        )
                                      }}
                                      disabled={settingsLoading}
                                    >
                                      {option.label}
                                    </Button>
                                  )
                                })}
                              </ButtonGroup>
                            </Box>
                          )}
                          {isSnoozed && (
                            <Box
                              display='flex'
                              flexDirection='column'
                              justifyContent='center'
                              height={1}
                            >
                              <Box
                                style={{ color: palette.error.main }}
                                ml={0.5}
                              >
                                Resuming{' '}
                                <Moment unix fromNow>
                                  {es.snooze.tsEnd}
                                </Moment>
                              </Box>
                              <Box mt={1}>
                                <Button
                                  size='large'
                                  color='primary'
                                  variant='contained'
                                  onClick={() => {
                                    dispatch(
                                      unsnoozeEscalationMethodRequested({
                                        profileId: escalationContact.profile.id,
                                        method: es.method,
                                      }),
                                    )
                                  }}
                                  disabled={settingsLoading}
                                >
                                  Unsnooze
                                </Button>
                              </Box>
                            </Box>
                          )}
                        </Grid>
                      </Box>
                    </Grid>
                  </ListItem>
                )
              })}
          </List>
        )}
      </Box>
    </div>
  )
}

Acknowledgement.defaultProps = {
  match: {},
}

Acknowledgement.propTypes = {
  match: PropTypes.object,
}

export default withRouter(Acknowledgement)
