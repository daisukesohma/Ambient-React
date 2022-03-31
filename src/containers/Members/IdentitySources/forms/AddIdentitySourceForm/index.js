import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'
import { Button, CircularProgress } from 'ambient_ui'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import isEmpty from 'lodash/isEmpty'
// src
import { redirectUrl as redirectUrlAction } from 'redux/slices/settings'
import { createNotification as createNotificationAction } from 'redux/slices/notifications'

import IdentitySourceSelector from '../../components/IdentitySourceSelector'
import ConfirmDialog from 'components/ConfirmDialog'

import { ldapFields, azureADFields } from './data'
import { useStyles } from './styles'

// Be sure to make sure this corresponds to the identity source type options
const IdentitySourceTypes = {
  AZURE_AD: 'Azure active directory',
  LDAP: 'Ldap',
}

const AddIdentitySourceForm = ({
  addIdentitySource,
  createNotification,
  hideForm,
  idSourceTypesOptions,
  isTitleShown,
  loading,
  redirect,
  redirectUrl,
}) => {
  const classes = useStyles()
  const [identitySource, setIdentitySource] = useState({})
  const [errors, setErrors] = useState({})
  const [isCreateConfirm, setIsCreateConfirm] = useState(false)
  const [fields, setFields] = useState([])
  const [identitySourceType, setIdentitySourceType] = useState(null)
  const [formChanged, setFormChanged] = useState(false)
  const [isCancelConfirm, setIsCancelConfirm] = useState(false)

  const { pathname } = useLocation()

  useEffect(() => {
    if (identitySourceType === IdentitySourceTypes.AZURE_AD) {
      setFields(azureADFields)
    } else if (identitySourceType === IdentitySourceTypes.LDAP) {
      setFields(ldapFields)
    }
  }, [identitySourceType])

  const changeIdentitySourceType = e => {
    setIdentitySource({
      ...identitySource,
      sourceTypeId: e.value,
    })
    setIdentitySourceType(e.label)
  }

  const onFieldChange = fieldName => e => {
    const field = fields.find(({ name }) => name === fieldName)
    const { name, label, type } = field
    const value = type === 'select' ? e.value : e.target.value
    setIdentitySource({
      ...identitySource,
      [name]: value,
    })
    setErrors({
      ...errors,
      [name]: value ? null : `${label} is required`,
    })
    setFormChanged(true)
  }

  const showCreateConfirmDialog = () => {
    setIsCreateConfirm(true)
  }

  const hideCreateDialog = () => {
    setIsCreateConfirm(false)
  }

  const handleCreateConfirm = async () => {
    if (identitySourceType === IdentitySourceTypes.AZURE_AD) {
      createNotification({ message: 'Redirecting to Azure' })
    }
    const res = await addIdentitySource({
      ...identitySource,
      isAzure: identitySourceType === IdentitySourceTypes.AZURE_AD,
    })
    let resultId = ''
    if (
      res &&
      res.data &&
      res.data.createIdentitySource &&
      res.data.createIdentitySource.identitySource
    ) {
      resultId = res.data.createIdentitySource.identitySource.id
      redirectUrl({ syncId: resultId })
    }
    hideCreateDialog()
    if (identitySourceType === IdentitySourceTypes.AZURE_AD) {
      redirectUrl({ redirectUrl: pathname, identitySourceId: resultId })
      // Makes call for admin consent
      // https://login.microsoftonline.com/{tenant}/adminconsent
      // ?client_id=6731de76-14a6-49ae-97bc-6eba6914391e
      // &state=12345
      // &redirect_uri=https://localhost/myapp/permissions
      //
      const today = new Date().getTime()
      // Send user to microsoft portal
      const url = `https://login.microsoftonline.com/${identitySource.tenantId}/adminconsent?client_id=${identitySource.clientId}&state=${today}&redirect_url=${window.location.href}`
      window.open(url, '_self')
    } else if (redirect) {
      redirect()
    }
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

  const errorKeys = Object.keys(errors)
  const isValid =
    !isEmpty(errors) &&
    errorKeys.length === fields.length &&
    errorKeys.reduce((res, key) => res && !errors[key], true)

  return (
    <Grid container spacing={4} direction='column' className={classes.root}>
      {isTitleShown && (
        <>
          <Grid container item lg={12} md={12} sm={12} xs={12}>
            <Typography className='am-h5'>Add Identity Source</Typography>
          </Grid>
          <Divider />
        </>
      )}
      <Grid container item key='sourceTypeId'>
        <Grid container item lg={4} md={4} sm={12} xs={12} alignItems='center'>
          <Typography>Identity Source Type*</Typography>
        </Grid>
        <Grid item lg={8} md={8} sm={12} xs={12}>
          <IdentitySourceSelector
            onChange={changeIdentitySourceType}
            options={idSourceTypesOptions}
          />
        </Grid>
      </Grid>
      {fields.map(({ name, label, type }) => (
        <Grid container item key={name}>
          <Grid
            container
            item
            lg={4}
            md={4}
            sm={12}
            xs={12}
            alignItems='center'
          >
            <Typography>{label}*</Typography>
          </Grid>
          <Grid item lg={8} md={8} sm={12} xs={12}>
            {type === 'select' ? (
              <IdentitySourceSelector
                onChange={onFieldChange(name)}
                options={idSourceTypesOptions}
              />
            ) : (
              <TextField
                required
                variant='outlined'
                fullWidth
                size='small'
                error={!!errors[name]}
                helperText={errors[name] && errors[name]}
                value={identitySource[name]}
                onChange={onFieldChange(name)}
              />
            )}
          </Grid>
        </Grid>
      ))}
      <Grid container item justify='flex-end'>
        <Button
          variant='outlined'
          color='primary'
          customStyle={{ marginRight: 5 }}
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button
          variant='contained'
          color='primary'
          disabled={!isValid || loading}
          onClick={showCreateConfirmDialog}
        >
          {loading ? <CircularProgress /> : 'Add'}
        </Button>
      </Grid>
      <ConfirmDialog
        open={isCreateConfirm}
        onClose={hideCreateDialog}
        onConfirm={handleCreateConfirm}
        loading={loading}
        content={`Are you sure you want to add an Identity Source?
          All users added manually except Admin will be deleted.
          This cannot be undone.`}
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

AddIdentitySourceForm.propTypes = {
  addIdentitySource: PropTypes.func,
  createNotification: PropTypes.func,
  hideForm: PropTypes.func,
  idSourceTypesOptions: PropTypes.array,
  isTitleShown: PropTypes.bool,
  loading: PropTypes.bool,
  redirect: PropTypes.func,
  redirectUrl: PropTypes.func,
}

AddIdentitySourceForm.defaultProps = {
  addIdentitySource: () => {},
  createNotification: () => {},
  hideForm: () => {},
  idSourceTypesOptions: [],
  isTitleShown: true,
  loading: false,
  redirect: undefined,
  redirectUrl: () => {},
}

const mapDispatchToProps = dispatch => ({
  redirectUrl: data => dispatch(redirectUrlAction(data)),
  createNotification: ({ message }) =>
    dispatch(createNotificationAction({ message })),
})

export default connect(
  null,
  mapDispatchToProps,
)(AddIdentitySourceForm)
