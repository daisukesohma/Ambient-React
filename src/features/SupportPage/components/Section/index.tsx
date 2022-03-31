// TODO ts ignore for Button. Button has errors without it. need to convert it to ts.

import React from 'react'
import Grid from '@material-ui/core/Grid'
import map from 'lodash/map'
// src
import { Button } from 'ambient_ui'

import { useStyles } from './styles'

interface Props {
  title: string | null
  darkMode: boolean
  content: string[]
  button: string | null
  buttonFunction: null | (() => void)
  key: string
  icon: JSX.Element | null
}

export default function Section({
  title,
  darkMode,
  content,
  button = null,
  buttonFunction = null,
  key,
  icon = null,
}: Props): JSX.Element {
  const classes = useStyles({ darkMode })

  return (
    <Grid
      lg={12}
      md={12}
      sm={12}
      xs={12}
      item
      container
      spacing={2}
      className={classes.container}
      key={key}
    >
      <Grid item container alignItems='stretch' className={classes.title}>
        {icon && <div className={classes.icon}>{icon}</div>}
        {title}
      </Grid>
      <Grid item container spacing={2}>
        {map(content, (c, index) => {
          const contentKey = `${key}_${index}`
          return (
            <Grid item key={contentKey}>
              {c}
            </Grid>
          )
        })}
      </Grid>
      {button && (
        <div className={classes.button}>
          <Button onClick={buttonFunction}>{button}</Button>
        </div>
      )}
    </Grid>
  )
}
