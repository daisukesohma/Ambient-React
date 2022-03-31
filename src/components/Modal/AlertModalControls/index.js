import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { SearchableDropdownMenu, Icons } from 'ambient_ui'
import { useQuery, useMutation } from '@apollo/react-hooks'
import Box from '@material-ui/core/Box'
import PeopleIcon from '@material-ui/icons/People'
import AddIcon from '@material-ui/icons/Add'
import Button from '@material-ui/core/Button'
import Drawer from '@material-ui/core/Drawer'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import get from 'lodash/get'
import { isMobile } from 'react-device-detect'
import sortBy from 'lodash/sortBy'
import clsx from 'clsx'
// src
import { createNotification } from 'redux/slices/notifications'
import {
  dispatchExternalRequested,
  dispatchInternalRequested,
} from 'redux/slices/alertModal'
import trackEventToMixpanel from 'mixpanel/utils/trackEventToMixpanel'
import { MixPanelEventEnum } from 'enums'

import {
  GET_EXTERNAL_PROFILES_BY_ACCOUNT,
  GET_PROFILES_BY_SITE,
  CREATE_EXTERNAL_PROFILE,
} from './gql'
import useStyles from './styles'

const propTypes = {
  accountSlug: PropTypes.string,
  siteSlug: PropTypes.string,
  alertEventId: PropTypes.number,
  alertEventHash: PropTypes.string,
  resolved: PropTypes.bool,
  onResolve: PropTypes.func,
  buttonCustomStyle: PropTypes.object,
  dropdownButtonCustomStyle: PropTypes.object,
}

const defaultProps = {
  accountSlug: 'acme',
  siteSlug: 'sf',
  buttonCustomStyle: {},
  dropdownButtonCustomStyle: {},
}

