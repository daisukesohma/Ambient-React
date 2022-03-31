import React from 'react'

import { DropdownMenu } from '../index'

export const tableColumns = [
  { title: 'Label', field: 'label1' },
  { title: 'Label2', field: 'label2' },
  { title: 'Label3', field: 'label3' },
  { title: 'Label4', field: 'label4' },
  { title: 'Label5', field: 'label5' },
]

export const tableColumnsWithSort = [
  { title: 'Label', field: 'label1', sorting: true },
  { title: 'Label2', field: 'label2', sorting: true },
  { title: 'Label3', field: 'label3', sorting: false },
  { title: 'Label4', field: 'label4', sorting: true },
  { title: 'Label5', field: 'label5', sorting: false },
]

export const tableData = [
  { label1: 'A-Name', label2: 10, label3: 15, label4: 17, label5: 10 },
  { label1: 'B-Name', label2: 11, label3: 14, label4: 18, label5: 10 },
  { label1: 'C-Name', label2: 12, label3: 13, label4: 19, label5: 10 },
  { label1: 'D-Name', label2: 13, label3: 12, label4: 20, label5: 10 },
  { label1: 'E-Name', label2: 14, label3: 11, label4: 21, label5: 10 },
]

const menuItems = [
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
]

export const tableDataWithSelect = [
  {
    label1: 'Name',
    label2: (
      <DropdownMenu
        menuItems={menuItems}
        handleSelection={val => {
          console.log(val)
        }}
      />
    ),
    label3: 10,
    label4: 10,
    label5: 10,
  },
  {
    label1: 'Name',
    label2: (
      <DropdownMenu
        menuItems={menuItems}
        handleSelection={val => {
          console.log(val)
        }}
      />
    ),
    label3: 10,
    label4: 10,
    label5: 10,
  },
  {
    label1: 'Name',
    label2: (
      <DropdownMenu
        menuItems={menuItems}
        handleSelection={val => {
          console.log(val)
        }}
      />
    ),
    label3: 10,
    label4: 10,
    label5: 10,
  },
  {
    label1: 'Name',
    label2: (
      <DropdownMenu
        menuItems={menuItems}
        handleSelection={val => {
          console.log(val)
        }}
      />
    ),
    label3: 10,
    label4: 10,
    label5: 10,
  },
  {
    label1: 'Name',
    label2: (
      <DropdownMenu
        menuItems={menuItems}
        handleSelection={val => {
          console.log(val)
        }}
      />
    ),
    label3: 10,
    label4: 10,
    label5: 10,
  },
]

export const tableOptions = {
  search: false,
  paging: false,
  sorting: false,
}

export const tableMenuItems = [
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
]
