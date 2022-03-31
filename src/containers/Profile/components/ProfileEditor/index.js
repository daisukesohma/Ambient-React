import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import Select from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Box from '@material-ui/core/Box'
import { Icon } from 'ambient_ui'
import clsx from 'clsx'

import { useFlexStyles } from '../../../../common/styles/commonStyles'
import Tooltip from '../../../../components/Tooltip'
import { countryPhoneCodes } from '../../../../utils/countryCodeToPhone'

import useStyles from './styles'

function ProfileEditor({
  _firstName,
  _lastName,
  _email,
  _isoCode,
  _mfaOptIn,
  _phoneNumber,
  onInputChange,
  setFirstName,
  setLastName,
  setEmail,
  setIsoCode,
  setPhoneNumber,
  setMfaOptIn,
}) {
  const { palette } = useTheme()
  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({ darkMode })
  const flexClasses = useFlexStyles()

  return (
    <Grid container className={classes.container}>
      <Grid item lg={12} md={12} sm={12} xs={12}>
        <TextField
          required
          InputProps={{
            classes: {
              root: classes.inputRoot,
              underline: classes.inputUnderline,
            },
          }}
          InputLabelProps={{
            classes: {
              root: classes.inputLabelRoot,
            },
          }}
          className={classes.textField}
          id='standard-first-name'
          label='First Name'
          placeholder='First Name'
          value={_firstName}
          onChange={event => onInputChange(setFirstName, event.target.value)}
          margin='normal'
        />
      </Grid>
      <Grid item lg={12} md={12} sm={12} xs={12}>
        <TextField
          required
          InputProps={{
            classes: {
              root: classes.inputRoot,
              underline: classes.inputUnderline,
            },
          }}
          InputLabelProps={{
            classes: {
              root: classes.inputLabelRoot,
            },
          }}
          className={classes.textField}
          id='standard-last-name'
          label='Last  Name'
          placeholder='Last Name'
          value={_lastName}
          onChange={event => onInputChange(setLastName, event.target.value)}
          margin='normal'
        />
      </Grid>
      <Grid item lg={12} md={12} sm={12} xs={12}>
        <TextField
          disabled
          InputProps={{
            classes: {
              root: classes.inputRoot,
              disabled: classes.inputRoot,
              underline: darkMode ? classes.inputUnderlineDark : null,
            },
          }}
          InputLabelProps={{
            classes: {
              root: classes.inputLabelRoot,
              disabled: darkMode ? classes.inputLabelDisabledDark : null,
            },
          }}
          FormHelperTextProps={{
            classes: {
              root: classes.formHelperRoot,
              disabled: darkMode ? classes.formHelperDisabledDark : null,
            },
          }}
          id='standard-email'
          fullWidth
          label='Email'
          placeholder='Email'
          value={_email}
          helperText='Ambient sends health notifications, activity digests and security alerts to this email'
          onChange={event => onInputChange(setEmail, event.target.value)}
          margin='normal'
        />
      </Grid>
      <Grid item lg={6} md={6} sm={12} xs={12} className={classes.column}>
        <FormControl className={classes.textField}>
          <InputLabel
            id='country-code-select-label'
            classes={{ root: classes.inputLabelRoot }}
          >
            Country Code
          </InputLabel>
          <Select
            classes={{ root: classes.selectRoot }}
            displayEmpty
            labelId='country-code-select-label'
            id='select-country-code'
            value={_isoCode}
            // helperText='Country code for primary phone number'
            onChange={event => onInputChange(setIsoCode, event.target.value)}
          >
            {countryPhoneCodes.map((item, index) => {
              return (
                <MenuItem
                  key={index}
                  value={item.iso2}
                  name={item.name}
                  className={classes.menuItem}
                >
                  {item.name} &nbsp; (+
                  {item.dialCode})
                </MenuItem>
              )
            })}
          </Select>
          <FormHelperText classes={{ root: classes.formHelperRoot }}>
            Country code for primary phone number
          </FormHelperText>
        </FormControl>
      </Grid>
      <Grid
        item
        lg={6}
        md={6}
        sm={12}
        xs={12}
        className={clsx(flexClasses.column, flexClasses.columnCenterStart)}
      >
        <TextField
          required
          InputProps={{
            classes: {
              root: classes.inputRoot,
              underline: classes.inputUnderline,
            },
          }}
          InputLabelProps={{
            classes: {
              root: classes.inputLabelRoot,
            },
          }}
          FormHelperTextProps={{
            classes: {
              root: classes.formHelperRoot,
            },
          }}
          id='standard-phone'
          label='Phone Number'
          placeholder='Phone Number'
          value={_phoneNumber}
          helperText='This is your primary phone number for security alerts. Make sure it is correct.'
          onChange={event => onInputChange(setPhoneNumber, event.target.value)}
          margin='normal'
        />
      </Grid>
      <Grid item lg={12} md={12} sm={12} xs={12}>
        <Box display='flex' flexDirection='row' alignItems='center'>
          <Box>
            <FormControlLabel
              classes={{
                label: classes.formControlLabel,
              }}
              control={
                <Checkbox
                  checked={_mfaOptIn}
                  onChange={event => onInputChange(setMfaOptIn, !_mfaOptIn)}
                  classes={{ root: classes.checkboxRoot }}
                />
              }
              label='Multi-factor Authentication'
            />
          </Box>
          <Box>
            <Tooltip
              content={
                <div>
                  <strong>Multifactor authentication (MFA)</strong>
                  &nbsp;is a security system that requires more than one method
                  of authentication from independent categories of credentials
                </div>
              }
              placement='right'
            >
              <div className={classes.flexItem}>
                <Icon icon='alertCircle' size={24} />
              </div>
            </Tooltip>
          </Box>
        </Box>
      </Grid>
    </Grid>
  )
}

ProfileEditor.propTypes = {
  _firstName: PropTypes.string,
  _lastName: PropTypes.string,
  _email: PropTypes.string,
  _isoCode: PropTypes.string,
  _mfaOptIn: PropTypes.bool,
  _phoneNumber: PropTypes.string,
  onInputChange: PropTypes.func,
  setFirstName: PropTypes.func,
  setLastName: PropTypes.func,
  setEmail: PropTypes.func,
  setIsoCode: PropTypes.func,
  setPhoneNumber: PropTypes.func,
  setMfaOptIn: PropTypes.func,
}

export default ProfileEditor
