import React from 'react'
import PropTypes from 'prop-types'
import { SearchableSelectDropdown } from 'ambient_ui'

import useSiteData from './hooks/useSiteData'

const SiteSelector = ({ classOverride }) => {
  const { siteOptions, handleSiteSelection, selectedSite } = useSiteData()

  return (
    <SearchableSelectDropdown
      id='cameras-siteSelector'
      classOverride={classOverride}
      options={siteOptions}
      value={siteOptions.find(item => item.value === selectedSite)}
      onChange={handleSiteSelection}
    />
  )
}

SiteSelector.propTypes = {
  classOverride: PropTypes.string,
}

SiteSelector.defaultProps = {
  classOverride: null,
}

export default SiteSelector
