import React from 'react'
import { useTheme } from '@material-ui/core/styles'

import SvgWrapper from './SvgWrapper'

export default function Suitcase(props) {
  const { palette } = useTheme()
  return (
    <SvgWrapper width={props.width} height={props.height}>
      <path
        d='M18.4 8H5.6C4.71634 8 4 8.76751 4 9.71429V18.2857C4 19.2325 4.71634 20 5.6 20H18.4C19.2837 20 20 19.2325 20 18.2857V9.71429C20 8.76751 19.2837 8 18.4 8Z'
        stroke={props.stroke || palette.text.primary}
        strokeWidth='2'
        strokeLinecap='square'
      />
      <path
        d='M15 20V5.77778C15 5.30628 14.842 4.8541 14.5607 4.5207C14.2794 4.1873 13.8978 4 13.5 4H10.5C10.1022 4 9.72064 4.1873 9.43934 4.5207C9.15804 4.8541 9 5.30628 9 5.77778V20'
        stroke={props.stroke || palette.text.primary}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </SvgWrapper>
  )
}
