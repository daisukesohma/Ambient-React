import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import MaterialTable from 'material-table'
import PropTypes from 'prop-types'
import { isMobile } from 'react-device-detect'

import { DropdownMenu } from '../index'

import { tableIcons } from './icons'

const useStyles = makeStyles(({ palette }) => ({
  container: {
    position: 'relative',
    '& >div:first-of-type': {
      '& >div:first-of-type': {
        paddingLeft: 17,
        paddingRight: 17,
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: ({ title }) => (title ? 'unset' : 'space-between'),
        '& >div': {
          marginTop: isMobile ? 5 : 0,
        },
        '& >div:first-of-type': {
          display: ({ title }) => (title ? 'flex' : 'none'),
        },
      },
    },
    '& tbody tr td:not(:first-of-type)': {
      textAlign: 'center',
    },
    '& thead tr th:not(:first-of-type)': {
      textAlign: 'center',
    },
    '& h6': {
      fontFamily: `'Aeonik-Light', 'Roboto' !important`,
      fontSize: '20px !important',
      lineHeight: '24px',
      letterSpacing: 0.15,
      margin: 0,
    },
    '& tbody tr td': {
      fontFamily: `'Aeonik-Light', 'Roboto' !important`,
      fontSize: '16px !important',
    },
    '& thead tr th': {
      fontFamily: `'Aeonik-Light', 'Roboto' !important`,
      fontSize: '14px !important',
    },
    '& .Mui-disabled': {
      color: palette.text.secondary,
    },
  },
  form: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
}))

const DataTable = ({
  title,
  data,
  columns,
  options,
  showMenu = false,
  menuItems,
  style,
  ...props
}) => {
  const classes = useStyles({ title })

  return (
    <div className={classes.container} style={{ height: '100%', ...style }}>
      <MaterialTable
        {...props}
        title={title}
        columns={columns}
        data={data}
        options={options}
        icons={tableIcons}
        style={{ boxShadow: 'none' }}
      />
      {showMenu && (
        <DropdownMenu menuItems={menuItems} classOverride={classes.form} />
      )}
    </div>
  )
}

DataTable.defaultProps = {
  data: [
    { label1: 'Name', label2: 10, label3: 10, label4: 10, label5: 10 },
    { label1: 'Name', label2: 10, label3: 10, label4: 10, label5: 10 },
    { label1: 'Name', label2: 10, label3: 10, label4: 10, label5: 10 },
    { label1: 'Name', label2: 10, label3: 10, label4: 10, label5: 10 },
    { label1: 'Name', label2: 10, label3: 10, label4: 10, label5: 10 },
  ],
  title: 'Default Title',
  columns: [
    { title: 'Label', field: 'label1' },
    { title: 'Label', field: 'label2' },
    { title: 'Label', field: 'label3' },
    { title: 'Label', field: 'label4' },
    { title: 'Label', field: 'label5' },
  ],
  options: {
    search: false,
    paging: false,
    sorting: true,
  },
  menuItems: [
    {
      label: 'All sites',
      value: 'null',
    },
    {
      label: 'San Francisco',
      value: 'sf',
    },
    {
      label: 'Palo Alto',
      value: 'pa',
    },
  ],
  showMenu: false,
}

DataTable.propTypes = {
  data: PropTypes.array,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  columns: PropTypes.array,
  options: PropTypes.object,
  menuItems: PropTypes.array,
  tableColumns: PropTypes.array,
  showMenu: PropTypes.bool,
  style: PropTypes.object,
}

export default DataTable
