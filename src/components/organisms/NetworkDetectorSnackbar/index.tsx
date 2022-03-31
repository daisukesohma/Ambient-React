import React, { useEffect, useState } from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import Button from '@material-ui/core/Button'

export default function NetworkDetectorSnackbar(): JSX.Element {
  const [isDisconnected, setIsDisconnected] = useState(!navigator.onLine)

  const handleConnectionChange = (): void => {
    setIsDisconnected(!navigator.onLine)
  }

  useEffect(() => {
    window.addEventListener('online', handleConnectionChange)
    window.addEventListener('offline', handleConnectionChange)
    return () => {
      window.removeEventListener('online', handleConnectionChange)
      window.removeEventListener('offline', handleConnectionChange)
    }
  }, [])

  const handleRefresh = () => {
    window.location.reload()
  }

  const action = (
    <Button color='secondary' size='small' onClick={handleRefresh}>
      RETRY
    </Button>
  )

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={isDisconnected}
      message='Unable to reach Ambient.ai servers. Please check your internet connection'
      action={action}
    />
  )
}
