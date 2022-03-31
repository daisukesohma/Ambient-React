import React from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import Select from 'react-select'
import { useQuery } from '@apollo/react-hooks'
import get from 'lodash/get'
import map from 'lodash/map'
import find from 'lodash/find'
import isNumber from 'lodash/isNumber'
import clsx from 'clsx'

import { GET_THREAT_SIGNATURES } from './gql'

const propTypes = {
  onChange: PropTypes.func,
  selected: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
}

const ThreatSignatureSearch = ({ onChange, selected }) => {
  const darkMode = useSelector(state => state.settings.darkMode)

  const { data } = useQuery(GET_THREAT_SIGNATURES)

  const options = map(get(data, 'allThreatSignatures', []), item => ({
    label: item.name,
    value: item.id,
  }))

  const value = isNumber(selected)
    ? find(options, { value: selected })
    : selected

  return (
    <Select
      isClearable
      onChange={onChange}
      value={value}
      darkMode={darkMode}
      options={options}
      placeholder={<div className={clsx('am-body1')}>Threat Signatures...</div>}
      // formatOptionLabel={formatOptionLabel}
      // theme={customTheme}
    />
  )
}

ThreatSignatureSearch.propTypes = propTypes

export default ThreatSignatureSearch
