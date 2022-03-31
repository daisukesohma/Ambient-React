import React from 'react'
import { useTheme } from '@material-ui/core/styles'

export default function FourPointInfo({ children }) {
  const { palette } = useTheme()
  return (
    <div
      className='am-caption'
      style={{
        padding: 4,
        borderRadius: 4,
        border: `1px solid ${palette.grey[700]}`,
      }}
    >
      <div>Tip: </div>
      <div>{children}</div>
    </div>
  )
}
