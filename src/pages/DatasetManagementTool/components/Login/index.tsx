import React, { useState } from 'react'
import { Button, TextField, CircularProgress } from '@material-ui/core'
import clsx from 'clsx'
import { useSelector } from 'react-redux'
// src
import { SettingsState } from 'components/Modals/AlertVMSModal'

import useStyles from './styles'

export interface LoginProps {
  username: string
  password: string
}

interface TextEvent {
  target: { value: React.SetStateAction<string> }
}

export default function DMSLogin({
  onConfirm,
  loading,
}: {
  onConfirm: ({ username, password }: LoginProps) => void
  loading: boolean
}): JSX.Element {
  const darkMode = useSelector(
    (state: SettingsState) => state.settings.darkMode,
  )
  const classes = useStyles({ darkMode })
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const onUsernameChange = (event: TextEvent) => {
    if (event.target.value) {
      setUsername(event.target.value)
    } else {
      setUsername('')
    }
  }

  const onPasswordChange = (event: TextEvent) => {
    if (event.target.value) {
      setPassword(event.target.value)
    } else {
      setPassword('')
    }
  }

  const confirm = () => {
    onConfirm({ username, password })
  }

  return (
    <div>
      <div className='am-h4' style={{ textAlign: 'left', marginBottom: 24 }}>
        Dataset Management Login
      </div>
      <TextField
        className={clsx(classes.container)}
        InputProps={{
          className: clsx(classes.input),
          classes: {
            notchedOutline: clsx(classes.input),
          },
        }}
        variant='outlined'
        placeholder='Username'
        margin='normal'
        required
        fullWidth
        id='username'
        label='Username'
        name='Username'
        autoFocus
        value={username}
        onChange={onUsernameChange}
        disabled={loading}
      />
      <TextField
        className={clsx(classes.container)}
        InputProps={{
          className: clsx(classes.input),
          classes: {
            notchedOutline: clsx(classes.input),
          },
        }}
        variant='outlined'
        placeholder='Password'
        margin='normal'
        required
        fullWidth
        id='password'
        label='Password'
        name='Password'
        type='password'
        value={password}
        onChange={onPasswordChange}
        disabled={loading}
      />
      <Button variant='outlined' onClick={confirm} disabled={loading}>
        Confirm
      </Button>
      {loading && <CircularProgress />}
    </div>
  )
}
