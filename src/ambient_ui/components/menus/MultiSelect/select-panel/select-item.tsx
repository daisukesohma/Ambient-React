/**
 * This component represents an individual item in the multi-select drop-down
 */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
import { css } from 'goober'
import React, { useEffect, useRef } from 'react'

import { Option } from '../lib/interfaces'

import DefaultItemRenderer from './default-item'

interface ISelectItemProps {
  itemRenderer: any
  option: Option
  checked: boolean
  focused: boolean
  tabIndex: number
  disabled: boolean | undefined
  onSelectionChanged: (checked: boolean) => void
  onClick: any
}

const ItemContainer = css({
  boxSizing: 'border-box',
  cursor: 'pointer',
  display: 'block',
  padding: 'var(--rmsc-p)',
  outline: 0,
  '&:hover,&:focus': {
    background: 'var(--rmsc-hover)',
  },
  '&.selected': {
    background: 'var(--rmsc-selected)',
  },
})

export default function SelectItem({
  itemRenderer: ItemRenderer = DefaultItemRenderer,
  option,
  checked,
  focused = false,
  tabIndex = -1,
  disabled = false,
  onSelectionChanged,
  onClick,
}: ISelectItemProps): JSX.Element {
  const itemRef: any = useRef()

  const updateFocus = () => {
    if (focused && !disabled && itemRef) {
      itemRef.current.focus()
    }
  }

  useEffect(() => {
    updateFocus()
    // eslint-disable-next-line
  }, [focused])

  const toggleChecked = () => {
    onSelectionChanged(!checked)
  }

  const handleClick = (e: any) => {
    toggleChecked()
    onClick(e)
  }

  const handleKeyDown = (e: any) => {
    switch (e.which) {
      case 13: // Enter
      case 32: // Space
        toggleChecked()
        break
      default:
        return
    }
    e.preventDefault()
  }

  return (
    <label
      className={`${ItemContainer} select-item ${checked && 'selected'}`}
      role='option'
      aria-selected={checked}
      tabIndex={tabIndex}
      ref={itemRef}
      onKeyDown={handleKeyDown}
    >
      <ItemRenderer
        option={option}
        checked={checked}
        onClick={handleClick}
        disabled={disabled}
      />
    </label>
  )
}
