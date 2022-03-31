import { css } from 'goober'
import React from 'react'

import { Option } from '../lib/interfaces'

interface IDefaultItemRendererProps {
  checked: boolean
  option: Option
  disabled: boolean | undefined
  onClick: any
}

const DefaultRenderer = css({
  '& input,& span': {
    verticalAlign: 'middle',
    margin: 0,
  },
  span: {
    display: 'inline-block',
    paddingLeft: '5px',
  },
  '&.disabled': {
    opacity: 0.5,
  },
})

function DefaultItemRenderer({
  checked,
  option,
  onClick,
  disabled = false,
}: IDefaultItemRendererProps): JSX.Element {
  return (
    <div
      className={`${DefaultRenderer} item-renderer ${disabled && 'disabled'}`}
    >
      <input
        type='checkbox'
        onChange={onClick}
        checked={checked}
        tabIndex={-1}
        disabled={disabled}
      />
      <span>{option.label}</span>
    </div>
  )
}

export default DefaultItemRenderer
