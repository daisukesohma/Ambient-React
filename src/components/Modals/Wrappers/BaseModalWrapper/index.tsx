/* eslint-disable @typescript-eslint/ban-types */
import React from 'react'
import { useSelector } from 'react-redux'

import useStyles from './styles'

interface Props {
  children: React.ReactNode
  rootStyle?: object
  withDarkMode?: boolean
  width?: string
  height?: string
}

// NOTE: import it from reducers in future
interface SettingsState {
  settings: {
    darkMode: boolean
  }
}

const defaultProps = {
  height: '100%',
  rootStyle: {},
  width: '100%',
  withDarkMode: true,
}

function BaseModalWrapper({
  children,
  height,
  rootStyle,
  width,
  withDarkMode,
}: Props): JSX.Element {
  const darkMode = useSelector(
    (state: SettingsState) => state.settings.darkMode,
  )
  const classes = useStyles({
    darkMode: withDarkMode ? darkMode : false,
    width,
    height,
  })

  return (
    <div className={classes.modalPaper} style={rootStyle}>
      {children}
    </div>
  )
}

BaseModalWrapper.defaultProps = defaultProps
export default BaseModalWrapper
