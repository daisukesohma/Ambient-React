import React, { useState, useEffect, useRef } from 'react'
import clsx from 'clsx'
import { Button, SearchableSelectDropdown } from 'ambient_ui'
import { useSelector, useDispatch } from 'react-redux'
import get from 'lodash/get'
import find from 'lodash/find'
import { useParams } from 'react-router-dom'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
// src
import useGlobalSelectedSite from 'common/hooks/useGlobalSelectedSite'
import ConfirmDialog from 'components/ConfirmDialog'
import { useFlexStyles } from 'common/styles/commonStyles'
import { Can } from 'rbac'
import Tooltip from 'components/Tooltip'
import './index.css'
import securityProfilesWithColors from 'selectors/securityProfiles/securityProfilesWithColors'
import {
  securityProfileScheduleFetchRequested,
  securityProfileScheduleUpdateRequested,
} from 'redux/securityProfileSchedule/actions'
import PageTitle from 'components/Page/Title'
import {
  securityProfilesFetchRequested,
  fetchSitesRequested,
} from 'redux/threatEscalation/actions'
import dropDownOptions from 'selectors/sites/dropDownOptions'

import WeeklyScheduler from './WeeklyScheduler'
import LoadingScreen from '../../../LoadingScreen'

const MINUTES_IN_CELL = 30

