import React from 'react'
import { useSelector } from 'react-redux'
import clsx from 'clsx'
import get from 'lodash/get'
import { InventoryStatusEnum, InventoryStatusReadableEnum } from 'enums'

import useStyles from './styles'

const GREEN = 'GREEN'
const YELLOW = 'YELLOW'
const RED = 'RED'
const BLUE = 'BLUE'
const DEFAULT = 'DEFAULT'

const STATUS_COLOR = {
  NEW: GREEN,
  PENDING_BUILD: YELLOW,
  PENDING_INSTALLATION: YELLOW,
  READY_FOR_REVIEW: GREEN,
  READY_TO_SHIP: YELLOW,
  SHIPPED: DEFAULT,
  DELIVERED: GREEN,
  ONLINE: GREEN,
  PROVISIONED: BLUE,
  BLOCKED: RED,
}

const StatusField = ({ rowData, darkMode }) => {
  const { node } = rowData
  const { status } = node
  const provisionStatuses = useSelector(
    state => state.inventory.provisionStatuses,
  )

  const classes = useStyles()
  const transitionStatus = get(
    provisionStatuses.find(x => x.id === status),
    'status',
  )

  return (
    <div
      className={clsx({
        [classes.statusGreen]: STATUS_COLOR[transitionStatus] === GREEN,
        [classes.statusYellow]: STATUS_COLOR[transitionStatus] === YELLOW,
        [classes.statusRed]: STATUS_COLOR[transitionStatus] === RED,
        [classes.statusBlue]: STATUS_COLOR[transitionStatus] === BLUE,
      })}
    >
      {InventoryStatusReadableEnum[transitionStatus]}
    </div>
  )
}

export default StatusField
