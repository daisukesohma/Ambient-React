import React from 'react'
import clsx from 'clsx'

// src
import { useStyles } from './styles'

export interface ItemType {
  label: string
  onClick: () => void
  hoverColor?: string
}

export interface ClickType {
  stopPropagation: () => void
  currentTarget: Element
}

interface MenuItemType {
  darkMode: boolean
  handleClose: (event: ClickType) => void
  item: ItemType
  textClass: string | undefined
}

export default function MenuItem({
  darkMode,
  handleClose,
  item,
  textClass,
}: MenuItemType): JSX.Element {
  const classes = useStyles({ darkMode, hoverColor: item.hoverColor })
  const handleClick = (event: ClickType) => {
    if ('onClick' in item) item.onClick()
    handleClose(event)
  }

  // defaults text size to 'am-caption', but takes custom text size class name
  return (
    <div
      className={clsx(
        textClass || 'am-caption',
        classes.menuText,
        classes.menuItem,
      )}
      role='button'
      tabIndex={0}
      aria-describedby={item.label}
      onClick={handleClick}
      onKeyDown={e => {
        if (e.keyCode === 13) {
          handleClick(e)
        }
      }}
    >
      {item.label}
    </div>
  )
}
