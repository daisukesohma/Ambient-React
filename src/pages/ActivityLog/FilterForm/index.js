import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch, batch } from 'react-redux'
import Grid from '@material-ui/core/Grid'
import FormLabel from '@material-ui/core/FormLabel'
import RadioGroup from '@material-ui/core/RadioGroup'
import Radio from '@material-ui/core/Radio'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import clsx from 'clsx'
import { map, first, last, isEmpty, includes } from 'lodash'
// src
import { Button, SearchableSelectDropdown } from 'ambient_ui'
import DateTimeRangePickerV3 from 'components/organisms/DateTimeRangePickerV3'
import StringUtility from 'utils/stringUtility'
import { InfoBoxTypeEnum } from 'enums/InfoBoxContentEnum'
import InfoBox from 'components/atoms/InfoBox'
import {
  ActivityTypeEnum,
  ActivityTypeToReadableEnum,
  SeverityToReadableTextEnum,
  SeverityTypeEnum,
} from 'enums'

import {
  applyFilter,
  getStreamsRequested,
  getSecurityProfilesRequested,
  setSubProp,
} from 'pages/ActivityLog/activityLogSlice'

import useStyles from './styles'

FilterForm.propTypes = {
  onCancel: PropTypes.func,
  accountSlug: PropTypes.string,
}

