/* eslint-disable consistent-return, no-console */
import React, { useState, useEffect } from 'react'
import { useTheme } from '@material-ui/core/styles'
import { useSelector, useDispatch } from 'react-redux'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Box from '@material-ui/core/Box'
import get from 'lodash/get'
import Autocomplete from '@material-ui/lab/Autocomplete'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'
import { useParams } from 'react-router-dom'

import useScript from '../../../common/hooks/useScript'
import config from '../../../config'
import PlacesAutocomplete from '../../../components/PlacesAutocomplete'
import DispatchMap from '../../../components/AlertEvent/DispatchMap'
import parseLatLng from '../../../utils/parseLatLng'
import {
  setSiteUpdating,
  fetchTimezonesRequested,
  updateSiteInfoRequested,
} from 'redux/sites/actions'

export default function UpdateSiteInfo() {
  const theme = useTheme()
  const dispatch = useDispatch()
  const site = useSelector(state => state.sites.siteUpdating)
  const updating = useSelector(state => state.sites.updating)
  const timezones = useSelector(state => state.sites.timezones)
  const { account } = useParams()

  const [name, setName] = useState(null)
  const [address, setAddress] = useState(null)
  const [latitude, setLatitude] = useState(null)
  const [longitude, setLongitude] = useState(null)
  const [timezone, setTimezone] = useState(null)

  // The user must explicitly want to override timezone. By default,
  // it is computed from the address.
  const [editTimezone, setEditTimezone] = useState(false)
  const [addressTimezone, setAddressTimezone] = useState(null)
  const [addressTimezoneLoading, setAddressTimezoneLoading] = useState(false)

  useScript(
    `https://maps.googleapis.com/maps/api/js?key=${config.apiKeys.GOOGLE_MAP_KEY}&libraries=places`,
  )

  useEffect(() => {
    if (site) {
      // Reset on closure
      setEditTimezone(false)
    }
  }, [site])

  useEffect(() => {
    dispatch(fetchTimezonesRequested())
  }, [dispatch])

  useEffect(() => {
    if (site) {
      const { lat, lng } = parseLatLng(site.latlng)
      setName(site.name)
      setAddress(site.address)
      setLatitude(lat)
      setLongitude(lng)
    }
  }, [site])

  useEffect(() => {
    if (latitude && longitude) {
      const timestamp = Date.now() / 1000
      setAddressTimezoneLoading(true)
      fetch(
        `https://maps.googleapis.com/maps/api/timezone/json?location=${latitude},${longitude}&timestamp=${timestamp}&key=${config.apiKeys.GOOGLE_MAP_KEY}`,
      )
        .then(res => res.json())
        .then(
          result => {
            setAddressTimezone(result.timeZoneId)
            setAddressTimezoneLoading(false)
          },
          error => {
            console.error(error)
            setAddressTimezoneLoading(false)
          },
        )
    } else {
      // Clear addressTimezone
      setAddressTimezone(null)
    }
  }, [latitude, longitude])

  useEffect(() => {
    // If the user is not manually editing timezone, update as we
    // fetch address from timezone
    if (!editTimezone) {
      setTimezone(addressTimezone)
    }
  }, [editTimezone, addressTimezone])

  return (
    <Dialog
      open={Boolean(site)}
      onClose={() => dispatch(setSiteUpdating(null))}
      fullWidth
      maxWidth='sm'
    >
      <DialogTitle>Edit Site</DialogTitle>
      <DialogContent>
        <Box pb={0.5}>
          <Box>
            <TextField
              autoFocus
              margin='dense'
              label='Name'
              value={name}
              onChange={e => {
                setName(e.target.value)
              }}
              fullWidth
            />
          </Box>
          <Box mt={3.0}>
            <PlacesAutocomplete
              title='Address'
              address={get(site, 'address')}
              onChange={({ lat, lng, address: newAddress }) => {
                setLatitude(lat)
                setLongitude(lng)
                setAddress(newAddress)
              }}
            />
          </Box>
          {latitude && longitude && (
            <Box mt={1.0}>
              <div style={{ height: '200px' }}>
                <DispatchMap lat={latitude} lng={longitude} />
              </div>
            </Box>
          )}
          <Box mt={2.0}>
            <Autocomplete
              fullWidth
              disabled={!editTimezone}
              value={timezone || ''}
              onChange={(event, value) => {
                setTimezone(value)
              }}
              options={timezones}
              getOptionLabel={option => option}
              renderInput={params => (
                <TextField
                  {...params}
                  label={`${
                    editTimezone ? 'Preferred' : 'Recommended'
                  } Timezone`}
                  variant='outlined'
                />
              )}
            />
          </Box>
          <Box mt={0.2}>
            <Typography variant='caption'>
              {site && site.timezone && (
                <>
                  Timezone is currently set to{' '}
                  <span style={{ color: theme.palette.error.main }}>
                    {site.timezone}
                  </span>
                  . &nbsp;
                </>
              )}
              {!editTimezone && (
                <>
                  The timezone is automatically determined from the address. You
                  can &nbsp;
                  <Link href='#' onClick={() => setEditTimezone(true)}>
                    override it (not recommended).
                  </Link>
                </>
              )}
              {editTimezone && timezone !== addressTimezone && addressTimezone && (
                <>
                  You have modified the timezone manually. &nbsp;
                  <Link
                    href='#'
                    onClick={() => {
                      setEditTimezone(false)
                      setTimezone(addressTimezone)
                    }}
                  >
                    Revert to recommended timezone: {addressTimezone}
                  </Link>
                </>
              )}
            </Typography>
          </Box>
          <Box mt={2.0} display='flex' flexDirection='row' alignItems='center'>
            <Box mr={1.0}>
              <Button
                variant='contained'
                color='primary'
                size='small'
                disabled={addressTimezoneLoading || updating}
                onClick={() => {
                  dispatch(
                    updateSiteInfoRequested({
                      accountSlug: account,
                      siteSlug: site.slug,
                      name,
                      address,
                      latitude,
                      longitude,
                      timezone,
                      propagate: true,
                    }),
                  )
                  dispatch(setSiteUpdating(null))
                }}
              >
                Save
              </Button>
            </Box>
            <Box>
              <Button
                variant='contained'
                size='small'
                onClick={() => dispatch(setSiteUpdating(null))}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
