import React, { useMemo, useRef, useState } from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import Select from 'react-select'
import { isMobile } from 'react-device-detect'
import { SizeMe } from 'react-sizeme'

import IndicatorsContainer from './IndicatorsContainerCustom'
import MenuList from './MenuListCustom'
import MenuCustom from './MenuCustom'
import MultiValueContainerCustom from './MultiValueContainerCustom'
import NoOptionsMessageCustom from './NoOptionsMessageCustom'
import OptionCustom from './OptionCustom'
import ValueContainer from './ValueContainerCustom'
import './index.css'

const EntitySearch = ({
  darkMode,
  entitySelectorOptions,
  handleEntitySelection,
  selectedEntities,
  selectProps,
}) => {
  const { palette } = useTheme()
  const [containerWidth, setContainerWidth] = useState(0)
  const [options, setOptions] = useState([])
  const selectRef = useRef(null)
  const clearEntities = () => handleEntitySelection([])
  // useMemo to only calculate values once
  useMemo(() => {
    const entityOptionsSelectFormat = Array.isArray(entitySelectorOptions)
      ? entitySelectorOptions.map((entity, i) => {
          return {
            label: entity.name,
            value: entity.id,
            idx: i,
            type: entity.type || 'entity',
          }
        })
      : []
    setOptions(entityOptionsSelectFormat)
  }, [entitySelectorOptions])

  const customStyles = {
    container: (provided, state) => {
      const { menuIsOpen } = state.selectProps
      // maintains clean white space under the control
      if (menuIsOpen) {
        return {
          ...provided,
          paddingBottom: 0,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }
      }

      return {
        ...provided,
        paddingBottom: 64, // menu bottom: 24 + height: 32 + 8 = 64
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }
    },
    // text input search box
    control: () => ({
      // none of react-select's styles are passed to <Control />
      width: isMobile ? 'calc(60vw)' : '40%',
      minWidth: isMobile ? 250 : 600,
      marginBottom: 6,
      alignItems: 'center',
      backgroundColor: 'hsl(0,0%,100%)',
      borderColor: 'hsl(0,0%,80%)',
      borderRadius: 4,
      borderStyle: 'solid',
      borderWidth: 1,
      cursor: 'default',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      minHeight: 38,
      outline: '0 !important',
      position: 'relative',
      transition: 'all 100ms',
      boxSizing: 'border-box',
    }),
    // Menu - add padding and make it below, not absolutely positioned on top
    // holds the search options / results
    menu: (provided, state) => {
      const { containerWidth } = state.selectProps.styleState
      return {
        position: 'relative',
        marginBottom: 8,
        maxWidth: containerWidth,
        width: isMobile ? 'calc(60vw)' : null,
        minWidth: isMobile ? 250 : 600,
        overflowX: 'scroll',
      }
    },
    // MenuList will now render row direction
    menuList: (provided, state) => ({
      ...provided,
      display: 'flex',
      flexDirection: 'row',
    }),
  }

  const customDarkStyles = {
    control: () => ({
      // none of react-select's styles are passed to <Control />
      width: isMobile ? 'calc(60vw)' : '40%',
      minWidth: isMobile ? 250 : 600,
      marginBottom: 6,
      alignItems: 'center',
      backgroundColor: palette.common.black,
      borderColor: 'hsl(0,0%,35%)',
      borderRadius: 4,
      borderStyle: 'solid',
      borderWidth: 1,
      cursor: 'default',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      minHeight: 38,
      outline: '0 !important',
      position: 'relative',
      transition: 'all 100ms',
      boxSizing: 'border-box',
    }),
    input: () => ({
      color: palette.common.white,
    }),
  }

  // Custom Components for react-select
  // https://react-select.com/components#replacing-components
  // https://react-select.com/props#select-props
  const Option = props => {
    return (
      <OptionCustom
        {...props}
        selectedEntities={selectedEntities}
        darkMode={darkMode}
      />
    )
  }

  const Menu = props => {
    return <MenuCustom {...props} darkMode={darkMode} />
  }

  const NoOptionsMessage = props => {
    return (
      <NoOptionsMessageCustom
        {...props}
        onClick={clearEntities}
        darkMode={darkMode}
      />
    )
  }
  const MultiValueContainer = props => {
    return (
      <MultiValueContainerCustom
        {...props}
        clearEntities={clearEntities}
        darkMode={darkMode}
      />
    )
  }

  const SearchableSelectDropdownStyles = darkMode
    ? { ...customStyles, ...customDarkStyles } // override dark style
    : customStyles

  const searchPlaceholder = <div style={{ cursor: 'text' }}>Search</div>

  // for use with react-onclickoutside. This class ignores the onclick handler
  // which caused clicks to not be detected here in EntitySearch
  // https://www.npmjs.com/package/react-onclickoutside#marking-elements-as-skip-over-this-one-during-the-event-loop
  const entitySearchClass = 'ignore-react-onclickoutside'

  return (
    <SizeMe>
      {({ size }) => {
        if (size && size.width && size.width !== containerWidth) {
          setContainerWidth(size.width + 50)
        }

        return (
          <div id='entity-search' className={entitySearchClass}>
            <Select
              autoFocus
              options={options}
              value={selectedEntities}
              onChange={handleEntitySelection}
              isMulti
              menuIsOpen
              styles={SearchableSelectDropdownStyles}
              placeholder={searchPlaceholder}
              ref={selectRef}
              components={{
                IndicatorsContainer,
                MenuList,
                MultiValueContainer,
                NoOptionsMessage,
                Option,
                ValueContainer,
                Menu,
              }}
              styleState={{ containerWidth }}
              {...selectProps}
            />
          </div>
        )
      }}
    </SizeMe>
  )
}

EntitySearch.defaultProps = {
  darkMode: false,
  entitySelectorOptions: [],
  handleEntitySelection: () => {},
  selectedEntities: [],
  selectProps: {},
}

EntitySearch.propTypes = {
  darkMode: PropTypes.bool,
  entitySelectorOptions: PropTypes.array,
  handleEntitySelection: PropTypes.func,
  selectedEntities: PropTypes.array,
  selectProps: PropTypes.object,
}

export default EntitySearch
