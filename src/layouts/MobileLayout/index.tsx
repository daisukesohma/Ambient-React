import React from 'react'
import { ThemeProvider } from '@material-ui/core/styles'
import { getTheme } from 'theme'

// src
import useStyles from './styles'

interface Props {
  children: JSX.Element
}

export default function MobileLayout({ children }: Props): JSX.Element {
  const classes = useStyles()

  // NOTE: Disable Dark Mode for all Mobile Alert Pages
  return (
    <ThemeProvider theme={getTheme({ darkMode: false })}>
      <div className={classes.mobileLayout}>
        <main className={classes.main}>{children}</main>
      </div>
    </ThemeProvider>
  )
}
