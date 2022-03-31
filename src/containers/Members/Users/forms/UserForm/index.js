import React, { useState, useEffect } from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { TextField, Grid, Typography, Divider } from '@material-ui/core'
import InputMask from 'react-input-mask'
import { Button, CircularProgress } from 'ambient_ui'
import LinkIcon from '@material-ui/icons/Link'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'
import MultiSelect from 'react-multi-select-component'

import ConfirmDialog from 'components/ConfirmDialog'
import CountryCodeSelect from 'components/atoms/CountryCodeSelect'
import AvatarUploader from '../../../../../components/AvatarUploader'
import RoleSelection from '../../../components/RoleSelection'
import { countryPhoneCodes } from '../../../../../utils/countryCodeToPhone'

import { fields } from './data'
import useStyles from './styles'

const DEFAULT_USER = {
  firstName: '',
  lastName: '',
  email: '',
  countryCode: '1',
  isoCode: 'us',
  phoneNumber: '',
  sites: [],
  img: null,
}

const UserForm = ({
  initialUser,
  loading,
  roleOptions,
  siteOptions,
  addUser,
  editUser,
  hideForm,
  isTitleShown,
  readOnly, // if if user has federationID so viewing or editing
}) => {
  const { palette } = useTheme()
  const defaultUser = {
    ...DEFAULT_USER,
    role:
      roleOptions.find(({ label }) => label.toString() === 'Member') ||
      roleOptions[0],
  }
  const classes = useStyles()
  const [user] = useState(
    initialUser
      ? {
          ...initialUser,
          isoCode: initialUser.isoCode || 'us',
          role: roleOptions.find(
            ({ value }) => value.toString() === initialUser.role.id.toString(),
          ),
        }
      : defaultUser,
  )
  const [fieldsUpdated, setFieldsUpdated] = useState(
    initialUser ? {} : defaultUser,
  )
  const [errors, setErrors] = useState({})
  const [isConfirm, setIsConfirm] = useState(false)
  const [formChanged, setFormChanged] = useState(false)
  const [isCancelConfirm, setIsCancelConfirm] = useState(false)

  const onFieldChange = fieldName => e => {
    const field = fields.find(({ name }) => name === fieldName)
    const { name, label, type } = field
    let value = ''
    if (type === 'text' || type === 'phone') {
      value = e.target.value
    } else if (type === 'select') {
      value = e
    } else if (type === 'isoCode') {
      value = e.value
    }

    setFieldsUpdated({
      ...fieldsUpdated,
      [name]: value,
    })
    setErrors({
      ...errors,
      [name]: value ? null : `${label} is required`,
      isoCode: null,
      phoneNumber: null,
      role: null,
    })
    setFormChanged(true)
  }

  const handleImageDelete = () => {
    setFieldsUpdated({
      ...fieldsUpdated,
      img: null,
    })
  }

  const handleImageUpload = input => {
    setFieldsUpdated({
      ...fieldsUpdated,
      img: input,
    })
  }

  const showConfirmDialog = () => {
    let askPhoneConfirm = false
    if (fieldsUpdated.hasOwnProperty('phoneNumber')) {
      askPhoneConfirm = !fieldsUpdated.phoneNumber
    } else {
      askPhoneConfirm = user && !user.phoneNumber
    }
    if (askPhoneConfirm) {
      setIsConfirm(true)
    } else {
      handleConfirm()
    }
  }

  const hideConfirmDialog = () => {
    setIsConfirm(false)
  }

  const handleConfirm = async () => {
    const action = initialUser ? editUser : addUser
    if (fieldsUpdated.phoneNumber) {
      fieldsUpdated.phoneNumber = fieldsUpdated.phoneNumber.replace(/-/g, '')
    }
    if (initialUser && !fieldsUpdated.phoneNumber && initialUser.phoneNumber) {
      const { phoneNumber, isoCode } = initialUser
      const codes = countryPhoneCodes.find(({ iso2 }) => iso2 === isoCode)
      if (codes && phoneNumber.includes(`+${codes.dialCode}`)) {
        fieldsUpdated.phoneNumber = phoneNumber.replace(
          `+${codes.dialCode}`,
          '',
        )
      }
    }
    if (fieldsUpdated.isoCode) {
      const code = countryPhoneCodes.find(
        ({ iso2, dialCode }) => iso2 === fieldsUpdated.isoCode,
      )
      if (code) {
        fieldsUpdated.countryCode = code.dialCode
      }
    }

    fieldsUpdated.profileId = user.profileId
    await action(fieldsUpdated)
    hideConfirmDialog()
  }

  const handleCancel = () => {
    if (formChanged) {
      setIsCancelConfirm(true)
    } else {
      hideForm()
    }
  }

  const hideCancelDialog = () => {
    setIsCancelConfirm(false)
  }

  const handleCancelConfirm = async () => {
    setIsCancelConfirm(false)
    hideForm()
  }

  useEffect(() => {
    const tempErrors = {}
    if (initialUser) {
      fields.forEach(({ name, label }) => {
        if (initialUser[name]) {
          tempErrors[name] = null
        } else {
          tempErrors[name] = `${label} is required`
        }
      })
      setErrors({
        ...tempErrors,
        isoCode: null,
        phoneNumber: null,
        role: null,
      })
    } else {
      setErrors({
        isoCode: null,
        phoneNumber: null,
        role: null,
      })
    }
    // eslint-disable-next-line
  }, [])

  const errorKeys = Object.keys(errors)
  const isValid =
    !isEmpty(errors) &&
    errorKeys.length === fields.length &&
    errorKeys.reduce((res, key) => res && !errors[key], true)

  return (
    <Grid container spacing={4} className={classes.root}>
      {isTitleShown && (
        <>
          <Grid container item lg={12} md={12} sm={12} xs={12}>
            {readOnly && (
              <div className={classes.profileEditHeader}>
                <div className='title'>
                  <Typography className='am-h5'>Profile details</Typography>
                  <div className='checkin'>
                    <span className={classes.checkinCircle} />
                    Checked in
                  </div>
                </div>

                <div className={classes.federationIdWrapper}>
                  <LinkIcon fontSize='small' style={{ marginRight: 8 }} />
                  {fieldsUpdated.federationIdType
                    ? fieldsUpdated.federationIdType
                    : user.federationIdType}
                </div>
              </div>
            )}
            {!readOnly && (
              <Typography className='am-h5'>User Details</Typography>
            )}
          </Grid>
          <div className={classes.divider}>
            <Divider />
          </div>
        </>
      )}
      <Grid item lg={8} md={8} sm={12} xs={12}>
        {fields.map(
          ({ name, label, type }) =>
            type === 'text' && (
              <Grid item lg={12} md={12} sm={12} xs={12} key={name}>
                {readOnly && name !== 'role' && name !== 'sites' ? (
                  <>
                    <div className={classes.label}>{label}</div>
                    <Typography className={classes.fieldText}>
                      {fieldsUpdated[name] ? fieldsUpdated[name] : user[name]}
                    </Typography>
                  </>
                ) : (
                  <TextField
                    required
                    label={label}
                    error={!!errors[name]}
                    helperText={errors[name] && errors[name]}
                    defaultValue=''
                    value={
                      fieldsUpdated.hasOwnProperty(name)
                        ? fieldsUpdated[name]
                        : user[name]
                    }
                    className={classes.textField}
                    margin='normal'
                    variant='outlined'
                    name={name}
                    onChange={onFieldChange(name)}
                    disabled={loading}
                  />
                )}
              </Grid>
            ),
        )}
        {readOnly && (
          <Grid item lg={12} md={12} sm={12} xs={12} style={{ marginTop: 32 }}>
            <div className={classes.label}>Federation ID</div>
            <Typography className={classes.fieldText}>
              {user.federationId}
            </Typography>
          </Grid>
        )}
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <Grid className={classes.phoneNumber}>
            <Grid className={classes.countryWrapper}>
              <CountryCodeSelect
                onChange={onFieldChange('isoCode')}
                selected={
                  fieldsUpdated.hasOwnProperty('isoCode')
                    ? fieldsUpdated.isoCode
                    : user.isoCode
                }
              />
            </Grid>
            <Grid className={classes.phoneWrapper}>
              <InputMask
                mask='999-999-9999'
                value={
                  fieldsUpdated.hasOwnProperty('phoneNumber')
                    ? fieldsUpdated.phoneNumber
                    : user.phoneNumber
                }
                onChange={onFieldChange('phoneNumber')}
                disabled={loading}
              >
                {inputProps => (
                  <TextField
                    label='Phone Number'
                    defaultValue=''
                    className={classes.phoneText}
                    margin='normal'
                    variant='outlined'
                    name='phone_number'
                    placeholder='9999999999'
                    {...inputProps}
                  />
                )}
              </InputMask>
            </Grid>
          </Grid>
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          {readOnly ? (
            <>
              <div className={classes.label}>Role</div>
              <Typography className={classes.fieldText}>
                {get(user, 'role.label')}
              </Typography>
            </>
          ) : (
            <RoleSelection
              elemId='role'
              elemName='role'
              onChange={onFieldChange('role')}
              disabled={loading}
              role={
                fieldsUpdated.hasOwnProperty('role')
                  ? fieldsUpdated.role
                  : user.role
              }
              roleOptions={roleOptions}
            >
              {errors.role ? (
                <span
                  style={{
                    color: palette.error.main,
                    fontSize: '12px',
                    margin: '8px 14px 0',
                  }}
                >
                  {errors.role}
                </span>
              ) : null}
            </RoleSelection>
          )}
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <Grid className={classes.sitesWrapper}>
            <MultiSelect
              options={siteOptions}
              value={
                fieldsUpdated.hasOwnProperty('sites')
                  ? fieldsUpdated.sites
                  : user.sites
              }
              onChange={onFieldChange('sites')}
              labelledBy='SiteSelector'
              overrideStrings={{
                selectSomeItems: 'Select at least one site',
                allItemsAreSelected: 'All sites selected',
                selectAll: 'Select All Sites',
                search: 'Search sites',
                clearSearch: 'Clear Search',
              }}
            />
            {/* TODO: Remove later if no longer needed -- keeping for now
            <SearchableSelectDropdown
              onChange={onFieldChange('sites')}
              options={siteOptions}
              value={fieldsUpdated.hasOwnProperty('sites') ? fieldsUpdated.sites : user.sites}
              isMulti
              placeholder={'Select at least one or more sites'}
            /> */}
            {errors.sites ? (
              <span
                style={{
                  color: palette.error.main,
                  fontSize: '12px',
                  margin: '8px 14px 0',
                }}
              >
                {errors.sites}
              </span>
            ) : null}
          </Grid>
        </Grid>
      </Grid>
      <Grid item lg={4} md={4} sm={12} xs={12}>
        <Grid className={classes.imgWrapper}>
          <AvatarUploader
            img={
              fieldsUpdated.hasOwnProperty('img') ? fieldsUpdated.img : user.img
            }
            onUpload={handleImageUpload}
            onDelete={handleImageDelete}
          />
        </Grid>
      </Grid>

      <Grid item lg={12} md={12} sm={12} xs={12}>
        <Grid container justify='flex-end'>
          <Button
            variant='outlined'
            dataDismiss='modal'
            onClick={handleCancel}
            customStyle={{ marginRight: 5 }}
          >
            Cancel
          </Button>
          <Button disabled={!isValid || loading} onClick={showConfirmDialog}>
            {loading ? <CircularProgress /> : initialUser ? 'Save' : 'Add'}
          </Button>
        </Grid>
      </Grid>
      <ConfirmDialog
        open={isConfirm}
        onClose={hideConfirmDialog}
        onConfirm={handleConfirm}
        loading={loading}
        content={`Are you sure you want to ${
          initialUser ? 'update' : 'add'
        } a user without a phone number?`}
      />
      <ConfirmDialog
        open={isCancelConfirm}
        onClose={hideCancelDialog}
        onConfirm={handleCancelConfirm}
        content='Are you sure you want to close form without saving?'
      />
    </Grid>
  )
}

UserForm.propTypes = {
  siteOptions: PropTypes.array,
  accountSlug: PropTypes.string,
  loading: PropTypes.bool,
  initialUser: PropTypes.object,
  addUser: PropTypes.func,
  editUser: PropTypes.func,
  hideForm: PropTypes.func,
  roleOptions: PropTypes.array,
  isTitleShown: PropTypes.bool,
  readOnly: PropTypes.bool,
}

UserForm.defaultProps = {
  siteOptions: [],
  accountSlug: '',
  loading: false,
  initialUser: null,
  addUser: () => {},
  editUser: () => {},
  hideForm: () => {},
  roleOptions: [],
  isTitleShown: true,
  readOnly: false,
}

export default UserForm
