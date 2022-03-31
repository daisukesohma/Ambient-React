import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import PropTypes from 'prop-types'
import { SearchableSelectDropdown } from 'ambient_ui'

import { GET_ACCOUNT_SITES } from '../../data/gql'

const SiteSelector = ({ accountSlug, onChange }) => {
  const { data } = useQuery(GET_ACCOUNT_SITES, {
    variables: {
      accountSlug,
    },
  })

  const options = data
    ? data.allSites.map(site => {
        return {
          value: site.id,
          label: site.name,
        }
      })
    : []

  return (
    <SearchableSelectDropdown
      options={options}
      onChange={onChange}
      defaultValue={options && options[0]}
    />
  )
}

SiteSelector.propTypes = {
  accountSlug: PropTypes.string,
  onChange: PropTypes.func,
}

export default SiteSelector
