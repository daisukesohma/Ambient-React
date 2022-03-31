import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SearchableSelectDropdown } from 'ambient_ui'
import { find, some, isEmpty } from 'lodash'
// src
import {setActiveSiteId, resetActiveStream } from 'features/StreamConfiguration/streamConfigurationSlice'
import dropDownOptions from 'selectors/sites/dropDownOptions'
import useGlobalSelectedSite from 'common/hooks/useGlobalSelectedSite'

export default function SiteSelector() {
  const dispatch = useDispatch()
  const sites = useSelector(state => state.streamConfiguration.sites)
  const siteOptions = useSelector(
    dropDownOptions([state => state.streamConfiguration.sites]),
  )
  // TODO: can replace this with activeSiteId
  const [globalSelectedSite, setGlobalSelectedSite] = useGlobalSelectedSite()

  // set default Site if no site selected
  // or account doest have global selected site
  useEffect(() => {
    if (
      !isEmpty(siteOptions) &&
      (!globalSelectedSite || !some(sites, ['slug', globalSelectedSite]))
    ) {
      setGlobalSelectedSite(siteOptions[0].value)
    }
  }, [siteOptions, dispatch, globalSelectedSite, sites])

  const handleSiteChange = e => {
    const siteSlug = e.value
    setGlobalSelectedSite(siteSlug)
    dispatch(setActiveSiteId({ activeSiteId: e.id }))
    dispatch(resetActiveStream())
  }

  return (
    <div id='forensics-siteSelector' style={{ width: 200 }}>
      <SearchableSelectDropdown
        options={siteOptions}
        value={find(siteOptions, { value: globalSelectedSite })}
        onChange={handleSiteChange}
      />
    </div>
  )
}
