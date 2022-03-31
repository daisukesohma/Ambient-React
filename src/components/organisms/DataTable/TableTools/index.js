import React from 'react'
import PropTypes from 'prop-types'
import { Button, SearchBar } from 'ambient_ui'
import { CSVLink } from 'react-csv'

import PaginationSelector from './PaginationSelector'
import FilterOptions from './FilterOptions'
import useStyles from './styles'
import TableInfo from './TableInfo'

const TableTools = ({
  additionalTools,
  darkMode,
  defaultRowsPerPage,
  downloadableData,
  filterOptions,
  isDownloadable,
  downloadableFileName,
  isPaginated,
  isSearchable,
  onChangeRowsPerPage,
  onSearch,
  searchText,
  tableData,
  isCountVisible,
}) => {
  const classes = useStyles()
  const getCsvHeaders = columns => {
    return columns.map(c => ({
      label: c.title,
      key: c.field,
    }))
  }

  return (
    <div className={classes.controller}>
      <div className={classes.leftController}>
        {isSearchable && (
          <span className={classes.searchContainer}>
            <SearchBar
              onChange={onSearch}
              isClearShown
              value={searchText}
              darkMode={darkMode}
            />
          </span>
        )}
        {isCountVisible && (
          <span className={classes.tableInfoContainer}>
            <TableInfo data={tableData} />
          </span>
        )}
      </div>
      <div className={classes.rightController}>
        {!!additionalTools && additionalTools}
        {filterOptions && (
          <div className={classes.flexContainer}>
            <FilterOptions options={filterOptions} />
          </div>
        )}
        {isPaginated && (
          <PaginationSelector
            darkMode={darkMode}
            title='Show'
            defaultRows={defaultRowsPerPage}
            handleSelect={onChangeRowsPerPage}
          />
        )}
        {isDownloadable && (
          <>
            <CSVLink
              data={downloadableData}
              headers={getCsvHeaders(tableData.columns)}
              filename={downloadableFileName}
              className={classes.downloadLink}
            >
              <Button variant='contained' color='primary'>
                Download
              </Button>
            </CSVLink>
          </>
        )}
      </div>
    </div>
  )
}

TableTools.defaultProps = {
  additionalTools: undefined,
  darkMode: false,
  defaultRowsPerPage: 5,
  downloadableData: [],
  downloadableFileName: 'ambient-table-data.csv',
  filterOptions: [],
  isDownloadable: false,
  isPaginated: true,
  isSearchable: true,
  onChangeRowsPerPage: () => {},
  onSearch: () => {},
  searchText: '',
  tableData: {},
  isCountVisible: true,
}

TableTools.propTypes = {
  additionalTools: PropTypes.object,
  darkMode: PropTypes.bool,
  defaultRowsPerPage: PropTypes.number,
  downloadableData: PropTypes.array,
  downloadableFileName: PropTypes.string,
  filterOptions: PropTypes.array,
  isDownloadable: PropTypes.bool,
  isSearchable: PropTypes.bool,
  isPaginated: PropTypes.bool,
  onChangeRowsPerPage: PropTypes.func,
  onSearch: PropTypes.func,
  searchText: PropTypes.string,
  tableData: PropTypes.object,
  isCountVisible: PropTypes.bool,
}

export default TableTools
