import React from 'react'
import { Button, CircularProgress } from 'ambient_ui'
import { useDispatch, useSelector } from 'react-redux'
import TextField from '@material-ui/core/TextField'
import { isMobile } from 'react-device-detect'

// src
import {
  ReducerProps,
  changeView,
  updateForm,
  ssoLoginRequested,
} from '../../redux/loginSlice'
import { VIEWS } from '../../enums'

import useStyles from './styles'

export default function SSOLogin(): JSX.Element {
  const dispatch = useDispatch()
  const form = useSelector((state: ReducerProps) => state.login.form)
  const loading = useSelector((state: ReducerProps) => state.login.loading)
  const classes = useStyles({ isMobile })

  const ssoLogin = () => {
    dispatch(
      ssoLoginRequested({
        onSuccess: (data: { redirect_url: string }) => {
          window.open(data.redirect_url, '_self')
        },
      }),
    )
  }

  const onSSOLogin = (event: React.MouseEvent<HTMLElement>) => {
    if (event) {
      event.preventDefault()
      ssoLogin()
    }
  }

  const onSSOKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === 13) {
      event.preventDefault()
      ssoLogin()
    }
  }

  const handleAccountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      updateForm({
        field: 'accountSlug',
        value: event.target.value,
      }),
    )
  }

  const handleBack = () => {
    dispatch(changeView({ view: VIEWS.LOGIN }))
  }

  return (
    <div className={classes.paper}>
      <div className={classes.form}>
        <TextField
          autoComplete='accountSlug'
          autoFocus
          fullWidth
          id='accountSlug'
          label='Account Identifier'
          margin='normal'
          name='accountSlug'
          onChange={handleAccountChange}
          onKeyUp={onSSOKeyUp}
          required
          value={form.accountSlug}
          variant='outlined'
          InputLabelProps={{
            shrink: true,
          }}
        />

        <Button
          fullWidth
          variant='contained'
          color='secondary'
          className={classes.submit}
          onClick={onSSOLogin}
          disabled={loading}
        >
          {loading ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ marginRight: 10, marginTop: 5 }}>
                <CircularProgress size={14} />
              </div>
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ marginRight: 5 }}>Sign In with SSO Provider</div>
            </div>
          )}
        </Button>

        <Button
          fullWidth
          variant='text'
          color='primary'
          className={classes.submit}
          onClick={handleBack}
          disabled={loading}
        >
          Back
        </Button>
      </div>
    </div>
  )
}
