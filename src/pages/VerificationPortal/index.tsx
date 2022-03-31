import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// src
import { SettingsSliceProps } from 'redux/slices/settings'

import {
  allStreamsRequested,
  allThreatSignaturesRequested,
  sitesFetchRequested,
} from './redux/verificationSlice'
import TopBar from './components/TopBar'
import AlertFeedPanel from './components/AlertFeedPanel'
import HistoricalPanel from './components/HistoricalPanel'
import ConfirmVerifyModal from './components/ConfirmVerifyModal'
import useStyles from './styles'

// TODO: move it to verification slice
interface VerificationSliceProps {
  verification: {
    isExpanded: boolean
  }
}

export default function VerificationPortal(): JSX.Element {
  const dispatch = useDispatch()
  const darkMode = useSelector(
    (state: SettingsSliceProps) => state.settings.darkMode,
  )
  const isExpanded = useSelector(
    (state: VerificationSliceProps) => state.verification.isExpanded,
  )
  const classes = useStyles({ darkMode, isExpanded })

  useEffect(() => {
    dispatch(sitesFetchRequested())
    dispatch(allStreamsRequested({}))
    dispatch(allThreatSignaturesRequested({}))
  }, [dispatch])

  return (
    <div className={classes.container}>
      <TopBar />
      <div className={classes.contentWrapper}>
        <div className={classes.mainPanel}>
          <AlertFeedPanel />
        </div>
        <div className={classes.rightPanel}>
          <HistoricalPanel />
        </div>
      </div>
      <ConfirmVerifyModal />
    </div>
  )
}
