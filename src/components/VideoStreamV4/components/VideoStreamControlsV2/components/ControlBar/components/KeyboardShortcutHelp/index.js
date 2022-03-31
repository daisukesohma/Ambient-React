import React, { memo } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
// src
import { useFuturisticStyles, useFlexStyles } from 'common/styles/commonStyles'
import { Icon } from 'react-icons-kit'
import { arrowLeft } from 'react-icons-kit/feather/arrowLeft'
import { arrowRight } from 'react-icons-kit/feather/arrowRight'

import KeyShortcutDisplay from '../KeyShortcutDisplay'

import useStyles from './styles'

const propTypes = {
  isOpen: PropTypes.bool,
}

function KeyboardShortcutHelp({ isOpen }) {
  const classes = useStyles()
  const flexClasses = useFlexStyles()
  const futuristicClasses = useFuturisticStyles()

  if (!isOpen) return false

  return (
    <div id='keyboardHelp' className={classes.root}>
      <div className={classes.backgroundContainer}>
        <div
          className={clsx(
            'am-caption',
            futuristicClasses.iceSheet,
            flexClasses.column,
            flexClasses.centerAll,
          )}
          style={{ padding: 8 }}
        >
          <div className={clsx(flexClasses.row, classes.rowSpacing)}>
            Play / Pause
            <KeyShortcutDisplay keyName='Space' />
            <span style={{ marginLeft: 4 }}>or</span>
            <KeyShortcutDisplay keyName='K' />
          </div>

          <div className={clsx(flexClasses.row, classes.rowSpacing)}>
            Back / Forward 10s
            <KeyShortcutDisplay>
              <Icon icon={arrowLeft} size={12} />
            </KeyShortcutDisplay>
            /
            <KeyShortcutDisplay>
              <Icon icon={arrowRight} size={12} />
            </KeyShortcutDisplay>
          </div>

          <div className={clsx(flexClasses.row, classes.rowSpacing)}>
            Back / Forward 30s
            <KeyShortcutDisplay keyName='J' />
            /
            <KeyShortcutDisplay keyName='L' />
          </div>

          <div className={clsx(flexClasses.row, classes.rowSpacing)}>
            Change Timeline Range
            <KeyShortcutDisplay keyName='0' />
            <span style={{ marginLeft: 4 }}>-</span>
            <KeyShortcutDisplay keyName='9' />
          </div>
        </div>
      </div>
    </div>
  )
}

KeyboardShortcutHelp.propTypes = propTypes

export default memo(KeyboardShortcutHelp)
