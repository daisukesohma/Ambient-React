import React from 'react'
import { useTheme } from '@material-ui/core/styles'

export default function BottomDoorInfo() {
  const { palette } = useTheme()
  return (
    <>
      <span>The </span>
      <span style={{ color: palette.common.magenta }}>magenta line</span>
      <span> should be the bottom of the physical door.</span>
    </>
  )
}
