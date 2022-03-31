import React from 'react'
import { useFlexStyles } from 'common/styles/commonStyles'
import { Can } from 'rbac'
import clsx from 'clsx'

import RequestSupportAccessModal from '../RequestSupportAccessModal'

import { useStyles } from './styles'

interface Props {
  account: string | null
  requested: boolean
  noAccessText: string | null
  onRequestClick: () => void
  darkMode: boolean
}

export default function SupportAccessForm({
  account = null,
  requested = false,
  noAccessText = null,
  onRequestClick = () => {},
  darkMode = false,
}: Props): JSX.Element {
  const classes = useStyles({ darkMode })
  const flexClasses = useFlexStyles()

  return (
    <div>
      <div className={clsx(flexClasses.row, classes.container)}>
        <div className={clsx('am-h3', classes.noAccessText)}>
          <div>{noAccessText}</div>
        </div>
      </div>
      {!requested && (
        <Can I='request' on='SupportAccess'>
          <div className={classes.form}>
            <RequestSupportAccessModal
              account={account}
              nonModal
              onRequestClick={onRequestClick}
            />
          </div>
        </Can>
      )}
    </div>
  )
}
