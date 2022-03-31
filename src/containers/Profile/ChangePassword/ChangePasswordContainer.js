import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { useHistory, useParams } from 'react-router-dom'
import { useMutation } from '@apollo/react-hooks'
import { connect, useSelector } from 'react-redux'
import { compose } from 'redux'
import Box from '@material-ui/core/Box'
import CheckIcon from '@material-ui/icons/Check'
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline'
import HighlightOffIcon from '@material-ui/icons/HighlightOff'
import ClearIcon from '@material-ui/icons/Clear'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import { Button } from 'ambient_ui'
import PasswordValidator from 'password-validator'
// src
import { createNotification as createNotificationAction } from 'redux/slices/notifications'

import { UPDATE_PASSWORD } from './gql'
import useStyles from './styles'

const schema = new PasswordValidator()
schema
  .is()
  .min(8)
  .has()
  .uppercase()
  .has()
  .digits()
  .has()
  .symbols()

const doPasswordsMatch = (x, y) => {
  return (x || y) && x === y
}

const ChangePassword = ({ createNotification, togglePasswordMode }) => {
  const history = useHistory()
  const { account } = useParams()
  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({ darkMode })

  const [_oldPassword, setOldPassword] = useState()
  const [_newPassword1, setNewPassword1] = useState()
  const [_newPassword2, setNewPassword2] = useState()
  const [oldPasswordHelper, setOldPasswordHelper] = useState({
    isValid: false,
    text: 'Enter your current password',
  })
  const [newPassword1Helper, setNewPassword1Helper] = useState({
    isValid: true,
    text: 'Enter password again',
  })
  const [newPassword2Helper, setNewPassword2Helper] = useState({
    isValid: true,
    text: 'Enter password again',
  })
  const [isUpdateInProgress, setIsUpdateInProgress] = useState()
  const [updateStatus, setUpdateStatus] = useState({ ok: false })

  const [
    updatePasswordRequest,
    { loading: updatePasswordInProgress, data: updatePasswordData },
  ] = useMutation(UPDATE_PASSWORD)

  const updatePassword = () => {
    updatePasswordRequest({
      variables: {
        currentPassword: _oldPassword,
        newPassword: _newPassword1,
      },
    })
  }

  useEffect(() => {
    if (updatePasswordInProgress) {
      createNotification({ message: 'Updating password.' })
      setIsUpdateInProgress(true)
    } else {
      setIsUpdateInProgress(false)
    }
    // eslint-disable-next-line
  }, [updatePasswordInProgress])

  useEffect(() => {
    if (updatePasswordData) {
      const { ok, message } = updatePasswordData.updatePassword
      if (ok) {
        setUpdateStatus({
          ok,
          message:
            'Password updated successfully! Redirecting to your profile page...',
        })
        setTimeout(() => {
          history.push(`/accounts/${account}/settings/profile`)
        }, 2000)
      } else {
        setUpdateStatus({
          ok,
          message: `Password could not be updated. Reason: ${message}`,
        })
      }
    }
  }, [updatePasswordData, account, history])

  useEffect(() => {
    if (_newPassword2 && _newPassword2 !== _newPassword1) {
      setNewPassword2Helper({ isValid: false, text: 'Password does not match' })
    } else {
      setNewPassword2Helper({ isValid: true, text: 'Enter password again' })
    }
  }, [_newPassword1, _newPassword2])

  useEffect(() => {
    if (_oldPassword) {
      const isValid = schema.validate(_oldPassword)
      setOldPasswordHelper({
        isValid,
        text: isValid
          ? 'Enter your current password'
          : 'Minimum 8 characters, Include capitalization, 1 special character (!@#$%^*() and 1 digit',
      })
    } else {
      setOldPasswordHelper({
        isValid: true,
        text: 'Enter your current password',
      })
    }
  }, [_oldPassword])

  useEffect(() => {
    if (_newPassword1) {
      const isValid = schema.validate(_newPassword1)
      setNewPassword1Helper({
        isValid,
        text: isValid
          ? 'Enter your new password'
          : 'Minimum 8 characters, Include capitalization, 1 special character (!@#$%^*() and 1 digit',
      })
    } else {
      setNewPassword1Helper({
        isValid: true,
        text: 'Enter your new password',
      })
    }
  }, [_newPassword1])

  return (
    <Grid container className={classes.root} spacing={2}>
      <Grid item lg={12} md={12} sm={12} xs={12}>
        <Grid container className={classes.container}>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <div className={clsx('am-h6', classes.title)}>Change Password</div>
          </Grid>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <TextField
              type='password'
              required
              fullWidth
              label='Current Password'
              value={_oldPassword}
              error={!oldPasswordHelper.isValid}
              helperText={oldPasswordHelper.text}
              onChange={event => setOldPassword(event.target.value)}
              margin='normal'
              InputLabelProps={{
                classes: {
                  root: classes.inputLabelRoot,
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    {_oldPassword &&
                      (oldPasswordHelper.isValid ? (
                        <CheckCircleOutlineIcon size='small' color='primary' />
                      ) : (
                        <HighlightOffIcon size='small' color='error' />
                      ))}
                  </InputAdornment>
                ),
              }}
              FormHelperTextProps={{
                classes: {
                  root: classes.formHelperRoot,
                },
              }}
            />
          </Grid>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <TextField
              type='password'
              required
              fullWidth
              label='New Password'
              value={_newPassword1}
              error={!newPassword1Helper.isValid}
              helperText={newPassword1Helper.text}
              onChange={event => setNewPassword1(event.target.value)}
              margin='normal'
              InputLabelProps={{
                classes: {
                  root: classes.inputLabelRoot,
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    {_newPassword1 &&
                      (newPassword1Helper.isValid ? (
                        <CheckCircleOutlineIcon size='small' color='primary' />
                      ) : (
                        <HighlightOffIcon size='small' color='error' />
                      ))}
                  </InputAdornment>
                ),
              }}
              FormHelperTextProps={{
                classes: {
                  root: classes.formHelperRoot,
                },
              }}
            />
          </Grid>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <TextField
              type='password'
              required
              fullWidth
              label='Confirm Password'
              value={_newPassword2}
              error={!newPassword2Helper.isValid}
              helperText={newPassword2Helper.text}
              onChange={event => setNewPassword2(event.target.value)}
              margin='normal'
              InputLabelProps={{
                classes: {
                  root: classes.inputLabelRoot,
                },
              }}
              InputProps={{
                classes: {
                  root: classes.inputRoot,
                  underline: classes.inputUnderline,
                },
                endAdornment: (
                  <InputAdornment position='end'>
                    {_newPassword2 &&
                      (newPassword2Helper.isValid ? (
                        <CheckCircleOutlineIcon size='small' color='primary' />
                      ) : (
                        <HighlightOffIcon size='small' color='error' />
                      ))}
                  </InputAdornment>
                ),
              }}
              FormHelperTextProps={{
                classes: {
                  root: classes.formHelperRoot,
                },
              }}
            />
          </Grid>
          <Grid
            item
            lg={12}
            md={12}
            sm={12}
            xs={12}
            className={classes.btnContainer}
          >
            <Button
              color='primary'
              variant='text'
              aria-label='cancel'
              size='medium'
              className={classes.cancelBtn}
              onClick={togglePasswordMode}
            >
              Cancel
            </Button>
            <Button
              color='primary'
              variant='contained'
              aria-label='save'
              size='medium'
              disabled={
                isUpdateInProgress ||
                !doPasswordsMatch(_newPassword1, _newPassword2) ||
                !oldPasswordHelper.isValid ||
                !newPassword1Helper.isValid
              }
              onClick={event => {
                updatePassword()
                togglePasswordMode()
              }}
            >
              Save
            </Button>
          </Grid>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Box
              display='flex'
              flexDirection='row'
              alignItems='center'
              justifyContent='center'
            >
              <Box>
                {updateStatus.ok && updateStatus.message && (
                  <CheckIcon color='primary' />
                )}
                {!updateStatus.ok && updateStatus.message && (
                  <ClearIcon color='error' />
                )}
              </Box>
              <Box>
                <Typography color={updateStatus.ok ? 'success' : 'error'}>
                  {updateStatus.message}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

ChangePassword.defaultProps = {
  createNotification: () => {},
  togglePasswordMode: () => {},
}

ChangePassword.propTypes = {
  createNotification: PropTypes.func,
  togglePasswordMode: PropTypes.func,
}

const mapDispatchToProps = dispatch => ({
  createNotification: message => dispatch(createNotificationAction(message)),
})

export default compose(
  connect(
    null,
    mapDispatchToProps,
  ),
)(ChangePassword)
