import React from 'react'
import { useSelector } from 'react-redux'
import { Button } from '@material-ui/core'
// src
import { SettingsSliceProps } from 'redux/slices/settings'
import CircularProgress from 'ambient_ui/components/common/CircularProgress'

import useStyles from './styles'

interface AreYouSureLayoutProps {
  handleDone: () => void
  handleCancel: () => void
  loading: boolean
}

// TODO AMB-2276|@rys: refactor into ModalLayout.

export default function AreYouSureLayout({
  handleDone,
  handleCancel,
  loading,
}: AreYouSureLayoutProps): JSX.Element {
  const darkMode = useSelector(
    (state: SettingsSliceProps) => state.settings.darkMode,
  )
  const classes = useStyles({ darkMode })

  // TODO AMB-2277 pass body as a text
  const body =
    'You may miss an important alert if you turn monitoring off. Please confirm to proceed.'

  return (
    <div>
      <div className={classes.body}>{body}</div>
      <div className={classes.buttons}>
        {loading && (
          <CircularProgress color='primary' variant='indeterminate' size={18} />
        )}
        <Button
          variant='text'
          className={classes.cancel}
          onClick={handleCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          variant='contained'
          className={classes.submit}
          onClick={handleDone}
          disabled={loading}
        >
          Pause Alert
        </Button>
      </div>
    </div>
  )
}
