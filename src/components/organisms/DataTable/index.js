import React, { useEffect, useState, useMemo } from 'react'
import Alert from '@material-ui/lab/Alert'
import AlertTitle from '@material-ui/lab/AlertTitle'
import PropTypes from 'prop-types'
import {
  Grid,
  LinearProgress,
  Paper,
  Table,
  TableContainer,
  Typography,
} from '@material-ui/core'
import { Button } from 'ambient_ui'
import uniqBy from 'lodash/uniqBy'
import clsx from 'clsx'
import get from 'lodash/get'
import { isMobileOnly } from 'react-device-detect'

import TableHeader from './TableHeader'
import TableBody from './TableBody'
import TableTools from './TableTools'
import useStyles from './styles'
import PaginationAroundWrapper from 'components/Pagination/PaginationAroundWrapper'

const DataTable = ({
  actions,
  additionalTools,
  caption,
  captionStyle,
  columns,
  darkMode, // outside prop, not redux
  data,
  defaultOrder,
  defaultOrderBy,
  defaultRowsPerPage,
  defaultSearchValue,
  downloadableData,
  downloadableFileName,
  emptyComment,
  filterOptions,
  isCountVisible,
  isDownloadable,
  isLoading,
  isPaginated,
  isSearchable,
  onAdd,
  onSearch,
  onSort,
  onClickRow,
  page,
  pages,
  rowsPerPage,
  selectable, // selectable, onSelectRow and validateSelectedRow must be provided for selectable
  onSelectRow, // selectable, onSelectRow and validateSelectedRow must be provided for selectable
  serverSideProcessing,
  setPage,
  setRowsPerPage,
  showAddNowButton,
  sortValues,
  totalCountOverride,
  validateSelectedRow,
  disableHover,
}) => {
  const classes = useStyles({ darkMode })
  const [rows, setRows] = useState(data)
  const [order, setOrder] = useState(defaultOrder || 'desc')
  const [orderBy, setOrderBy] = useState(
    defaultOrderBy || get(columns, '[0].field'),
  )
  const [currentPage, setCurrentPage] = useState(0)
  const [currentRowsPerPage, setCurrentRowsPerPage] = useState(
    defaultRowsPerPage,
  )
  const [searchText, setSearchText] = useState(defaultSearchValue || '')
  const [selectedFilterOptions, setSelectedFilterOptions] = useState({})
  const [selectedFilterField, setSelectedFilterField] = useState()

  const changePage = serverSideProcessing ? setPage : setCurrentPage
  const changeRowsPerPage = serverSideProcessing
    ? setRowsPerPage
    : setCurrentRowsPerPage

  const handleRequestSort = useMemo(
    () => (event, property) => {
      const isAsc = orderBy === property && order === 'asc'
      setOrder(isAsc ? 'desc' : 'asc')
      setOrderBy(property)
      if (onSort) {
        const sortColumn = columns.find(o => o.field === orderBy)
        onSort(sortColumn.sortBy || sortColumn.field, order === 'asc' ? 1 : -1)
      }
    },
    [order, orderBy],
  )
  // Pagination
  const handleChangePage = event => {
    changePage(event.selected)
  }

  const handleChangeRowsPerPage = value => {
    changeRowsPerPage(value)
    changePage(0)
  }

  // Search
  const handleSearch = value => {
    if (onSearch) {
      onSearch(value)
    }
    setSearchText(value)
  }

  useEffect(() => {
    if (searchText && !onSearch) {
      setRows(
        data.filter(item =>
          JSON.stringify(item)
            .toLowerCase()
            .includes(searchText.toLowerCase()),
        ),
      )
    } else {
      setRows(data)
    }
    // TODO: CHECK WHAT IS THIS? Why we need force useEffect to page 0. at least we don't need it with SSP
    if (!serverSideProcessing) changePage(0)
    // eslint-disable-next-line
  }, [searchText])

  useEffect(() => {
    setCurrentRowsPerPage(defaultRowsPerPage)
  }, [defaultRowsPerPage])

  // Filtering
  // data is all table data
  // field is the field to filter on
  // optionValues is an array of values to MATCH
  // filterType is for the future, if we want to match on some other case, like substring search
  // ASSUMPTION: one filter option. This does not support more than one for now, we will need a slight rearchitecture thinking here.
  // I think the selectedFilterOptions can be an object with { filterName: array of filterOptions }...
  // starting to feel like useReducer may be good here.
  //
  const handleFilter = (filterType = 'match') => {
    let filtered = data
    if (filterType === 'match') {
      // loop through selected filters to get filtered data
      Object.keys(selectedFilterOptions).forEach(field => {
        filtered = filtered.filter(dataRow => {
          if (
            selectedFilterOptions[field] &&
            selectedFilterOptions[field].length > 0
          ) {
            return selectedFilterOptions[field]
              .map(o => o.value)
              .includes(dataRow[field])
          }
          return true
        })
      })
    }
    setRows(filtered)
  }

  useEffect(() => {
    // Assumption: one filter option in the array.
    // apply filters if filter options are changed
    if (
      filterOptions &&
      selectedFilterField &&
      selectedFilterOptions[selectedFilterField] &&
      selectedFilterOptions[selectedFilterField].length > 0
    ) {
      handleFilter()
    } else if (searchText && !onSearch) {
      setRows(
        data.filter(item =>
          JSON.stringify(item)
            .toLowerCase()
            .includes(searchText.toLowerCase()),
        ),
      )
    } else {
      setRows(data)
      if (!serverSideProcessing) {
        changePage(0)
      }
    }
    // eslint-disable-next-line
  }, [
    selectedFilterOptions,
    data,
    filterOptions,
    selectedFilterField,
    onSearch,
  ])

  // @FUTURE could move to a util hook function
  const getUniqueItemsFromDataForFilter = (tableData, field) => {
    return uniqBy(tableData, field).map(rowData => {
      return {
        label: get(rowData, field) || '(empty)',
        value: get(rowData, field) || undefined,
      }
    })
  }

  const augmentFilterOptions = sparseOptions => {
    return sparseOptions.map(o => {
      return {
        ...o,
        items: getUniqueItemsFromDataForFilter(data, o.field),
        onSelect: options => {
          // detect changes on filters
          if (
            !selectedFilterOptions[o.field] ||
            (selectedFilterOptions[o.field] &&
              selectedFilterOptions[o.field].length !== options.length)
          ) {
            setSelectedFilterOptions({
              ...selectedFilterOptions,
              [o.field]: options,
            })
            setSelectedFilterField(o.field)
          }
        },
        selected: selectedFilterOptions[o.field],
      }
    })
  }

  return (
    <div>
      <TableTools
        darkMode={darkMode}
        isDownloadable={isDownloadable}
        isCountVisible={isCountVisible}
        downloadableFileName={downloadableFileName}
        downloadableData={downloadableData}
        defaultRowsPerPage={
          serverSideProcessing ? rowsPerPage : defaultRowsPerPage
        }
        filterOptions={augmentFilterOptions(filterOptions)}
        isPaginated={isPaginated}
        isSearchable={isSearchable}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        onSearch={handleSearch}
        searchText={searchText}
        additionalTools={additionalTools}
        tableData={{
          data,
          rows,
          columns,
          page: serverSideProcessing ? page : currentPage,
          rowsPerPage: serverSideProcessing ? rowsPerPage : currentRowsPerPage,
          totalCountOverride,
        }}
      />
      <Paper classes={{ root: classes.paperRoot }}>
        {isMobileOnly && (
          <Alert severity='warning' className={classes.alertPanel}>
            <AlertTitle>Scroll horizontally to see more columns</AlertTitle>
          </Alert>
        )}

        {isLoading && <LinearProgress />}

        <PaginationAroundWrapper
          hide={isLoading || !isPaginated}
          pageCount={
            serverSideProcessing
              ? pages
              : Math.ceil(rows.length / currentRowsPerPage)
          }
          selectedPage={serverSideProcessing ? page + 1 : currentPage + 1}
          onPageChange={handleChangePage}
        >
          <TableContainer>
            <Table className={classes.table}>
              {caption && (
                <caption style={{ captionSide: 'top', ...captionStyle }}>
                  {caption}
                </caption>
              )}
              <TableHeader
                columns={columns}
                darkMode={darkMode}
                actions={actions}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                selectable={selectable}
              />
              {data.length > 0 && (
                <TableBody
                  darkMode={darkMode}
                  serverSideProcessing={serverSideProcessing}
                  rows={rows}
                  columns={columns}
                  actions={actions}
                  rowsPerPage={
                    serverSideProcessing ? rowsPerPage : currentRowsPerPage
                  }
                  page={serverSideProcessing ? page : currentPage}
                  order={order}
                  orderBy={orderBy}
                  sortValues={sortValues}
                  onClickRow={onClickRow}
                  selectable={selectable}
                  onSelectRow={onSelectRow}
                  validateSelectedRow={validateSelectedRow}
                  disableHover={disableHover}
                />
              )}
            </Table>
          </TableContainer>
        </PaginationAroundWrapper>

        {data.length === 0 && (
          <Grid className={classes.empty}>
            <Typography className={clsx('am-h6', classes.emptyText)}>
              {emptyComment}
            </Typography>
            {showAddNowButton && (
              <Button customStyle={{ marginTop: 8 }} onClick={onAdd}>
                Add Now
              </Button>
            )}
          </Grid>
        )}
      </Paper>
    </div>
  )
}

