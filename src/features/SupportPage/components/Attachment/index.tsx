// TODO ts ignore for Close. Close has errors without it. need to convert it to ts.

import React from 'react'
import Grid from '@material-ui/core/Grid'
import { IconButton } from '@material-ui/core'
// src
import { Icons } from 'ambient_ui'
import { useTheme } from '@material-ui/core/styles'

import ProcessedFile from '../ProcessedFile'

import useStyles from './styles'

const { Close } = Icons

interface Props {
  file: ProcessedFile
  darkMode: boolean
  onDelete: (file: ProcessedFile) => void
}

export default function Attachment({
  file,
  darkMode,
  onDelete,
}: Props): JSX.Element {
  const { palette } = useTheme()
  const classes = useStyles({ darkMode })

  const deleteClick = () => {
    onDelete(file)
  }

  return (
    <Grid
      item
      container
      direction='row'
      alignItems='flex-start'
      justify='space-between'
      className={classes.root}
    >
      <Grid item className={classes.name}>
        {file.name}
      </Grid>
      <Grid item>
        <IconButton classes={{ root: classes.close }} onClick={deleteClick}>
          <Close
            width={18}
            height={18}
            stroke={palette.common.white}
            fillOnlyIcon
          />
        </IconButton>
      </Grid>
    </Grid>
  )
}
