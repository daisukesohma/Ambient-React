/* eslint react/display-name: 0 */
import React from 'react'
import { Tooltip } from 'ambient_ui'
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/Edit'
import CheckIcon from '@material-ui/icons/Check'
import ClearIcon from '@material-ui/icons/Clear'
import SearchIcon from '@material-ui/icons/Search'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'

// Example usage:
// <DataTable
//   title={<div />}
//   columns={columns}
//   data={rows}
//   localization={setTableSearchbarPlaceholder('Search Sites')}
//   localization={tableLocalizationEmpty} // OR THIS
//   options={tableOptions}
//   icons={tableIcons}
// />

// FUTURE: @eric may want to allow customization options, such as paging, pagesize,
// search, etc.
//
const tableOptions = {
  minBodyHeight: 200,
  paging: true,
  pageSize: 100,
  pageSizeOptions: [100], // when page size is the only option, table doesn't show options.
  paginationType: 'stepped',
  emptyRowsWhenPaging: false,
  search: true,
  searchFieldAlignment: 'left',
  searchFieldStyle: {
    minWidth: 250,
    fontSize: 16,
  },
  addRowPosition: 'first',
}

const tableIcons = {
  Add: () => null,
  Edit: () => (
    <Tooltip title="Edit">
      <IconButton size="small">
        <EditIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  ),
  Delete: () => <div />,
  Check: () => (
    <Tooltip title="Save">
      <IconButton size="small">
        <CheckIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  ),
  Clear: () => (
    <Tooltip title="Clear">
      <IconButton size="small">
        <ClearIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  ),
  NextPage: () => (
    <Tooltip title="Next Page">
      <IconButton size="small">
        <ChevronRightIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  ),
  PreviousPage: () => (
    <Tooltip title="Previous Page">
      <IconButton size="small">
        <ChevronLeftIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  ),
  ResetSearch: () => (
    <Tooltip title="Reset Search">
      <IconButton size="small">
        <ClearIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  ),
  Search: () => (
    <Tooltip title="Search">
      <IconButton size="small">
        <SearchIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  ),
  SortArrow: () => (
    <Tooltip title="Sort">
      <IconButton size="small">
        <ArrowUpwardIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  ),
}

// Localization object utilities

// use tableLocalizationEmpty when using tableIcons
//
const tableLocalizationEmpty = {
  body: {
    addTooltip: '',
    editTooltip: '',
    deleteTooltip: '',
    editRow: {
      saveTooltip: '',
      cancelTooltip: '',
    },
  },
}

// Generates localization prop object
//
function setTableSearchbarPlaceholder(text) {
  return {
    toolbar: {
      searchPlaceholder: text,
    },
  }
}

export {
  setTableSearchbarPlaceholder,
  tableOptions,
  tableIcons,
  tableLocalizationEmpty,
}
