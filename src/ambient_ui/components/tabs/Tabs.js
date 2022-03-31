import React from 'react'
import PropTypes from 'prop-types'

import CustomTabs from './customs/Tabs'
import CustomTab from './customs/Tab'

const Tabs = ({ tabs, onChange, value }) => {
  const [selected, setSelected] = React.useState(value)

  const handleChange = (event, newValue) => {
    setSelected(newValue)
    onChange(newValue)
  }

  return (
    <CustomTabs value={selected} onChange={handleChange}>
      {tabs.map(({ label, icon }, index) => (
        <CustomTab label={label} key={index} icon={icon} />
      ))}
    </CustomTabs>
  )
}

Tabs.defaultProps = {
  onChange: () => {},
  value: 0,
}

Tabs.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChange: PropTypes.func,
  value: PropTypes.number,
}

export default Tabs
