import React from 'react'
import Paper from '@material-ui/core/Paper'
import { ThemeProvider } from '@material-ui/core/styles'
import { getTheme } from 'theme'

// src
import useStyles from './styles'

interface Props {
  children: JSX.Element
}

export default function AuthLayout({ children }: Props): JSX.Element {
  const classes = useStyles()

  // NOTE: Disable Dark Mode for all Auth Group Pages
  return (
    <ThemeProvider theme={getTheme({ darkMode: false })}>
      <div className={classes.authLayout}>
        <Paper square elevation={0} className={classes.main}>
          {children}
        </Paper>
      </div>
    </ThemeProvider>
  )
}
