import React, { useState } from 'react'
import { useTheme } from '@material-ui/core/styles'
import { useSelector } from 'react-redux'
// src
import { OptionMenu } from 'ambient_ui'
import { Icon as IconKit } from 'react-icons-kit'
import { moreHorizontal } from 'react-icons-kit/feather/moreHorizontal'

import useStyles from './styles'

export default function ExtraMenu() {
  const { palette } = useTheme()
  const classes = useStyles()
  const darkMode = useSelector(state => state.settings.darkMode)
  const [isEditing, setIsEditing] = useState(false)

  return (
    <OptionMenu
      darkMode={darkMode}
      icon={
        <div className={classes.icon}>
          <IconKit icon={moreHorizontal} />
        </div>
      }
      menuItems={[
        {
          label: 'Edit Region',
          value: 'editRegion',
          onClick: () => {
            setIsEditing(!isEditing)
          },
          hoverColor: palette.primary.main,
        },
      ]}
      noBackground
    />
  )
}
