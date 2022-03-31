import React from 'react'
import { useSelector } from 'react-redux'
import { ThemeProvider } from '@material-ui/core/styles'
import { getTheme } from 'theme'
import CssBaseline from '@material-ui/core/CssBaseline'
// src
import { SettingsSliceProps as SSP } from 'redux/slices/settings'

interface Props {
  children: JSX.Element
}

export default function MainThemeProvider({ children }: Props): JSX.Element {
  const darkMode = useSelector((state: SSP) => state.settings.darkMode)
  return (
    <ThemeProvider theme={getTheme({ darkMode })}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}
