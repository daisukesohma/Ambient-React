/* eslint-disable */
import React from 'react'
import { storiesOf, addDecorator } from '@storybook/react'
import { withKnobs, text, boolean, select } from '@storybook/addon-knobs' // eslint-disable-line

// Icons
import {
  OptionMenu,
  AddOptionMenu,
  MoreOptionMenu,
  SettingsOptionMenu,
} from '../index'
import { useStyles } from './styles'

import { code } from './addons/notes'
import {
  menuItemsForOptionMenu,
  menuItemsWithDividerForOptionMenu,
} from './data'

// TODO: should be used inside of component with useTheme hook OR ideally in makeStyles
import { light as palette } from 'theme'

addDecorator(withKnobs)

storiesOf('OptionMenu', module)
  .add(
    'OptionMenu',
    () => {
      const noBackgroundKnob = boolean('noBackground', true)
      const darkModeKnob = boolean('darkMode', false)
      const textClassKnob = text('textClass', 'am-caption')

      return (
        <div
          style={{
            padding: '10px 30px',
            width: 'fit-content',
            background: darkModeKnob
              ? palette.common.black
              : palette.common.white,
          }}
        >
          <OptionMenu
            menuItems={menuItemsForOptionMenu}
            noBackground={noBackgroundKnob}
            darkMode={darkModeKnob}
            textClass={textClassKnob}
          />
        </div>
      )
    },
    {
      notes: { Code: code },
    },
  )
  .add(
    'OptionMenu with Divider',
    () => {
      const noBackgroundKnob = boolean('noBackground', true)
      const darkModeKnob = boolean('darkMode', false)
      const textClassKnob = text('textClass', 'am-caption')

      return (
        <div
          style={{
            padding: '10px 30px',
            width: 'fit-content',
            background: darkModeKnob
              ? palette.common.black
              : palette.common.white,
          }}
        >
          <OptionMenu
            menuItems={menuItemsWithDividerForOptionMenu}
            noBackground={noBackgroundKnob}
            darkMode={darkModeKnob}
            textClass={textClassKnob}
          />
        </div>
      )
    },
    {
      notes: { Code: code },
    },
  )
  .add(
    'OptionMenu with custom paperClass',
    () => {
      const classes = useStyles()
      const noBackgroundKnob = boolean('noBackground', true)
      const darkModeKnob = boolean('darkMode', false)
      const textClassKnob = text('textClass', 'am-caption')

      return (
        <div
          style={{
            padding: '10px 30px',
            width: 'fit-content',
            background: darkModeKnob
              ? palette.common.black
              : palette.common.white,
          }}
        >
          <OptionMenu
            menuItems={menuItemsForOptionMenu}
            noBackground={noBackgroundKnob}
            darkMode={darkModeKnob}
            textClass={textClassKnob}
            paperClass={classes.paperClassOverride}
          />
        </div>
      )
    },
    {
      notes: { Code: code },
    },
  )
  .add(
    'OptionMenu / Options with larger text',
    () => {
      const noBackgroundKnob = boolean('noBackground', true)
      const darkModeKnob = boolean('darkMode', false)
      const textClassKnob = text('textClass', 'am-subtitle1')

      return (
        <div
          style={{
            padding: '10px 30px',
            width: 'fit-content',
            background: darkModeKnob
              ? palette.common.black
              : palette.common.white,
          }}
        >
          <OptionMenu
            menuItems={menuItemsForOptionMenu}
            noBackground={noBackgroundKnob}
            darkMode={darkModeKnob}
            textClass={textClassKnob}
          />
        </div>
      )
    },
    {
      notes: { Code: code },
    },
  )
  .add(
    'MoreOptionMenu',
    () => {
      const noBackgroundKnob = boolean('noBackground', true)
      const darkModeKnob = boolean('darkMode', false)
      const textClassKnob = text('textClass', 'am-caption')

      return (
        <div
          style={{
            padding: '10px 30px',
            width: 'fit-content',
            background: darkModeKnob
              ? palette.common.black
              : palette.common.white,
          }}
        >
          <MoreOptionMenu
            menuItems={menuItemsForOptionMenu}
            noBackground={noBackgroundKnob}
            darkMode={darkModeKnob}
            textClass={textClassKnob}
          />
        </div>
      )
    },
    {
      notes: { Code: code },
    },
  )
  .add(
    'SettingsOptionMenu',
    () => {
      const noBackgroundKnob = boolean('noBackground', true)
      const darkModeKnob = boolean('darkMode', false)
      const textClassKnob = text('textClass', 'am-caption')

      return (
        <div
          style={{
            padding: '10px 30px',
            width: 'fit-content',
            background: darkModeKnob
              ? palette.common.black
              : palette.common.white,
          }}
        >
          <SettingsOptionMenu
            menuItems={menuItemsForOptionMenu}
            noBackground={noBackgroundKnob}
            darkMode={darkModeKnob}
            textClass={textClassKnob}
          />
        </div>
      )
    },
    {
      notes: { Code: code },
    },
  )
  .add(
    'AddOptionMenu',
    () => {
      const sizeItems = ['small', 'medium', 'large']

      const darkModeKnob = boolean('darkMode', false)
      const textClassKnob = text('textClass', 'am-caption')
      const sizeKnob = select('size', sizeItems, sizeItems[0])

      return (
        <div
          style={{
            padding: '10px 30px',
            width: 'fit-content',
            background: darkModeKnob
              ? palette.common.black
              : palette.common.white,
          }}
        >
          <AddOptionMenu
            menuItems={menuItemsForOptionMenu}
            darkMode={darkModeKnob}
            textClass={textClassKnob}
            size={sizeKnob}
          />
        </div>
      )
    },
    {
      notes: { Code: code },
    },
  )
