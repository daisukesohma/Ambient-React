import React from 'react'
import { Chip } from '@material-ui/core'
import { toLower, isEmpty, capitalize, truncate } from 'lodash'
import clsx from 'clsx'
import { SeverityToReadableTextEnum } from 'enums'

import useStyles from './styles'

interface Props {
  severity: 'sev0' | 'sev1' | 'sev2'
}

export default function AlertsSeverity({
  severity,
}: Props): JSX.Element | null {
  const classes = useStyles()

  if (isEmpty(severity)) return null

  const sev = toLower(severity)
  const enumValue = SeverityToReadableTextEnum[sev]
  const label =
    enumValue === 'medium'
      ? truncate(enumValue, { length: 3, omission: '' })
      : enumValue

  return (
    <Chip
      label={capitalize(label)}
      classes={{
        root: clsx(classes.root, classes[enumValue]),
        label: classes.label,
      }}
    />
  )
}
