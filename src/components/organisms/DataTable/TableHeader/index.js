import React from 'react'
import PropTypes from 'prop-types'
import {
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@material-ui/core'

import useStyles from './styles'

const propTypes = {
  columns: PropTypes.array.isRequired,
  darkMode: PropTypes.bool,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  actions: PropTypes.array,
}

const defaultProps = {
  actions: undefined,
  columns: [],
  darkMode: false,
  order: 'desc',
  orderBy: undefined,
}

export default function TableHeader({
  actions,
  columns,
  darkMode,
  onRequestSort,
  order,
  orderBy,
  selectable,
}) {
  const classes = useStyles({ darkMode })
  const createSortHandler = property => event => {
    onRequestSort(event, property)
  }
  const cellClasses = {
    head: classes.head,
    root: classes.labelRoot,
    // active: classes.labelActive, TODO: What is this? Table Cell HAS NOT this classes in API https://material-ui.com/api/table-cell/
    // icon: classes.labelIcon,     TODO: What is this? Table Cell HAS NOT this classes in API https://material-ui.com/api/table-cell/
  }

  return (
    <TableHead>
      <TableRow>
        {selectable ? (
          <TableCell classes={cellClasses} key={`table-cell-${0}`}>
            Select
          </TableCell>
        ) : null}
        {columns.map((column, index) => {
          if (column.sorting === false) {
            return (
              <TableCell classes={cellClasses} key={`table-cell-${index + 1}`}>
                {column.title}
              </TableCell>
            )
          }
          return (
            <TableCell key={index} sortDirection={order}>
              <TableSortLabel
                active={orderBy === column.field}
                direction={order}
                onClick={createSortHandler(column.field)}
                classes={{
                  root: classes.labelRoot,
                  active: classes.labelActive,
                  icon: classes.labelIcon,
                }}
              >
                {column.title}
              </TableSortLabel>
            </TableCell>
          )
        })}
        {actions && <TableCell classes={cellClasses}>Actions</TableCell>}
      </TableRow>
    </TableHead>
  )
}

TableHeader.propTypes = propTypes
TableHeader.defaultProps = defaultProps
