/* eslint react/prop-types: 0 */
// custom react-select component, relies on internal props
//
import React from 'react'
import Chip from '@material-ui/core/Chip'
import { makeStyles } from '@material-ui/core/styles'

import LabelWrapper from './LabelWrapper'
import { _concatMultiLabels } from './utils'

const useStyles = makeStyles(({ palette }) => ({
  outlined: ({ darkMode }) => ({
    border: darkMode
      ? `1px solid ${palette.grey[600]}`
      : '1px solid transparent',
  }),
}))

const OptionCustom = ({ darkMode, data, innerProps, selectedEntities }) => {
  const classes = useStyles({ darkMode })
  const label = (
    <LabelWrapper darkMode={darkMode}>
      {selectedEntities && _concatMultiLabels([...selectedEntities, data])}
    </LabelWrapper>
  )

  return (
    <div {...innerProps} style={{ marginRight: 5 }}>
      <Chip
        label={label}
        variant='outlined'
        {...(!darkMode && { color: 'primary' })}
        classes={{
          outlined: classes.outlined,
        }}
      />
    </div>
  )
}

export default OptionCustom
