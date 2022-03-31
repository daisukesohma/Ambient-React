import React, { useEffect } from 'react'
import Grid from '@material-ui/core/Grid'
import { isMobile } from 'react-device-detect'
import { useSelector, useDispatch } from 'react-redux'
import { SearchableSelectDropdown } from 'ambient_ui'
import get from 'lodash/get'
import find from 'lodash/find'
import map from 'lodash/map'
// src
import DateTimeRangePickerV3 from 'components/organisms/DateTimeRangePickerV3'
import useGlobalSelectedSite from 'common/hooks/useGlobalSelectedSite'
import { MixPanelEventEnum } from 'enums'
import useMixpanel from 'mixpanel/hooks/useMixpanel'
import SubscriptionSelection from '../../SubscriptionSelection'
import { changeDateFilter } from '../../../../../redux/reports/actions'

import { useStyles } from './styles'

const ToolRow = () => {
  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({ isMobile })
  const dispatch = useDispatch()
  const profileId = useSelector(state => get(state, 'auth.profile.id'))
  const sites = useSelector(state => get(state, 'reports.sites', []))
  const [globalSelectedSite, setGlobalSelectedSite] = useGlobalSelectedSite(
    true,
  )
  const startTs = useSelector(state => get(state, 'reports.startTs'))
  const endTs = useSelector(state => get(state, 'reports.endTs'))

  const handleChangeSite = value => {
    const newSlug = get(value, 'value')

    // we have useEffect inside Dropdown component
    // whenever dropdown menu props are changed, it will re-render this parent component
    // and it will re-create dropdown menu component again so we need to prevent infinite-loop
    if (globalSelectedSite !== newSlug) {
      setGlobalSelectedSite(newSlug)
    }
  }

  const siteOptions = [
    {
      label: 'All Sites',
      value: null,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  ].concat(
    map(sites, site => ({
      label: site.name,
      value: site.slug,
      timezone: site.timezone,
    })),
  )

  const selectedSiteOption = find(siteOptions, { value: globalSelectedSite })
  const timezone = get(selectedSiteOption, 'timezone', siteOptions[0].timezone)

  const handleChangeTimeRange = value => {
    dispatch(
      changeDateFilter({
        startTs: value[0],
        endTs: value[1],
      }),
    )
  }

  useMixpanel(
    MixPanelEventEnum.SECURITY_OPERATIONAL_REPORT_SITE_FILTER_UPDATE,
    { siteSlug: globalSelectedSite || 'All Sites' },
    [globalSelectedSite],
  )

  return (
    <Grid
      item
      sm={12}
      xs={12}
      md={12}
      lg={12}
      xl={12}
      className={classes.toolContainer}
    >
      <div className={classes.toolInnerContainer}>
        <div className={classes.toolMainContainer}>
          <div className={classes.topBarItem}>
            <SearchableSelectDropdown
              id='am-siteSelector'
              options={siteOptions}
              value={selectedSiteOption}
              onChange={handleChangeSite}
              classOverride={classes.siteSelector}
            />
          </div>
          <div className={classes.dateWrapper}>
            <DateTimeRangePickerV3
              onChange={handleChangeTimeRange}
              startTs={startTs}
              endTs={endTs}
              darkMode={darkMode}
              timezone={timezone}
            />
          </div>
          <div className={classes.topBarItem}>
            <SubscriptionSelection profileId={profileId} />
          </div>
        </div>
      </div>
    </Grid>
  )
}

export default ToolRow
