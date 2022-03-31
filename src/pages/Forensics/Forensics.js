import React, { useEffect } from 'react'
import clsx from 'clsx'
import { Grid } from '@material-ui/core'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector, batch } from 'react-redux'
import { isMobileOnly } from 'react-device-detect'
import { useFlexStyles } from 'common/styles/commonStyles'
import { DEFAULT_TIMEZONE } from 'utils/dateTime/formatTimeWithTZ'
import trackEventToMixpanel from 'mixpanel/utils/trackEventToMixpanel'
import { MixPanelEventEnum } from 'enums'
import find from 'lodash/find'
import get from 'lodash/get'

import {
  regionsFetchRequested,
  sitesFetchRequested,
  streamsBySiteFetchRequested,
  selectTimezone,
} from '../../redux/forensics/actions'

import ForensicsGraph from './components/ForensicsGraph'
import SearchContainer from './components/SearchContainer'
import ForensicsSearchResult from './components/ForensicsSearchResult'
import ForensicsInitialSearchRecommendation from './components/ForensicsInitialSearchRecommendation'
import FineGrainDateTimeSelection from './components/FineGrainDateTimeSelection'
import useStyles from './styles'
import useGlobalSelectedSite from 'common/hooks/useGlobalSelectedSite'

export default function Forensics() {
  const { account } = useParams()
  const flexClasses = useFlexStyles()
  const dispatch = useDispatch()
  const sites = useSelector(state => state.forensics.sites)
  const sideBarOpened = useSelector(state => state.settings.sideBarOpened)
  const loading = useSelector(state => state.forensics.loadingSearch)
  const pages = useSelector(state => state.forensics.searchPages)
  const classes = useStyles({ sideBarOpened, isMobileOnly })
  const [globalSelectedSite] = useGlobalSelectedSite()

  useEffect(() => {
    dispatch(sitesFetchRequested(account))
    trackEventToMixpanel(MixPanelEventEnum.FORENSICS_ENTER)

    return function cleanup() {
      trackEventToMixpanel(MixPanelEventEnum.FORENSICS_EXIT)
    }
  }, [dispatch, account])

  useEffect(() => {
    if (globalSelectedSite) {
      const timezone = get(
        find(sites, { slug: globalSelectedSite }),
        'timezone',
        DEFAULT_TIMEZONE,
      )
      batch(() => {
        dispatch(selectTimezone(timezone))
        dispatch(
          regionsFetchRequested({
            accountSlug: account,
            siteSlug: globalSelectedSite,
          }),
        )
        dispatch(
          streamsBySiteFetchRequested({
            accountSlug: account,
            siteSlug: globalSelectedSite,
          }),
        )
      })
    } else {
      dispatch(selectTimezone(DEFAULT_TIMEZONE))
    }
  }, [dispatch, globalSelectedSite, account])

  return (
    <>
      <Grid container className={classes.root} id='forensics-root'>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <Grid
            container
            className={clsx(classes.maxHeight, classes.blackBackground)}
          >
            <SearchContainer />
          </Grid>
        </Grid>
        {!loading && !pages ? (
          <Grid
            item
            lg={12}
            md={12}
            sm={12}
            xs={12}
            className={clsx(classes.maxHeight, classes.searchRecommendation)}
          >
            <ForensicsInitialSearchRecommendation />
          </Grid>
        ) : (
          <div
            className={clsx(
              isMobileOnly ? flexClasses.column : flexClasses.row,
              classes.maxHeight,
              classes.mainContainer,
            )}
          >
            {!isMobileOnly && (
              <Grid
                item
                xs={9}
                sm={9}
                md={9}
                lg={9}
                xl={9}
                className={clsx(classes.maxHeight, classes.leftContainer)}
              >
                <FineGrainDateTimeSelection />
                <ForensicsGraph />
              </Grid>
            )}
            <Grid
              item
              xs={4}
              sm={4}
              md={5}
              lg={5}
              xl={5}
              className={clsx(classes.maxHeight, classes.rightContainer)}
            >
              <ForensicsSearchResult />
            </Grid>
          </div>
        )}
      </Grid>
    </>
  )
}
