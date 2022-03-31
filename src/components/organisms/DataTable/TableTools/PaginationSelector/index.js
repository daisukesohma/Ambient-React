import React from 'react'
import clsx from 'clsx'
import { useTheme } from '@material-ui/core/styles'
import { SearchableSelectDropdown } from 'ambient_ui'
import PropTypes from 'prop-types'

import { defaultPaginationOptions, generateItems } from '../data'

import useStyles from './styles'

function PaginationSelector({
  darkMode,
  defaultRows,
  handleSelect,
  paginationOptions,
  title,
}) {
  const { palette } = useTheme()
  const classes = useStyles({ darkMode })
  const paginationMenuItems = generateItems(paginationOptions)

  return (
    <div className={classes.root}>
      <div className={clsx('am-subtitle1', classes.controllerText)}>
        {title}
      </div>
      <div className={classes.paginationOptions}>
        <SearchableSelectDropdown
          options={paginationMenuItems}
          styles={{
            menu: provided => ({
              ...provided,
              boxShadow: '0px 1px 4px rgba(34, 36, 40, 0.05)',
              zIndex: 20,
              borderRadius: 0,
              margin: 0,
              cursor: 'pointer',
              background: darkMode ? palette.grey[800] : palette.grey[50],
            }),
            option: provided => ({
              ...provided,
              background: darkMode ? palette.grey[800] : palette.grey[50],
              color: darkMode ? palette.common.white : palette.common.black,
              border: `1px solid ${palette.grey[darkMode ? 700 : 100]}`,
              fontSize: 14, // am-subtitle2
            }),
            control: provided => {
              return {
                ...provided,
                background: darkMode ? palette.grey[800] : palette.grey[50],
                borderRadius: 4,
                border: darkMode ? `1px solid ${palette.grey[700]}` : 'none',
                boxShadow: 'none',
                padding: 0,
                '&:hover': {
                  border: darkMode ? `1px solid ${palette.grey[700]}` : 'none',
                  boxShadow: 'none',
                },
                cursor: 'pointer',
              }
            },
            valueContainer: provided => ({
              ...provided,
              minWidth: 48,
              cursor: 'pointer',
            }),
            singleValue: () => ({
              color: darkMode ? palette.common.white : palette.common.black,
              fontSize: 14, // am-subtitle2
            }),
          }}
          isSearchable={false}
          defaultValue={paginationMenuItems.find(o => o.value === defaultRows)}
          onChange={({ value }) => handleSelect(value)}
        />
      </div>
    </div>
  )
}

PaginationSelector.defaultProps = {
  darkMode: false,
  defaultRows: 10,
  handleSelect: () => {},
  paginationOptions: defaultPaginationOptions,
  title: '',
}

PaginationSelector.propTypes = {
  darkMode: PropTypes.bool,
  defaultRows: PropTypes.number,
  handleSelect: PropTypes.func,
  paginationOptions: PropTypes.arrayOf(PropTypes.number),
  title: PropTypes.string,
}

export default PaginationSelector