function AlertModalControls({
  accountSlug,
  siteSlug,
  alertEventId,
  alertEventHash,
  resolved,
  onResolve,
  buttonCustomStyle = {},
  dropdownButtonCustomStyle = {},
}) {
  const dispatch = useDispatch()
  const userId = useSelector(state => state.auth.user.id)
  const classes = useStyles({ isMobile })
  const { data: profileData } = useQuery(GET_PROFILES_BY_SITE, {
    variables: {
      accountSlug,
      siteSlug,
      isActive: true,
    },
  })

  const { data: externalProfileData } = useQuery(
    GET_EXTERNAL_PROFILES_BY_ACCOUNT,
    {
      variables: {
        accountSlug,
      },
      // NB: DO NOT REMOVE THIS. It is here for a reason.
      // refetchQueries don't work without this.
      fetchPolicy: 'cache-and-network',
    },
  )

  const [
    menuItemsForProfileDispatch,
    setMenuItemsForProfileDispatch,
  ] = useState([])

  const [
    menuItemsForExternalDispatch,
    setMenuItemsForExternalDispatch,
  ] = useState([])

  const [createExternalProfileRequest] = useMutation(CREATE_EXTERNAL_PROFILE, {
    onCompleted({ createExternalProfile }) {
      if (createExternalProfile.ok) {
        dispatch(
          createNotification({
            message: 'External contact created successfully',
          }),
        )
        dispatch(
          dispatchExternalRequested({
            variables: {
              alertEventId,
              alertEventHash,
              externalProfileId: createExternalProfile.externalProfile.id,
            },
          }),
        )
      } else {
        dispatch(
          createNotification({
            message:
              'Error: Could not create external contact. Please try again later',
          }),
        )
      }
    },
  })

  // ExternalProfile form
  const [createExternalOpen, setCreateExternalOpen] = React.useState(false)
  const [extName, setExtName] = React.useState()
  const [extPhoneNumber, setExtPhoneNumber] = React.useState()
  const [extEmail, setExtEmail] = React.useState('') // on ui, we say this is optional, however, our backend gql endpoint requires an email param, even if it is an empty string.

  useEffect(() => {
    if (profileData) {
      // used lodash sortBy function to sort. if responder role is null, send to bottom. if
      // role name is Responder, send to top. else leave it.
      const profiles = sortBy(profileData.getProfilesBySite, [
        responder => {
          if (responder.role === null) return 1
          if (responder.role.name === 'Responder') return -1
          return 0
        },
      ])
      setMenuItemsForProfileDispatch(
        profiles.map(profile => {
          return {
            primary: get(profile, 'user.firstName'),
            secondary: get(profile, 'role.name'),
            value: profile.id,
            isSignedIn: get(profile, 'isSignedIn'),
            contactResource: get(
              profile,
              'lastWorkShiftPeriod.contactResource',
            ),
          }
        }),
      )
    }
  }, [profileData])

  useEffect(() => {
    if (externalProfileData) {
      const externalProfiles = externalProfileData.getExternalProfilesByAccount
      setMenuItemsForExternalDispatch(
        externalProfiles.map(profile => {
          return {
            primary: profile.name || 'Unknown',
            secondary: profile.phoneNumber || profile.email,
            value: profile.id,
          }
        }),
      )
    }
  }, [externalProfileData])

  const DispatchButton = (
    <SearchableDropdownMenu
      name='Dispatch'
      icon={Icons.Phone}
      reverse
      customStyle={dropdownButtonCustomStyle}
      menuItems={menuItemsForProfileDispatch}
      globalItem={{
        icon: PeopleIcon,
        primary: 'All Responders',
        secondary: 'Dispatch All Responders',
      }}
      onItemClick={item => {
        dispatch(
          createNotification({
            message: `Dispatching ${item.primary}. This will take a moment.`,
          }),
        )
        const variables = {
          alertEventId,
          alertEventHash,
          profileId: item.value,
          userId,
        }
        dispatch(
          dispatchInternalRequested({
            variables,
            afterDispatch: () => {
              trackEventToMixpanel(MixPanelEventEnum.ALERT_DISPATCH)
            },
          }),
        )
      }}
      onGlobalItemClick={item => {
        dispatch(
          createNotification({
            message: 'Dispatching all responders. This will take a moment.',
          }),
        )
        dispatch(
          dispatchInternalRequested({
            variables: {
              alertEventId,
              alertEventHash,
            },
            afterDispatch: () => {
              trackEventToMixpanel(MixPanelEventEnum.ALERT_DISPATCH_ALL)
            },
          }),
        )
      }}
    />
  )

  const ExternalDispatchButton = (
    <SearchableDropdownMenu
      name='Share'
      icon={Icons.Users}
      reverse
      customStyle={dropdownButtonCustomStyle}
      menuItems={menuItemsForExternalDispatch}
      globalItem={{
        icon: AddIcon,
        primary: 'New Profile',
        secondary: 'Create a new external profile',
      }}
      onItemClick={item => {
        dispatch(
          createNotification({
            message: `Dispatching ${item.primary}. This will take a moment.`,
          }),
        )
        dispatch(
          dispatchExternalRequested({
            variables: {
              alertEventId,
              alertEventHash,
              externalProfileId: item.value,
            },
          }),
        )
      }}
      onGlobalItemClick={() => setCreateExternalOpen(true)}
    />
  )

  const ResolveButton = (
    <Button
      variant='contained'
      disabled={resolved === null || resolved}
      style={{ padding: '16px', ...buttonCustomStyle }}
      color='primary'
      onClick={onResolve}
      startIcon={<Icons.Check stroke='white' />}
    >
      {resolved ? 'Resolved' : 'Resolve'}
    </Button>
  )

  return (
    <>
      <Grid container alignContent='center' justify='center'>
        <Box m={0.5} className={clsx({ [classes.controller]: isMobile })}>
          {ExternalDispatchButton}
        </Box>
        <Box m={0.5} className={clsx({ [classes.controller]: isMobile })}>
          {DispatchButton}
        </Box>
        <Box m={0.5} className={clsx({ [classes.controller]: isMobile })}>
          {ResolveButton}
        </Box>
      </Grid>
      <Drawer
        anchor='top'
        open={createExternalOpen}
        classes={{ paperAnchorTop: classes.drawer }}
      >
        <Grid container>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Typography variant='h6'>Create an External Contact</Typography>
            <Typography variant='caption'>
              External contacts allow a faster way to contact First Responders
              and Emergency Responders.
            </Typography>
          </Grid>
          <Grid container>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <TextField
                required
                fullWidth
                label='Name'
                value={extName}
                helperText='Name of the External Contact'
                onChange={event => setExtName(event.target.value)}
                margin='normal'
              />
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <TextField
                fullWidth
                label='Email'
                value={extEmail}
                helperText='Email of the external contact. This is not required.'
                onChange={event => setExtEmail(event.target.value)}
                margin='normal'
              />
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <TextField
                fullWidth
                label='Phone Number'
                value={extPhoneNumber}
                helperText='Phone Number of the external contact. This is not required but preferred.'
                onChange={event => setExtPhoneNumber(event.target.value)}
                margin='normal'
              />
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Box dislpay='flex' flexDirection='row' textAlign='center'>
                <Box display='inline' m={1}>
                  <Button
                    color='primary'
                    variant='contained'
                    onClick={() => {
                      createExternalProfileRequest({
                        variables: {
                          accountSlug,
                          name: extName,
                          email: extEmail,
                          phoneNumber: extPhoneNumber,
                        },
                        refetchQueries: [
                          {
                            query: GET_EXTERNAL_PROFILES_BY_ACCOUNT,
                            variables: { accountSlug },
                          },
                        ],
                        awaitRefetchQueries: true,
                      })
                      setCreateExternalOpen(false)
                    }}
                  >
                    Save
                  </Button>
                </Box>
                <Box display='inline' m={1}>
                  <Button
                    variant='contained'
                    onClick={() => setCreateExternalOpen(false)}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Drawer>
    </>
  )
}

AlertModalControls.propTypes = propTypes
AlertModalControls.defaultProps = defaultProps

export default AlertModalControls
