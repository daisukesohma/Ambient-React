import React from 'react'
import { shallow } from 'enzyme'
import { DateField } from 'components/atoms/fields'
import { formatUnixTimeWithTZ } from 'utils/dateTime/formatTimeWithTZ'

describe('<DateField />', () => {
  const renderedComponent = (timestamp: number): JSX.Element => {
    return <DateField timestamp={timestamp} />
  }

  test('Renders successfully.', () => {
    const ts = 1000000
    const component = shallow(renderedComponent(ts))
    const formattedDateTime = formatUnixTimeWithTZ(
      ts,
      'yyyy-MM-dd HH:mm:ss zzz',
    )
    expect(component.hasClass('am-subtitle2')).toEqual(true)
    expect(component.text()).toEqual(formattedDateTime)
  })
})
