import React from 'react'
import { storiesOf, addDecorator } from '@storybook/react' // eslint-disable-line
import { withKnobs, boolean } from '@storybook/addon-knobs' // eslint-disable-line

// TODO: should be used inside of component with useTheme hook OR ideally in makeStyles
import { light as palette } from 'theme'

import SearchBar from './index'

addDecorator(withKnobs)

storiesOf('SearchBar', module)
  .add('SearchBar', () => {
    const darkModeKnob = boolean('darkMode', false)
    return <SearchBar darkMode={darkModeKnob} onChange={() => {}} />
  })
  .add('SearchBar Dark Mode', () => {
    const darkModeKnob = boolean('darkMode', true)
    return <SearchBar darkMode={darkModeKnob} onChange={() => {}} />
  })
  .add('SearchBar with clear icon', () => {
    return <SearchBar isClearShown onChange={() => {}} />
  })
  .add('SearchBar with End Adornment', () => {
    const darkModeKnob = boolean('darkMode', true)
    return (
      <SearchBar
        darkMode={darkModeKnob}
        onChange={() => {}}
        InputProps={{
          endAdornment: (
            <div
              className='am-button'
              style={{
                display: 'flex',
                flexDirection: 'row',
                color: palette.grey[500],
                padding: '0 0 0 25px',
              }}
            >
              <div>Filters</div>
              <div
                onClick={() => {}}
                style={{
                  cursor: 'pointer',
                  padding: '0 5px',
                  width: 20,
                  color: palette.primary[500],
                }}
              >
                on
              </div>
            </div>
          ),
          placeholder: 'Search Alert Instance ID',
        }}
      />
    )
  })