DataTable.defaultProps = {
  serverSideProcessing: false,
  additionalTools: undefined,
  caption: null,
  columns: [],
  data: [],
  darkMode: false,
  defaultRowsPerPage: 5,
  downloadableData: [],
  downloadableFileName: 'ambient-data-table.csv',
  emptyComment: (
    <span className='am-caption' style={{ color: '#9FA2A7' }}>
      You currently have no items
    </span>
  ),
  filterOptions: [],
  isDownloadable: false,
  isLoading: false,
  isPaginated: true,
  isSearchable: true,
  onAdd: () => {},
  showAddNowButton: true,
  page: 0,
  pages: 0,
  selectable: false,
  setPage: () => {},
  rowsPerPage: 5,
  setRowsPerPage: () => {},
  totalCountOverride: null,
  defaultSearchValue: '',
  isCountVisible: true,
  sortValues: null,
  disableHover: false,
}

DataTable.propTypes = {
  serverSideProcessing: PropTypes.bool,
  actions: PropTypes.array,
  additionalTools: PropTypes.object,
  caption: PropTypes.node,
  columns: PropTypes.array,
  data: PropTypes.array,
  darkMode: PropTypes.bool,
  defaultRowsPerPage: PropTypes.number,
  downloadableData: PropTypes.array,
  downloadableFileName: PropTypes.string,
  emptyComment: PropTypes.node,
  filterOptions: PropTypes.array,
  isDownloadable: PropTypes.bool,
  isLoading: PropTypes.bool,
  isPaginated: PropTypes.bool,
  isSearchable: PropTypes.bool,
  onAdd: PropTypes.func,
  showAddNowButton: PropTypes.bool,
  page: PropTypes.number,
  pages: PropTypes.number,
  selectable: PropTypes.bool,
  setPage: PropTypes.func,
  onSearch: PropTypes.func,
  onSort: PropTypes.func,
  rowsPerPage: PropTypes.number,
  setRowsPerPage: PropTypes.func,
  totalCountOverride: PropTypes.number,
  defaultSearchValue: PropTypes.string,
  isCountVisible: PropTypes.bool,
  defaultOrder: PropTypes.string,
  defaultOrderBy: PropTypes.string,
  sortValues: PropTypes.object,
  disableHover: PropTypes.bool,
}

export default DataTable
