import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { isMobileOnly } from 'react-device-detect'
import isUndefined from 'lodash/isUndefined'
import Paper from '@material-ui/core/Paper'
import { ThemeProvider } from '@material-ui/core/styles'
import { getTheme } from 'theme'
// src
import Sidebar from 'components/Sidebar'
import WalkThru from 'components/WalkThru'
import NotSupportedPage from 'components/NotSupportedPage'
import IntroModal from 'components/Modals/IntroModal'
import Modal from 'components/Modal'
import { SidebarOptionsPropType } from 'common/data/proptypes/SidebarPropType'

import useStyles from './styles'

const defaultProps = {
  darkMode: undefined,
  hasMobileVersion: true,
  spacing: 2,
  sidebar: true,
}

const propTypes = {
  children: PropTypes.object,
  darkMode: PropTypes.bool,
  sidebar: PropTypes.bool,
  hasMobileVersion: PropTypes.bool,
  spacing: PropTypes.number,
  sidebarOptions: SidebarOptionsPropType,
}

const SidebarLayout = ({
  children,
  darkMode, // if present, use this as the darkMode value. Used to "force" darkMode to be true or false regardless of the user setting
  sidebar, // if you need hide sidebar, you can use this prop (Default: true)
  hasMobileVersion, // if false, don't show this page on mobile
  spacing,
  sidebarOptions,
}) => {
  const [showIntroModal, setShowIntroModal] = useState(false)

  const darkModeSetting = useSelector(state => state.settings.darkMode)
  const isNewUser = useSelector(state => state.auth.isNewUser)

  const resultDarkMode = isUndefined(darkMode) ? darkModeSetting : darkMode

  const classes = useStyles({
    darkMode: resultDarkMode,
    mobile: isMobileOnly,
    spacing,
  })

  const supportedPage = hasMobileVersion || !isMobileOnly

  // NOTE: do we need IntroModal? and old WalkThru Modal?
  useEffect(() => {
    if (isNewUser) setShowIntroModal(true)
  }, [isNewUser])

  const content = (
    <div className={classes.sidebarLayout}>
      {sidebar && <Sidebar {...sidebarOptions} />}
      <Paper square elevation={0} className={classes.main}>
        {supportedPage ? children : <NotSupportedPage />}
      </Paper>
      {showIntroModal && (
        <IntroModal
          open={showIntroModal}
          onClose={() => setShowIntroModal(false)}
        />
      )}
      <WalkThru />
      <Modal />
    </div>
  )

  // TODO: Remove this temporary wrapper when we convert all pages to Light/Dark Mode
  return (
    <ThemeProvider theme={getTheme({ darkMode: resultDarkMode })}>
      {content}
    </ThemeProvider>
  )
}

SidebarLayout.defaultProps = defaultProps
SidebarLayout.propTypes = propTypes

export default SidebarLayout
