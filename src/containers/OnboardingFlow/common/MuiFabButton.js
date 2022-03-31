/* eslint-disable */
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/core/styles'
import Fab from '@material-ui/core/Fab'

import { THEME } from './styles'

const useStyles = makeStyles(theme => ({
  button: {
    width: 160,
    height: 36,
    borderRadius: 20,
    fontWeight: 400,
    fontSize: 14,
    marginTop: theme.spacing(2),
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  fab: {
    margin: theme.spacing(1),
  },
}))

export default function MuiFabButton(props) {
  const classes = useStyles()
  const {
    text,
    type,
    variant,
    color = 'primary',
    handleClick,
    size = 'medium',
  } = props
  return (
    <ThemeProvider theme={THEME}>
      <Fab
        variant={variant}
        size={size}
        type={type}
        color={color}
        className={classes.fab}
        onClick={handleClick}
      >
        {text}
        {props.children}
      </Fab>
    </ThemeProvider>
  )
}
