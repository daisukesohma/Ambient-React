import React, { useMemo } from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import {
  TableBody as MuiTableBody,
  TableCell,
  TableRow,
} from '@material-ui/core'
import { isMobileOnly } from 'react-device-detect'
import { get } from 'lodash'

import { Tooltip, Checkbox } from 'ambient_ui'
import useStyles from './styles'
import { stableSort, getSorting } from './utils'

const TableBody = ({
  actions,
  columns,
  darkMode,
  isEmptyRowsVisible,
  order,
  orderBy,
  page,
  rows,
  rowsPerPage,
  onClickRow, // clickable
  selectable, // selectable
  onSelectRow, // selectable
  serverSideProcessing,
  sortValues,
  validateSelectedRow,
  disableHover,
}) => {
  const { palette } = useTheme()
  const classes = useStyles({ darkMode, isMobileOnly, disableHover })

  const cellClasses = {
    root: classes.root,
    body: classes.body,
  }

  const emptyRows = serverSideProcessing
    ? rowsPerPage - rows.length
    : rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage)

  const sortedRows = useMemo(() => {
    return stableSort(rows, getSorting(order, orderBy, sortValues))
  }, [rows, order, orderBy, sortValues])

  const slicedRows = useMemo(() => {
    return serverSideProcessing
      ? sortedRows
      : sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  }, [serverSideProcessing, page, rowsPerPage, sortedRows])

  const handleSelectableClick = row => {
    if (selectable) {
      onSelectRow(row)
    }
  }

  const handleClickable = row => {
    onClickRow(row)
  }

  return (
    <MuiTableBody>
      {slicedRows.map((row, index) => {
        return (
          <TableRow
            key={index}
            classes={{
              root: disableHover
                ? classes.tableRowContainerNoHover
                : classes.tableRowContainer,
            }}
            hoverable={selectable || undefined}
            onClick={() => {
              handleSelectableClick(row)
              handleClickable(row)
            }}
          >
            {selectable && (
              <TableCell key={0} padding='checkbox' classes={cellClasses}>
                <Checkbox checked={validateSelectedRow(row)} />
              </TableCell>
            )}
            {columns.map((column, columnIndex) => {
              let renderValue = row[column.field]
              if (column && column.render) {
                const Render = column.render
                renderValue = <Render {...row} />
              }
              // console.log(column.props)
              return (
                <TableCell
                  key={columnIndex + 1}
                  {...column.props}
                  classes={cellClasses}
                  style={{
                    minWidth: column.minWidth ? column.minWidth : 'auto',
                  }}
                >
                  {renderValue}
                </TableCell>
              )
            })}
            {actions && (
              <TableCell classes={cellClasses}>
                <div className={classes.flexContainer}>
                  {actions.map((action, actionIndex) => {
                    if (action.validation && !action.validation(row)) {
                      // need to check validation first. on user management table, we only need to show assign/unassign button for responders
                      return null
                    }
                    const variableTooltip = get(
                      action,
                      'variableTooltip',
                      false,
                    )
                    const tooltip = variableTooltip
                      ? action.variableTooltip(row)
                      : action.tooltip
                    return (
                      <Tooltip
                        title={tooltip}
                        placement='bottom'
                        customStyle={{
                          border: 'none',
                          color: palette.common.white,
                          backgroundColor: palette.common.black,
                          borderRadius: 4,
                          boxShadow: '0px 1px 4px rgba(34, 36, 40, 0.05)',
                        }}
                        key={actionIndex}
                      >
                        <div
                          className={classes.actionItem}
                          onClick={e => action.onClick(e, row)}
                        >
                          {action.icon(row)}
                        </div>
                      </Tooltip>
                    )
                  })}
                </div>
              </TableCell>
            )}
          </TableRow>
        )
      })}
      {isEmptyRowsVisible && emptyRows > 0 && (
        <TableRow style={{ height: 53 * emptyRows }}>
          <TableCell
            classes={cellClasses}
            colSpan={actions ? columns.length + 1 : columns.length}
          />
        </TableRow>
      )}
    </MuiTableBody>
  )
}

TableBody.defaultProps = {
  actions: undefined,
  darkMode: false,
  isEmptyRowsVisible: false,
  serverSideProcessing: false,
  onClickRow: () => {},
}

TableBody.propTypes = {
  actions: PropTypes.array,
  columns: PropTypes.array.isRequired,
  darkMode: PropTypes.bool,
  isEmptyRowsVisible: PropTypes.bool,
  onClickRow: PropTypes.func,
  order: PropTypes.string,
  orderBy: PropTypes.string,
  page: PropTypes.number,
  rows: PropTypes.array.isRequired,
  rowsPerPage: PropTypes.number,
  serverSideProcessing: PropTypes.bool,
  sortValues: PropTypes.object,
}

export default TableBody
