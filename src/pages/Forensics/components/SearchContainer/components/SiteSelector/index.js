import React, { useEffect } from 'react'
import get from 'lodash/get'
import find from 'lodash/find'
import { useDispatch, useSelector, batch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { SearchableSelectDropdown } from 'ambient_ui'

import useForensicData from '../../../../hooks/useForensicData'
import {
  regionsFetchRequested,
  streamsBySiteFetchRequested,
  selectTimezone,
} from '../../../../../../redux/forensics/actions'
import dropDownOptions from '../../../../../../selectors/sites/dropDownOptions'
import useStyles from './styles'
import useGlobalSelectedSite from 'common/hooks/useGlobalSelectedSite'

function SiteSelector() {
  const classes = useStyles()
  const dispatch = useDispatch()
  const { account } = useParams()
  const siteOptions = useSelector(
    dropDownOptions([state => get(state, 'forensics.sites', [])]),
  )
  const [fetchRegionStats, fetchEntities] = useForensicData()
  const [globalSelectedSite, setGlobalSelectedSite] = useGlobalSelectedSite()

  // set default Site if no site selected
  useEffect(() => {
    if (!globalSelectedSite && siteOptions.length > 0) {
      setGlobalSelectedSite(siteOptions[0].value)
      dispatch(selectTimezone(siteOptions[0].timezone))
    }
  }, [siteOptions, dispatch, globalSelectedSite])

  const handleSiteChange = e => {
    const siteSlug = e.value
    batch(() => {
      setGlobalSelectedSite(siteSlug)
      dispatch(selectTimezone(e.timezone))
      dispatch(regionsFetchRequested({ accountSlug: account, siteSlug }))
      dispatch(
        streamsBySiteFetchRequested({
          accountSlug: account,
          siteSlug,
        }),
      )
      fetchRegionStats({ siteSlug })
      fetchEntities({ siteSlug })
    })
  }

  return (
    <div id='forensics-siteSelector'>
      <SearchableSelectDropdown
        options={siteOptions}
        value={find(siteOptions, { value: globalSelectedSite })}
        onChange={handleSiteChange}
        classOverride={classes.siteSelector}
      />
    </div>
  )
}

export default SiteSelector
