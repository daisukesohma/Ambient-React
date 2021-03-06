/**
 * A generic dropdown component.  It takes the children of the component
 * and hosts it in the component.  When the component is selected, it
 * drops-down the contentComponent and applies the contentProps.
 */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-props-no-spreading */
import { css } from 'goober'
import React, { useEffect, useRef, useState } from 'react'

import getString from '../lib/get-string'
import Cross from '../select-panel/cross'

import Arrow from './arrow'
import Loading from './loading'

interface IDropdownProps {
  children: JSX.Element
  contentComponent: any
  contentProps: any
  isLoading: boolean | undefined
  disabled: boolean | undefined
  shouldToggleOnHover: boolean | undefined
  labelledBy: string | undefined
  onMenuToggle: any
  ArrowRenderer: any
  ClearSelectedIcon: any
}

const PanelContainer = css({
  position: 'absolute',
  zIndex: 1,
  top: '100%',
  width: '100%',
  paddingTop: '8px',
  '.panel-content': {
    maxHeight: '300px',
    overflowY: 'auto',
    borderRadius: 'var(--rmsc-radius)',
    background: 'var(--rmsc-bg)',
    boxShadow: '0px 0px 9px 0px black',
  },
})

const DropdownContainer = css({
  position: 'relative',
  outline: 0,
  backgroundColor: 'var(--rmsc-bg)',
  border: '1px solid var(--rmsc-border)',
  borderRadius: 'var(--rmsc-radius)',
  // border around header
  // "&:focus-within": {
  //   boxShadow: "var(--rmsc-main) 0 0 0 1px",
  //   borderColor: "var(--rmsc-main)",
  // },
})

const DropdownHeading = css({
  position: 'relative',
  padding: '0 var(--rmsc-p)',
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  height: 'var(--rmsc-h)',
  cursor: 'default',
  outline: 0,
  '.dropdown-heading-value': {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    flex: 1,
  },
})

const ClearSelectedButton = css({
  cursor: 'pointer',
  background: 'none',
  border: 0,
  padding: 0,
})

export default function Dropdown({
  children = <div />,
  contentComponent: ContentComponent,
  contentProps,
  isLoading = false,
  disabled = false,
  shouldToggleOnHover = false,
  labelledBy = undefined,
  onMenuToggle = () => {},
  ArrowRenderer,
  ClearSelectedIcon = () => {},
}: IDropdownProps): JSX.Element {
  const [expanded, setExpanded] = useState(false)
  const [hasFocus, setHasFocus] = useState(false)
  const FinalArrow = ArrowRenderer || Arrow

  const wrapper: any = useRef()

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (onMenuToggle) onMenuToggle(expanded)
  }, [expanded])

  const handleKeyDown = (e: any) => {
    switch (e.which) {
      case 27: // Escape
      case 38: // Up Arrow
        setExpanded(false)
        wrapper.current.focus()
        break
      case 32: // Space
      case 13: // Enter Key
      case 40: // Down Arrow
        setExpanded(true)
        break
      default:
        return
    }
    e.preventDefault()
  }

  const handleHover = (iexpanded: boolean) => {
    if (shouldToggleOnHover) setExpanded(iexpanded)
  }

  const handleFocus = () => !hasFocus && setHasFocus(true)

  const handleBlur = (e: any) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setHasFocus(false)
      setExpanded(false)
    }
  }

  const handleMouseEnter = () => handleHover(true)

  const handleMouseLeave = () => handleHover(false)

  const toggleExpanded = () =>
    setExpanded(isLoading || disabled ? false : !expanded)

  const handleClearSelected = (e: any) => {
    e.stopPropagation()
    contentProps.onChange([])
  }

  return (
    <div
      tabIndex={0}
      className={`${DropdownContainer} dropdown-container`}
      aria-labelledby={labelledBy}
      aria-expanded={expanded}
      aria-readonly
      aria-disabled={disabled}
      ref={wrapper}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`${DropdownHeading} dropdown-heading`}
        onClick={toggleExpanded}
      >
        <div className='dropdown-heading-value'>{children}</div>
        {isLoading && <Loading size={24} />}
        {contentProps.value.length > 0 && (
          <button
            type='button'
            className={`${ClearSelectedButton} clear-selected-button`}
            onClick={handleClearSelected}
            aria-label={getString(
              'clearSelected',
              contentProps.overrideStrings,
            )}
          >
            {ClearSelectedIcon || <Cross />}
          </button>
        )}
        <FinalArrow expanded={expanded} />
      </div>
      {expanded && (
        <div className={`${PanelContainer} dropdown-content`}>
          <div className='panel-content'>
            <ContentComponent {...contentProps} />
          </div>
        </div>
      )}
    </div>
  )
}
