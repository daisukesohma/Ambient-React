/* eslint-disable no-console */
import React from 'react'
import { storiesOf } from '@storybook/react' // eslint-disable-line

// TODO: should be used inside of component with useTheme hook OR ideally in makeStyles
import { light as palette } from 'theme'

// eslint-disable-next-line import/extensions
import { SmartFilter } from '../index'

import { options } from './mock-data'

storiesOf('Filters', module)
  .add('Smart-Filter-Default', () => (
    <SmartFilter
      options={options}
      alertLabel='Locations'
      onApply={val => console.log(val)}
    />
  ))
  .add('Smart-Filter-with-Select-All-Default', () => (
    <SmartFilter
      options={options}
      alertLabel='Locations'
      selectAll
      onApply={val => console.log(val)}
    />
  ))
  .add('Smart-Filter-with-Selected-Options Initialized', () => (
    <SmartFilter
      options={options}
      alertLabel='Locations'
      initialSelected={options.slice(0, 2)}
      onApply={val => console.log(val)}
    />
  ))
  .add('Smart-Filter-with-Custom-Background-Color', () => (
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      <div>
        <SmartFilter
          options={options}
          customBackground={palette.common.white}
          alertLabel='Locations'
          selectAll
          onApply={val => console.log(val)}
        />
        <div>It should not be visible after options is shown</div>
      </div>
      <div>
        <SmartFilter
          options={options}
          alertLabel='Locations'
          selectAll
          onApply={val => console.log(val)}
        />
        <div style={{ maxWidth: 400 }}>
          But it is visible after options is shown because Background is
          transparent
        </div>
      </div>
      <div>
        <SmartFilter
          options={options}
          alertLabel='Locations'
          selectAll
          isStatic
          onApply={val => console.log(val)}
        />
        <div style={{ maxWidth: 400 }}>
          Menu is set to false so this text will be pushed it down
        </div>
      </div>
    </div>
  ))
  .add('Smart-Filter-with-Close-Button', () => (
    <SmartFilter
      isCloseShown
      options={options}
      alertLabel='Locations'
      selectAll
      onApply={val => console.log(val)}
    />
  ))
  .add('Smart-Filter-to-Top', () => (
    <SmartFilter
      isCloseShown
      options={options}
      alertLabel='Locations'
      selectAll
      dropdownDirection='top'
      isStatic
      onApply={val => console.log(val)}
    />
  ))
