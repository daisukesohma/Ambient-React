import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import { components } from 'react-select'
import { Icons } from 'ambient_ui'

const { Investigate } = Icons

export default function ValueContainerCustom({ children, ...props }) {
  const { palette } = useTheme()
  return (
    <>
      <div style={{ marginLeft: 10, paddingTop: 4 }}>
        <Investigate stroke={palette.grey[700]} width={24} height={24} />
      </div>
      <components.ValueContainer {...props}>
        {children}
      </components.ValueContainer>
    </>
  )
}
