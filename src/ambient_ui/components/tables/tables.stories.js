import React from 'react'
import { storiesOf } from '@storybook/react' // eslint-disable-line

import { DataTable } from '../index'

import {
  tableColumns,
  tableColumnsWithSort,
  tableData,
  tableDataWithSelect,
  tableOptions,
  tableMenuItems,
} from './mock-data'

storiesOf('Table', module)
  .add('DataTable-With-Filter-Menu', () => (
    <DataTable
      title='Example'
      data={tableData}
      columns={tableColumns}
      options={tableOptions}
      menuItems={tableMenuItems}
      showMenu
    />
  ))
  .add('DataTable-With-Actions', () => (
    <DataTable
      title='Example'
      data={tableData}
      columns={tableColumns}
      options={{ ...tableOptions, actionsColumnIndex: -1 }}
      actions={[
        {
          icon: () => <div>+</div>, // eslint-disable-line
          tooltip: 'Add',
          onClick: (e, rowData) => console.log(rowData),
        },
      ]}
    />
  ))
  .add('DataTable-Default-Options', () => (
    <DataTable title='Example' data={tableData} columns={tableColumns} />
  ))
  .add('DataTable-With-Select-in-Column', () => (
    <DataTable
      title='Example'
      data={tableDataWithSelect}
      columns={tableColumns}
    />
  ))
  .add('DataTable-With-Pagination', () => (
    <DataTable
      title='Example'
      data={tableData}
      columns={tableColumns}
      options={{
        paging: true,
      }}
    />
  ))
  .add('DataTable-Sort-Options', () => (
    <DataTable
      title='Example'
      data={tableData}
      columns={tableColumnsWithSort}
    />
  ))
