/* eslint-disable */
import React, { useState } from 'react'
import { storiesOf, addDecorator } from '@storybook/react'
import { withKnobs, text, select } from '@storybook/addon-knobs' // eslint-disable-line

// Icons
import PhoneIcon from '@material-ui/icons/Phone'
import PeopleIcon from '@material-ui/icons/People'
import SecurityIcon from '@material-ui/icons/Security'
import AddIcon from '@material-ui/icons/Add'
import {
  Button,
  DropdownMenu,
  CustomSelect,
  SearchableDropdownMenu,
} from '../index'

import {
  menuItemsWithSub,
  menuItemsWithDivider,
  menuItemsForDispatch,
  menuItemsForDispatchVolume,
  menuItems,
  selectOptions,
} from './mock-data'
import CheckboxList from './CheckboxList'

const overrideStyles = {
  menu: (provided, state) => ({
    ...provided,
    zIndex: 20,
  }),
  input: styles => ({
    ...styles,
    fontSize: 30,
    fontWeight: 900,
    color: 'red',
  }),
}

addDecorator(withKnobs)

storiesOf('DropdownMenu', module)
  .add('DropdownMenu-Default', () => (
    <DropdownMenu
      menuItems={menuItems}
      handleSelection={val => {
        console.log(val)
      }}
    />
  ))
  .add('DropdownMenu-Divider', () => (
    <DropdownMenu
      menuItems={menuItemsWithDivider}
      handleSelection={val => {
        console.log(val)
      }}
    />
  ))
  .add('DropdownMenu-Custom Styles', () => (
    <DropdownMenu
      menuItems={menuItems}
      handleSelection={val => {
        console.log(val)
      }}
      styles={{
        height: '10px',
        color: 'white',
        backgroundColor: 'green',
      }}
    />
  ))
  .add('DropdownMenu-with-Sub-Menu', () => (
    <DropdownMenu
      menuItems={menuItemsWithSub}
      handleSelection={val => {
        console.log(val)
      }}
    />
  ))
  .add('DropdownMenu-with-Default Index', () => (
    <DropdownMenu
      menuItems={menuItems}
      handleSelection={val => {
        console.log(val)
      }}
      selectedItem={menuItems[1]}
    />
  ))
  .add('DropdownMenu Changing Menu Items', () => {
    const [currentMenuItems, setCurrentMenuItems] = useState(menuItems)
    const [currentIndex, setCurrentIndex] = useState(0)
    const altMenuItems = [
      {
        label: 'mcD',
        value: 'mcD',
      },
      {
        label: 'Burger King',
        value: 'bk',
      },
    ]

    return (
      <>
        <DropdownMenu
          menuItems={currentMenuItems}
          defaultItemIndex={currentIndex}
          handleSelection={val => {
            console.log(val)
          }}
        />
        <Button onClick={() => setCurrentMenuItems(menuItems)}>
          Original List
        </Button>
        <Button onClick={() => setCurrentMenuItems(altMenuItems)}>
          Changed List
        </Button>
        <Button onClick={() => setCurrentIndex(1)}>Change Default Index</Button>
        <Button onClick={() => setCurrentMenuItems([])}>
          Change to [] empty list
        </Button>
        <Button onClick={() => setCurrentMenuItems(null)}>
          Change to null list
        </Button>
      </>
    )
  })

storiesOf('DropdownMenu', module)
  .add('Custom-React-Select-Single', () => (
    <CustomSelect options={selectOptions} onChange={val => console.log(val)} />
  ))
  .add('Custom-React-Select-Single-with-Custom-Style', () => (
    <CustomSelect
      options={selectOptions}
      onChange={val => console.log(val)}
      styles={overrideStyles}
    />
  ))
  .add('Custom-React-Select-Multi', () => (
    <CustomSelect
      options={selectOptions}
      isMulti
      onChange={val => console.log(val)}
    />
  ))
  .add('Custom-React-Select-Single-Creatable', () => (
    <CustomSelect
      options={selectOptions}
      creatable
      onChange={val => console.log(val)}
    />
  ))
  .add('Custom-React-Select-Multi-Creatable', () => (
    <CustomSelect
      options={selectOptions}
      creatable
      isMulti
      onChange={val => console.log(val)}
    />
  ))
  .add('Custom-React-Select-Async', () => (
    <CustomSelect
      isAsync
      getAsyncOptions={(input, callback) => {
        setTimeout(() => {
          callback([
            {
              label: 'test',
              value: 'test',
            },
          ])
        }, 3000)
      }}
      onChange={val => console.log(val)}
    />
  ))
  .add('Custom-React-Select-Async-Multi', () => (
    <CustomSelect
      isAsync
      isMulti
      getAsyncOptions={(input, callback) => {
        setTimeout(() => {
          callback([
            {
              label: 'test',
              value: 'test',
            },
            {
              label: 'sample',
              value: 'sample',
            },
          ])
        }, 3000)
      }}
      onChange={val => console.log(val)}
    />
  ))
  .add('CheckboxList', () => {
    const placeholderKnob = text('placeholder', 'Select ...')
    const selectedValueKnob = select('Selected Value', menuItems, menuItems[0])

    return (
      <CheckboxList
        items={menuItems}
        selected={[selectedValueKnob]}
        placeholder={placeholderKnob}
        onSelect={values => console.log('CheckboxList onSelect', values)}
      />
    )
  })

storiesOf('SearchableDropdownMenu', module)
  .add('SearchableDropdownMenu-Default', () => (
    <SearchableDropdownMenu
      name='Dispatch'
      icon={PhoneIcon}
      menuItems={menuItemsForDispatch}
      globalItem={{
        icon: PeopleIcon,
        primary: 'All Responders',
        secondary: 'Dispatch all responders',
      }}
      onItemClick={item => alert(item.value)}
      onGlobalItemClick={item => alert(item.primary)}
    />
  ))
  .add('SearchableDropdownMenu-Reverse-DispatchResponders', () => (
    <SearchableDropdownMenu
      name='Dispatch'
      icon={PhoneIcon}
      reverse={true}
      menuItems={menuItemsForDispatch}
      globalItem={{
        icon: PeopleIcon,
        primary: 'All Responders',
        secondary: 'Dispatch all responders',
      }}
      customStyle={{ position: 'fixed', bottom: 0, left: 20 }}
      onItemClick={item => alert(item.value)}
      onGlobalItemClick={item => alert(item.primary)}
    />
  ))
  .add('SearchableDropdownMenu-Reverse-DispatchExternal', () => (
    <SearchableDropdownMenu
      name='Dispatch (FR / LE)'
      icon={SecurityIcon}
      reverse={true}
      menuItems={menuItemsForDispatch}
      globalItem={{
        icon: AddIcon,
        primary: 'New Profile',
        secondary: 'Create a new External Profile',
      }}
      customStyle={{ position: 'fixed', bottom: 0, left: 20 }}
      onItemClick={item => alert(item.value)}
      onGlobalItemClick={item => alert(item.primary)}
    />
  ))
  .add('SearchableDropdownMenu-Reverse-LotsOfData', () => (
    <SearchableDropdownMenu
      name='Dispatch (FR / LE)'
      icon={SecurityIcon}
      reverse={true}
      menuItems={menuItemsForDispatchVolume}
      globalItem={{
        icon: AddIcon,
        primary: 'New Profile',
        secondary: 'Create a new External Profile',
      }}
      customStyle={{ position: 'fixed', bottom: 0, left: 20 }}
      onItemClick={item => alert(item.value)}
      onGlobalItemClick={item => alert(item.primary)}
    />
  ))
