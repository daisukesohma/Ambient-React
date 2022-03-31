import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useTable, usePagination, useRowSelect } from 'react-table'
import { useTheme } from '@material-ui/core/styles'
import Fab from '@material-ui/core/Fab'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import clsx from 'clsx'
import { Icon as IconKit } from 'react-icons-kit'
import { plus } from 'react-icons-kit/feather/plus'

import Tooltip from '../../../../../../../../components/Tooltip'
import { defaultPaginationOptions } from 'components/organisms/DataTable/TableTools/data'
import PaginationSelector from 'components/organisms/DataTable/TableTools/PaginationSelector'
import TablePagination from 'components/organisms/DataTable/TablePagination'
import { useFlexStyles } from '../../../../../../../../common/styles/commonStyles'
import IndeterminateCheckbox from '../../../DiscoveryTable/components/Checkbox'
import EditableCell from '../EditableCell'

import useStyles from './styles'

// Set our editable cell renderer as the default Cell renderer
const defaultColumn = {
  Cell: EditableCell,
}

// Be sure to pass our updateMyData and the skipPageReset option
function DataTable({
  columns,
  data,
  handleAddRow,
  updateMyData,
  setSelectedRowIds,
  skipPageReset,
}) {
  const theme = useTheme()
  const flexClasses = useFlexStyles()
  // For this example, we're using pagination to illustrate how to stop
  // the current page from resetting when our data changes
  // Otherwise, nothing is different here.
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    pageOptions,
    gotoPage,
    setPageSize,
    state: { pageIndex, selectedRowIds },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      // use the skipPageReset option to disable page resetting temporarily
      autoResetPage: !skipPageReset,
      autoResetSelectedRows: !skipPageReset, // FUTURE @Eric does this have anything to do with why resetting of selected rows on add?
      // https://react-table.js.org/api
      //
      // updateMyData isn't part of the API, but
      // anything we put into these options will
      // automatically be available on the instance.
      // That way we can call this function from our
      // cell renderer!
      updateMyData,
    },
    usePagination,
    useRowSelect,
    // Here we will use a plugin to add our selection column
    hooks => {
      hooks.visibleColumns.push(visColumns => {
        return [
          {
            id: 'selection',
            // Make this column a groupByBoundary. This ensures that groupBy columns
            // are placed after it
            groupByBoundary: true,
            // The header can use the table's getToggleAllRowsSelectedProps method
            // to render a checkbox
            // eslint-disable-next-line react/prop-types
            Header: ({ getToggleAllRowsSelectedProps }) => (
              <div>
                <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />{' '}
                {/* eslint-disable-line react/prop-types */}
              </div>
            ),
            // The cell can use the individual row's getToggleRowSelectedProps method
            // to the render a checkbox
            // eslint-disable-next-line react/prop-types
            Cell: ({ row }) => (
              <div>
                <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
                {/* eslint-disable-line react/prop-types */}
              </div>
            ),
          },
          ...visColumns,
        ]
      })
    },
    hooks => {},
  )

  // send selected rows to
  useEffect(() => {
    setSelectedRowIds(Object.keys(selectedRowIds).map(id => Number(id)))
  }, [selectedRowIds, setSelectedRowIds])

  const classes = useStyles()

  // Set Default page size
  useEffect(() => {
    setPageSize(defaultPaginationOptions[0])
  }, [setPageSize])

  // Render the UI for your table
  return (
    <div style={{ position: 'relative' }}>
      <TableContainer
        component={Paper}
        classes={{ root: classes.tableContainer }}
      >
        <Table size='small' className={classes.table} {...getTableProps()}>
          <TableHead>
            {headerGroups.map((headerGroup, headerGroupIdx) => (
              <TableRow
                {...headerGroup.getHeaderGroupProps()}
                key={`datatable-headergroup-${headerGroupIdx}`}
              >
                {headerGroup.headers.map((column, columnIdx) => (
                  <TableCell
                    {...column.getHeaderProps()}
                    className={clsx('am-subtitle2', classes.tHeader)}
                    key={`datatable-header-${columnIdx}`}
                  >
                    {column.render('Header')}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody
            {...getTableBodyProps()}
            className={clsx('am-subtitle2', classes.tBody)}
          >
            {page.map((row, i) => {
              prepareRow(row)
              return (
                <TableRow
                  {...row.getRowProps()}
                  classes={{ root: classes.tRow }}
                  key={`table-row-${i}`}
                >
                  {row.cells.map((cell, cellIdx) => {
                    return (
                      <TableCell
                        {...cell.getCellProps()}
                        classes={{ root: classes.tCell }}
                        key={`datatable-cell-${cellIdx}`}
                      >
                        {cell.render('Cell')}
                      </TableCell>
                    )
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <div className={classes.addRowContainer}>
        <Tooltip
          content='Add New Row to Top'
          placement='bottom-end'
          offset='[0, 8]'
        >
          <Fab
            onClick={handleAddRow}
            size='small'
            color='primary'
            classes={{ root: classes.fabRoot }}
          >
            <span style={{ color: theme.palette.common.white }}>
              <IconKit icon={plus} size={18} />
            </span>
          </Fab>
        </Tooltip>
      </div>
      <div
        className={clsx(
          'am-subtitle2',
          classes.pagination,
          flexClasses.row,
          flexClasses.centerEnd,
        )}
      >
        <PaginationSelector
          title='Show'
          handleSelect={value => {
            setPageSize(value)
            gotoPage(0)
          }}
        />
        <TablePagination
          pageCount={pageOptions.length}
          selectedPage={pageIndex + 1}
          onPageChange={({ selected }) => gotoPage(selected)}
        />
      </div>
    </div>
  )
}

DataTable.defaultProps = {
  columns: [],
  data: [],
  handleAddRow: () => {},
  updateMyData: () => {},
  setSelectedRowIds: () => {},
  skipPageReset: () => {},
}

DataTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  handleAddRow: PropTypes.func,
  updateMyData: PropTypes.func,
  setSelectedRowIds: PropTypes.func,
  skipPageReset: PropTypes.func,
}

export default DataTable
