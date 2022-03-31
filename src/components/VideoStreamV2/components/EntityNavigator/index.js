import React, { useEffect, useState } from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { SearchableSelectDropdown } from 'ambient_ui'
import moment from 'moment'

import Tooltip from 'components/Tooltip'

import { getOptionsFromData } from './utils'
import PlaceholderTitle from './PlaceholderTitle'
import IndicatorsContainer from './IndicatorsContainerCustom'

moment.fn.fromNowOrNow = a => {
  // 3 seconds before or after now
  if (Math.abs(moment().diff(this)) < 3000) return 'just now'

  return this.fromNow(a)
}

const EntityNavigator = ({ darkMode, data, handleClick, selectedEntities }) => {
  const { palette } = useTheme()
  // process data into Select option format
  const [options, setOptions] = useState() // format for displaying Select options

  useEffect(() => {
    if (data) {
      const newOptions = getOptionsFromData(data)
      setOptions(newOptions)
    }
    // if search box is cleared, clear results
    if (selectedEntities && selectedEntities.length === 0) {
      clearSearchBox()
    }
  }, [data, selectedEntities])

  const clearSearchBox = () => setOptions()

  // check for any results
  const resultCount = data && options && data.length
  const hasResults = resultCount && resultCount > 0

  // error handling
  if (hasResults && resultCount === 0) {
    return <div>No events found today.</div>
  }
  if (!hasResults) {
    return <div />
  }

  const placeholder = data && (
    <PlaceholderTitle darkMode={darkMode} text={`${resultCount} events`} />
  )

  return (
    <Tooltip content='Select event to play'>
      <div style={{ cursor: 'pointer', width: '100%' }}>
        {hasResults && options && (
          <SearchableSelectDropdown
            components={{
              IndicatorsContainer,
            }}
            onChange={option => handleClick(option.value)}
            options={options}
            placeholder={placeholder}
            styles={{
              control: (provided, state) => {
                const { darkMode } = state.selectProps
                return {
                  backgroundColor: darkMode
                    ? palette.common.black
                    : 'hsl(0,0%,100%)',
                  border: 'none',
                  borderColor: darkMode ? palette.grey[800] : 'hsl(0,0%,80%)',
                  boxSizing: 'border-box',
                  cursor: 'default',
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  outline: '0 !important',
                  position: 'relative',
                  transition: 'all 100ms',
                  width: 175,
                }
              },
              menu: (provided, state) => ({
                ...provided,
                marginLeft: -14,
                marginRight: 0,
                width: 175,
                zIndex: 20,
              }),
              input: styles => ({
                ...styles,
                width: 75,
              }),
              option: styles => ({
                ...styles,
                padding: 4,
              }),
              container: styles => ({
                ...styles,
                cursor: 'pointer',
              }),
            }}
          />
        )}
      </div>
    </Tooltip>
  )
}

EntityNavigator.defaultProps = {
  darkMode: false,
  data: undefined,
  handleClick: () => {},
  selectedEntities: [],
}
EntityNavigator.propTypes = {
  darkMode: PropTypes.bool,
  data: PropTypes.array,
  handleClick: PropTypes.func,
  selectedEntities: PropTypes.array,
}

export default EntityNavigator
