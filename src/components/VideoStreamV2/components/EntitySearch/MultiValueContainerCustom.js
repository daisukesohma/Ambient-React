/* eslint react/prop-types: 0 */
// custom component for react-select
// relies on internal react-select props
//
import React from 'react'
import Chip from '@material-ui/core/Chip'
import { Icon } from 'ambient_ui'
import { makeStyles, useTheme } from '@material-ui/core/styles'

import LabelWrapper from './LabelWrapper'
import { _concatMultiLabels } from './utils'

const useStyles = makeStyles(({ palette }) => ({
  outlined: ({ darkMode }) => ({
    border: darkMode
      ? `1px solid ${palette.grey[600]}`
      : '1px solid transparent',
  }),
}))

const MultiValueContainerCustom = ({
  clearEntities,
  data,
  darkMode,
  selectProps,
  ...props
}) => {
  const { palette } = useTheme()
  const classes = useStyles({ darkMode })

  const label = (
    <LabelWrapper darkMode={darkMode}>
      {_concatMultiLabels(selectProps.value)}
    </LabelWrapper>
  )

  if (data.value === selectProps.value[0].value) {
    const deleteButton = (
      <span
        style={{
          marginLeft: 5,
          borderRadius: '50%',
          background: darkMode ? palette.common.white : palette.grey[400],
          height: 16,
          width: 16,
        }}
      >
        <Icon
          icon='close'
          size={14}
          color={darkMode ? palette.primary.main : palette.common.white}
          style={{ transform: 'translate(1px, -2.5px)' }}
        />
      </span>
    )

    return (
      <Chip
        label={label}
        variant='outlined'
        {...(!darkMode && { color: 'primary' })}
        onDelete={clearEntities}
        deleteIcon={deleteButton}
        classes={{
          outlined: classes.outlined,
        }}
      />
    )
  }
  return null
}

export default MultiValueContainerCustom
