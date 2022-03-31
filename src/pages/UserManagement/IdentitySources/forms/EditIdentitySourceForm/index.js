import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'
import WarningRounded from '@material-ui/icons/WarningRounded'
import { Button, CircularProgress, Icons, Tooltip } from 'ambient_ui'
import { useTheme } from '@material-ui/core/styles'
import SyncIcon from '@material-ui/icons/Sync'
import { Typography, Grid } from '@material-ui/core'
import isEmpty from 'lodash/isEmpty'
import moment from 'moment'
// src
import { redirectUrl as redirectUrlAction } from 'redux/slices/settings'
import { createNotification as createNotificationAction } from 'redux/slices/notifications'
import { IdentitySourceSyncStatusEnum } from 'enums'

import IdentitySourceSelector from '../../components/IdentitySourceSelector'
import ConfirmDialog from 'components/ConfirmDialog'
import SyncAlert from '../../components/SyncAlert'

import { ldapFields, azureADFields, commonFields } from './data'
import useStyles from './styles'

const { Trash } = Icons

const IdentitySourceTypes = {
  AZURE_AD: 'Azure active directory',
  LDAP: 'Ldap',
}

const EditIdentitySourceForm = ({
  createNotification,
  editIdentitySource,
  hideForm,
  idSourceTypesOptions,
  loading,
  redirectUrl,
  removeIdentitySource,
  source,
  associatedProfile,
}) => {
  const { palette } = useTheme()
  const isSyncSuccessful =
    source.lastSyncRequest &&
    source.lastSyncRequest.status === IdentitySourceSyncStatusEnum.COMPLETED
  const isSyncInProgress =
    source.lastSyncRequest &&
    source.lastSyncRequest.status === IdentitySourceSyncStatusEnum.IN_PROGRESS
  const lastSyncDateTime = source.lastSyncRequest
    ? moment
        .unix(source.lastSyncRequest.tsCreated)
        .format('MM/DD/YYYY HH:mm:ss')
    : ''
  const classes = useStyles()
  const [identitySource, setIdentitySource] = useState(source)
  const [errors, setErrors] = useState({})
  const [isDeleteConfirm, setIsDeleteConfirm] = useState(false)
  const [isUpdateConfirm, setIsUpdateConfirm] = useState(false)
  const [fields, setFields] = useState([])
  const [formChanged, setFormChanged] = useState(false)
  const [isCancelConfirm, setIsCancelConfirm] = useState(false)

  const { pathname } = useLocation()

  const onFieldChange = fieldName => e => {
    const field = fields.find(({ name }) => name === fieldName)
    const { name, type } = field
    const value = type === 'select' ? e.value : e.target.value
    setIdentitySource({
      ...identitySource,
      [name]: value,
    })
    setErrors({
      ...errors,
      [name]: value ? null : (
        <span>
          Required
          <sup>*</sup>
        </span>
      ),
    })
    setFormChanged(true)
  }

  const showDeleteConfirmDialog = () => {
    setIsDeleteConfirm(true)
  }

  const hideDeleteDialog = () => {
    setIsDeleteConfirm(false)
  }

  const handleDeleteConfirm = async () => {
    await removeIdentitySource(identitySource)
    hideDeleteDialog()
  }

  const showUpdateConfirmDialog = () => {
    setIsUpdateConfirm(true)
  }

  const hideUpdateDialog = () => {
    setIsUpdateConfirm(false)
  }

  const handleUpdateConfirm = async () => {
    if (source.initialType.label === IdentitySourceTypes.AZURE_AD) {
      createNotification({ message: 'Redirecting to Azure' })
    }
    const res = await editIdentitySource({
      ...identitySource,
      isAzure: source.initialType.label === IdentitySourceTypes.AZURE_AD,
    })
    let resultId = ''
    if (
      res &&
      res.data &&
      res.data.updateIdentitySource &&
      res.data.updateIdentitySource.identitySource
    ) {
      resultId = res.data.updateIdentitySource.identitySource.id
      redirectUrl({ syncId: resultId })
    }
    hideUpdateDialog()
    if (source.initialType.label === IdentitySourceTypes.AZURE_AD) {
      redirectUrl({ redirectUrl: pathname, identitySourceId: resultId })
      const today = new Date().getTime()
      const url = `https://login.microsoftonline.com/${identitySource.tenantId}/adminconsent?client_id=${identitySource.clientId}&state=${today}&redirect_url=${window.location.href}`
      window.open(url, '_self')
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

  useEffect(() => {
    const isAzureAd = source.initialType.label === IdentitySourceTypes.AZURE_AD
    const azureFields = isSyncSuccessful
      ? azureADFields.find(({ name }) => name === 'name')
      : azureADFields
    const tempFields = isAzureAd
      ? [...commonFields, ...azureFields]
      : [...commonFields, ...ldapFields]
    const tempErrors = {}
    tempFields.forEach(({ name }) => {
      if (source[name]) {
        tempErrors[name] = null
      } else {
        tempErrors[name] = (
          <span>
            Required
            <sup>*</sup>
          </span>
        )
      }
    })
    setErrors(tempErrors)
    setFields(tempFields)
  }, [source, isSyncSuccessful])

  const errorKeys = Object.keys(errors)
  const isValid =
    !isEmpty(errors) &&
    errorKeys.length === fields.length &&
    errorKeys.reduce((res, key) => res && !errors[key], true)

  return (
    <Grid container spacing={4} className={classes.root}>
      <Grid container item lg={12} md={12} sm={12} xs={12}>
        <Grid container item lg={6} md={6} sm={12} xs={12}>
          <Typography className={classes.header}>{source.name}</Typography>
          {!isSyncSuccessful && !isSyncInProgress && (
            <WarningRounded
              style={{
                fontSize: 22,
                color: palette.error.main,
                paddingTop: 2,
                marginLeft: 8,
              }}
            />
          )}
          {isSyncInProgress && (
            <SyncIcon
              style={{
                fontSize: 22,
                color: palette.secondary.light,
                paddingTop: 2,
                marginLeft: 8,
              }}
            />
          )}
        </Grid>
        <Grid
          container
          item
          lg={6}
          md={6}
          sm={12}
          xs={12}
          justify='flex-end'
          alignItems='center'
        >
          {lastSyncDateTime && (
            <Typography className={classes.lastSyncText}>
              Last synced {lastSyncDateTime}
            </Typography>
          )}
          <Tooltip
            title='Delete identity source'
            placement='bottom'
            customStyle={{
              border: 'none',
              color: palette.common.black,
              backgroundColor: palette.grey[50],
              borderRadius: 4,
              boxShadow: '0px 1px 4px rgba(34, 36, 40, 0.05)',
            }}
          >
            <div
              className={classes.deleteButton}
              onClick={showDeleteConfirmDialog}
            >
              <Trash />
            </div>
          </Tooltip>
        </Grid>
      </Grid>
      {!isSyncSuccessful && !isSyncInProgress && (
        <SyncAlert
          lastSyncDateTime={lastSyncDateTime}
          isAzure={source.initialType.label === IdentitySourceTypes.AZURE_AD}
        />
      )}
      {isSyncInProgress && <SyncAlert inProgress />}
      {fields.map(({ name, label, type, tips, placeholder }) => (
        <Grid item lg={6} md={6} sm={12} xs={12} key={name}>
          <Grid
            container
            item
            lg={12}
            md={12}
            sm={12}
            xs={12}
            alignItems='center'
          >
            <Typography className={classes.label}>
              {label}
              <sup>*</sup>
            </Typography>
          </Grid>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            {type === 'select' ? (
              <IdentitySourceSelector
                options={idSourceTypesOptions}
                initialValue={source.initialType}
                isDisabled
              />
            ) : (
              <TextField
                required
                helperText={
                  <>
                    <sup>*</sup>
                    {tips}
                  </>
                }
                error={!!errors[name]}
                margin='normal'
                placeholder={placeholder}
                fullWidth
                size='small'
                InputProps={{ className: classes.input }}
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
          onClick={showUpdateConfirmDialog}
        >
          {loading ? <CircularProgress /> : 'Save'}
        </Button>
      </Grid>
      <ConfirmDialog
        open={isDeleteConfirm}
        onClose={hideDeleteDialog}
        onConfirm={handleDeleteConfirm}
        loading={loading}
        content={`Are you sure you want to delete '${source.name}'?
          All users connected to this Identity Source will be deactivated${
            associatedProfile ? ' including this account.' : '.'
          }`}
      />
      <ConfirmDialog
        open={isUpdateConfirm}
        onClose={hideUpdateDialog}
        onConfirm={handleUpdateConfirm}
        loading={loading}
        content={`Are you sure you want to update ${source.name}?`}
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

EditIdentitySourceForm.propTypes = {
  associatedProfile: PropTypes.bool,
  createNotification: PropTypes.func,
  editIdentitySource: PropTypes.func,
  hideForm: PropTypes.func,
  idSourceTypesOptions: PropTypes.array,
  loading: PropTypes.bool,
  redirectUrl: PropTypes.func,
  removeIdentitySource: PropTypes.func,
  source: PropTypes.object,
}

EditIdentitySourceForm.defaultProps = {
  associatedProfile: false,
  createNotification: () => {},
  editIdentitySource: () => {},
  hideForm: () => {},
  idSourceTypesOptions: [],
  loading: false,
  redirectUrl: () => {},
  removeIdentitySource: () => {},
  source: {},
}

const mapDispatchToProps = dispatch => ({
  redirectUrl: data => dispatch(redirectUrlAction(data)),
  createNotification: ({ message }) =>
    dispatch(createNotificationAction({ message })),
})

export default connect(
  null,
  mapDispatchToProps,
)(EditIdentitySourceForm)