const SecurityProfileScheduler = () => {
  const flexClasses = useFlexStyles()
  const { account } = useParams()
  const dispatch = useDispatch()
  const [globalSelectedSite, setGlobalSelectedSite] = useGlobalSelectedSite()

  const securityProfileListLoading = useSelector(state =>
    get(state, 'threatEscalation.loading'),
  )
  const securityProfileList = useSelector(securityProfilesWithColors)
  const sites = useSelector(state => state.threatEscalation.sites)
  const siteOptions = useSelector(
    dropDownOptions([state => state.threatEscalation.sites]),
  )
  const selectedSiteTimezone = get(
    find(sites, { slug: globalSelectedSite }),
    'timezone',
  )

  const securityProfileScheduleLoading = useSelector(state =>
    get(state, 'securityProfileSchedule.loading'),
  )
  const securityProfileScheduleUpdateLoading = useSelector(
    state => state.securityProfileSchedule.updateLoading,
  )
  const securityProfileSchedule = useSelector(
    state => state.securityProfileSchedule.collection,
  )
  const [currentSchedule, setCurrentSchedule] = useState(null)
  const scheduler = useRef(null)

  const loading = securityProfileListLoading || securityProfileScheduleLoading
  const [cancelModalOpened, setCancelModalOpened] = useState(false)

  useEffect(() => {
    dispatch(fetchSitesRequested({ accountSlug: account }))
  }, [dispatch, account])

  useEffect(() => {
    if (globalSelectedSite) {
      dispatch(
        securityProfileScheduleFetchRequested({
          accountSlug: account,
          siteSlug: globalSelectedSite,
        }),
      )
      dispatch(
        securityProfilesFetchRequested({
          accountSlug: account,
          siteSlug: globalSelectedSite,
        }),
      )
    }
    // eslint-disable-next-line
  }, [account, globalSelectedSite, dispatch])

  useEffect(() => {
    if (!securityProfileScheduleUpdateLoading) {
      setCurrentSchedule(
        translateToScheduleFormat(
          securityProfileSchedule,
          securityProfileList,
        ) || null,
      )
    }
  }, [
    securityProfileSchedule,
    securityProfileList,
    securityProfileScheduleUpdateLoading,
  ])

  const handleSiteChange = e => {
    setGlobalSelectedSite(e.value)
  }

  // takes in a array of ProfileTimes and creates a schedule
  // If a schedule is not complete (ie. does not start at 0 and end at 86,400 each day, does not have every day of the week, does not have complete blocks) returns false
  const translateToScheduleFormat = (
    arrProfileTimes,
    newSecurityProfileList,
  ) => {
    if (arrProfileTimes.length === 0) {
      return false
    }
    // separate array of ProfileTimes by day, create an array of events for each day
    const result = []
    let currDayProfileTimes
    // there are 7 days of the week
    for (let i = 0; i < 7; i++) {
      const daySchedule = []
      currDayProfileTimes = arrProfileTimes.filter(
        profileTime => profileTime.day === i,
      )

      // check to make sure first profiletime has start_secs at 0 and last profiletime end_secs at 86,400 to be valid schedule
      if (
        currDayProfileTimes[0].startSecs !== 0 ||
        currDayProfileTimes[currDayProfileTimes.length - 1].endSecs !== 86400
      ) {
        return false
      }

      // get number of 15 min blocks
      for (let j = 0; j < currDayProfileTimes.length; j++) {
        const secDiff =
          currDayProfileTimes[j].endSecs - currDayProfileTimes[j].startSecs
        const numBlocks = secDiff / (60 * MINUTES_IN_CELL)
        for (let k = 0; k < numBlocks; k++) {
          const idx = newSecurityProfileList
            .map(securityProfile => securityProfile.id)
            .indexOf(currDayProfileTimes[j].securityProfile.id)
          if (idx !== -1) {
            const newBlock = {
              event: currDayProfileTimes[j].securityProfile.name,
              id: currDayProfileTimes[j].securityProfile.id,
              color: newSecurityProfileList[idx].color,
            }
            daySchedule.push(newBlock)
          }
        }
      }
      // check to make sure there are 86400 seconds in a day so must be 86400/mins = # of blocks to be valid schedule
      if (daySchedule.length !== 86400 / (60 * MINUTES_IN_CELL)) {
        return false
      }
      result.push(daySchedule)
    }

    return result
  }

  const handleSaveButton = () => {
    // TODO: make post API call to post new schedule to backend to save
    const newStateArr = scheduler.current.state.days

    const resObjArr = []
    let memo = {}
    for (let i = 0; i < newStateArr.length; i++) {
      for (let j = 0; j < newStateArr[i].length; j++) {
        if (memo.securityProfileId !== newStateArr[i][j].id) {
          if (memo.securityProfileName) {
            resObjArr.push(memo)
          }
          memo = {
            securityProfileName: newStateArr[i][j].event,
            securityProfileId: newStateArr[i][j].id,
            startSecs: j * MINUTES_IN_CELL * 60, // start will be in seconds
            endSecs: (j + 1) * MINUTES_IN_CELL * 60,
            day: i,
          }
        } else {
          memo.endSecs = (j + 1) * MINUTES_IN_CELL * 60
        }
      }
      resObjArr.push(memo)
      memo = {}
    }

    dispatch(
      securityProfileScheduleUpdateRequested({
        accountSlug: account,
        siteSlug: globalSelectedSite,
        schedule: resObjArr,
      }),
    )
  }

  const handleCancelButton = () => {
    setCurrentSchedule(
      translateToScheduleFormat(securityProfileSchedule, securityProfileList) ||
        null,
    )
  }
  const placeholder = loading ? null : (
    <WeeklyScheduler
      defaultEvent={
        securityProfileList.length > 0 ? securityProfileList[0] : null
      }
      selectedEvent={
        securityProfileList.length > 0 ? securityProfileList[0] : null
      }
      events={securityProfileList}
      legendTitle='Security Profiles:'
      ref={scheduler}
      currentSchedule={currentSchedule}
      minutesInCell={MINUTES_IN_CELL}
    />
  )
  const buttonText = loading ? 'Loading' : 'Save'
  const darkMode = useSelector(state => state.settings.darkMode)

  return (
    <div className='security-profile-scheduler'>
      <div style={{ marginBottom: 8 }}>
        <PageTitle title='Security Profile Scheduler' darkMode={darkMode} />
      </div>
      <SearchableSelectDropdown
        options={siteOptions}
        value={find(siteOptions, { value: globalSelectedSite })}
        onChange={handleSiteChange}
      />
      <Box mt={0.5} ml={1.0}>
        {globalSelectedSite && (
          <Typography variant='caption'>
            This schedule follows the {selectedSiteTimezone} timezone.
          </Typography>
        )}
      </Box>
      <div>{placeholder}</div>
      {!securityProfileListLoading && !securityProfileScheduleLoading ? (
        <div className={clsx(flexClasses.row, flexClasses.centerEnd)}>
          <Tooltip content='Cancel Changes'>
            <Button
              variant='text'
              color='primary'
              disabled={loading}
              onClick={() => setCancelModalOpened(true)}
              className='btn btn-primary'
              style={{ marginRight: 16 }}
            >
              Cancel
            </Button>
          </Tooltip>

          <ConfirmDialog
            open={cancelModalOpened}
            onClose={() => {
              setCancelModalOpened(false)
            }}
            onConfirm={() => {
              handleCancelButton()
              setCancelModalOpened(false)
            }}
            loading={loading}
            content='Are you sure you want to discard current changes? This cannot be undone.'
          />

          <Can I='update' on='Escalations' passThrough>
            {can => (
              <Tooltip
                content={
                  can
                    ? 'Save Security Profile Schedule'
                    : 'Insufficient permissions to update schedule'
                }
              >
                <Button
                  disabled={loading || !can}
                  onClick={handleSaveButton}
                  className='btn btn-primary'
                >
                  {buttonText}
                </Button>
              </Tooltip>
            )}
          </Can>
        </div>
      ) : (
        <LoadingScreen />
        // <Skeleton />
      )}
    </div>
  )
}

export default SecurityProfileScheduler