export default function FilterForm({ onCancel, accountSlug }) {
  const dispatch = useDispatch()
  const darkMode = useSelector(state => state.settings.darkMode)
  const activeFilter = useSelector(state => state.activityLog.activeFilter)
  const threatSignatures = useSelector(
    state => state.activityLog.threatSignatures,
  )
  const accessAlarmTypes = useSelector(
    state => state.activityLog.accessAlarmTypes,
  )
  const sites = useSelector(state => state.auth.sites)

  const classes = useStyles({ darkMode })

  const accessAlarmTypesOptions = map(accessAlarmTypes, value => ({
    value,
    label: value,
  }))

  const streamOptions = map(activeFilter.streams, ({ id, name }) => ({
    value: id,
    label: name,
  }))

  const threatSignatureOptions = map(threatSignatures, ({ id, name }) => ({
    value: id,
    label: name,
  }))

  const securityProfilesOptions = map(
    activeFilter.securityProfiles,
    ({ id, name }) => ({
      value: id,
      label: name,
    }),
  )

  const severityOptions = useMemo(() => {
    return map(SeverityTypeEnum, type => ({
      value: type,
      label: StringUtility.toTitleCase(SeverityToReadableTextEnum[type]),
    }))
  }, [])

  const handleAddFilter = () => {
    dispatch(applyFilter({ filter: activeFilter }))
    onCancel()
  }

  const siteOptions = useMemo(
    () =>
      map(sites, ({ id, name, slug, timezone }) => ({
        value: id,
        label: name,
        slug,
        timezone,
      })),
    [sites],
  )

  const timezone =
    activeFilter.selectedSites && activeFilter.selectedSites.length === 1
      ? activeFilter.selectedSites[0].timezone
      : Intl.DateTimeFormat().resolvedOptions().timeZone

  const isSecurityProfilesActive = includes(
    [ActivityTypeEnum.ProfileOverrideLogType],
    activeFilter.type,
  )
  const isStreamsActive = includes(
    [ActivityTypeEnum.AlertEventType, ActivityTypeEnum.AccessAlarmType],
    activeFilter.type,
  )

  const handleSitesChanges = selectedSites => {
    const siteSlugs = map(selectedSites, 'slug')
    batch(() => {
      dispatch(setSubProp({ selectedSites, siteSlugs }))
      const subParams = { accountSlug, siteSlugs, appointment: 'sub' }
      if (isStreamsActive) dispatch(getStreamsRequested(subParams))
      if (isSecurityProfilesActive)
        dispatch(getSecurityProfilesRequested(subParams))
    })
  }

  return (
    <Grid container spacing={4} className={classes.root}>
      <Grid container item lg={12} md={12} sm={12} xs={12}>
        <Typography className={clsx(classes.decoratedText, 'am-h5')}>
          Filters for {ActivityTypeToReadableEnum[activeFilter.type]}
        </Typography>
      </Grid>
      <div className={classes.divider}>
        <Divider />
      </div>

      <Grid item lg={12} md={12} sm={12} xs={12}>
        <FormControlLabel
          label='Enabled'
          classes={{ label: classes.decoratedText }}
          control={
            <Checkbox
              checked={activeFilter.active}
              onChange={() =>
                dispatch(setSubProp({ active: !activeFilter.active }))
              }
              classes={{ root: classes.decoratedText }}
            />
          }
        />
      </Grid>

      {activeFilter.active && (
        <>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <FormControlLabel
              label='Filter by separate date and sites'
              classes={{ label: classes.decoratedText }}
              control={
                <Checkbox
                  checked={activeFilter.activeCommon}
                  onChange={() =>
                    dispatch(
                      setSubProp({ activeCommon: !activeFilter.activeCommon }),
                    )
                  }
                  classes={{ root: classes.decoratedText }}
                />
              }
            />
          </Grid>

          {activeFilter.activeCommon && (
            <>
              <Grid item xs={12}>
                <DateTimeRangePickerV3
                  onChange={times => {
                    dispatch(
                      setSubProp({
                        startTs: first(times),
                        endTs: last(times),
                      }),
                    )
                  }}
                  startTs={activeFilter.startTs}
                  endTs={activeFilter.endTs}
                  darkMode={darkMode}
                  timezone={timezone}
                />
              </Grid>

              <Grid item xs={12}>
                <InfoBox type={InfoBoxTypeEnum.TIMEZONE_SUPPORT} />
              </Grid>

              <Grid item xs={12}>
                <SearchableSelectDropdown
                  placeholder='Filter by sites'
                  options={siteOptions}
                  onChange={handleSitesChanges}
                  value={activeFilter.selectedSites}
                  isMulti
                />
              </Grid>
            </>
          )}

          {isStreamsActive && !isEmpty(streamOptions) && (
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <SearchableSelectDropdown
                placeholder='Filter by streams'
                options={streamOptions}
                onChange={selectedStreams => {
                  dispatch(
                    setSubProp({
                      selectedStreams,
                      streamIds: map(selectedStreams, 'value'),
                    }),
                  )
                }}
                value={activeFilter.selectedStreams}
                isMulti
              />
            </Grid>
          )}

          {isStreamsActive && (
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <RadioGroup
                row
                aria-label='hasStream'
                name='hasStream'
                value={activeFilter.hasStream}
                onChange={(event, value) => {
                  let hasStream = null
                  if (value === 'true') hasStream = true
                  if (value === 'false') hasStream = false
                  dispatch(setSubProp({ hasStream }))
                }}
              >
                <FormControlLabel
                  value={null}
                  control={<Radio classes={{ root: classes.decoratedText }} />}
                  label='Both'
                  classes={{ label: classes.decoratedText }}
                />
                <FormControlLabel
                  value
                  control={<Radio classes={{ root: classes.decoratedText }} />}
                  label='With Streams'
                  classes={{ label: classes.decoratedText }}
                />
                <FormControlLabel
                  value={false}
                  control={<Radio classes={{ root: classes.decoratedText }} />}
                  label='Without Streams'
                  classes={{ label: classes.decoratedText }}
                />
              </RadioGroup>
            </Grid>
          )}

          {isSecurityProfilesActive && !isEmpty(securityProfilesOptions) && (
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <SearchableSelectDropdown
                placeholder='Filter by security profiles'
                options={securityProfilesOptions}
                onChange={selectedSecurityProfiles => {
                  dispatch(
                    setSubProp({
                      selectedSecurityProfiles,
                      securityProfileIds: map(
                        selectedSecurityProfiles,
                        'value',
                      ),
                    }),
                  )
                }}
                value={activeFilter.selectedSecurityProfiles}
                isMulti
              />
            </Grid>
          )}

          {includes([ActivityTypeEnum.AccessAlarmType], activeFilter.type) && (
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <SearchableSelectDropdown
                placeholder='Filter by Access Alarm Types'
                options={accessAlarmTypesOptions}
                onChange={selectedAccessAlarmTypes => {
                  dispatch(
                    setSubProp({
                      selectedAccessAlarmTypes,
                      accessAlarmTypes: map(selectedAccessAlarmTypes, 'value'),
                    }),
                  )
                }}
                value={activeFilter.selectedAccessAlarmTypes}
                isMulti
              />
            </Grid>
          )}

          {includes([ActivityTypeEnum.AlertEventType], activeFilter.type) && (
            <>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <SearchableSelectDropdown
                  placeholder='Filter by Threat Signatures'
                  options={threatSignatureOptions}
                  onChange={selectedThreatSignatures => {
                    dispatch(
                      setSubProp({
                        selectedThreatSignatures,
                        threatSignatureIds: map(
                          selectedThreatSignatures,
                          'value',
                        ),
                      }),
                    )
                  }}
                  value={activeFilter.selectedThreatSignatures}
                  isMulti
                />
              </Grid>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <SearchableSelectDropdown
                  placeholder='Filter by severities'
                  options={severityOptions}
                  onChange={selectedSeverities => {
                    dispatch(
                      setSubProp({
                        selectedSeverities,
                        severities: map(selectedSeverities, 'value'),
                      }),
                    )
                  }}
                  value={activeFilter.selectedSeverities}
                  isMulti
                />
              </Grid>
            </>
          )}

          {includes([ActivityTypeEnum.WorkShiftType], activeFilter.type) && (
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <FormLabel
                classes={{ root: classes.decoratedText }}
                component='legend'
              >
                Auth:
              </FormLabel>
              <RadioGroup
                row
                aria-label='auth'
                name='auth'
                value={activeFilter.signIn}
                onChange={(event, value) => {
                  let signIn = null
                  if (value === 'true') signIn = true
                  if (value === 'false') signIn = false
                  dispatch(setSubProp({ signIn }))
                }}
              >
                <FormControlLabel
                  value={null}
                  control={<Radio classes={{ root: classes.decoratedText }} />}
                  label='Both'
                  classes={{ label: classes.decoratedText }}
                />
                <FormControlLabel
                  value
                  control={<Radio classes={{ root: classes.decoratedText }} />}
                  label='Sign In'
                  classes={{ label: classes.decoratedText }}
                />
                <FormControlLabel
                  value={false}
                  control={<Radio classes={{ root: classes.decoratedText }} />}
                  label='Sign Out'
                  classes={{ label: classes.decoratedText }}
                />
              </RadioGroup>
            </Grid>
          )}
        </>
      )}

      <Grid item container lg={12} md={12} sm={12} xs={12} justify='flex-end'>
        <Button onClick={onCancel} className={classes.buttons}>
          Cancel
        </Button>
        <Button onClick={handleAddFilter} className={classes.buttons}>
          Save
        </Button>
      </Grid>
    </Grid>
  )
}
