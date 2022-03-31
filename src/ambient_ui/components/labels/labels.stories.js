/* eslint-disable */
import React from 'react'
import { storiesOf, addDecorator } from '@storybook/react'
import { Icon } from 'react-icons-kit'
import { settings } from 'react-icons-kit/feather/settings'
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs' // eslint-disable-line
import { code } from './addons/notes'

import { AlertLevelLabel } from '../index'
// TODO: should be used inside of component with useTheme hook OR ideally in makeStyles
import { light as palette } from 'theme'

addDecorator(withKnobs)

storiesOf('Labels', module)
  .add(
    'Alert Level Label',
    () => (
      <>
        <div
          style={{ display: 'flex', flexDirection: 'row', marginBottom: 10 }}
        >
          <AlertLevelLabel level='high' />
          <AlertLevelLabel level='medium' />
          <AlertLevelLabel level='low' />
          <AlertLevelLabel level='high' label='High Alert' />
          <AlertLevelLabel level='medium' label='In Progress' />
          <AlertLevelLabel level='low'>Custom Children</AlertLevelLabel>
          <AlertLevelLabel level='medium'>
            <Icon icon={settings} size={14} />
            <span> with icon</span>
          </AlertLevelLabel>
        </div>
        <div
          style={{
            background: palette.common.black,
            display: 'flex',
            flexDirection: 'row',
            borderRadius: 4,
            padding: '5px 10px',
          }}
        >
          <div className='am-subtitle1' style={{ color: 'white' }}>
            Dark mode:{' '}
          </div>
          <AlertLevelLabel level='high' darkMode={true} />
          <AlertLevelLabel level='medium' darkMode={true} />
          <AlertLevelLabel level='low' darkMode={true} />
        </div>
      </>
    ),
    {
      notes: { Code: code },
    },
  )
  .add(
    'Alert Level Label with Knobs',
    () => {
      const levelKnob = text('level', 'high')
      const labelKnob = text('label', null)
      const childrenKnob = text('children', null)
      const darkModeKnob = boolean('darkMode', false)

      return (
        <div
          style={{
            background: darkModeKnob ? palette.common.black : null,
            padding: 10,
            borderRadius: 4,
          }}
        >
          <AlertLevelLabel
            level={levelKnob}
            label={labelKnob}
            darkMode={darkModeKnob}
          >
            {childrenKnob}
          </AlertLevelLabel>
        </div>
      )
    },
    {
      notes: { Code: code },
    },
  )
