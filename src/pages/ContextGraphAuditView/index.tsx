/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect } from 'react'
import { useDispatch, useSelector, batch } from 'react-redux'
import map from 'lodash/map'
import { useParams } from 'react-router-dom'
import { Box, Grid } from '@material-ui/core'
import DataTable from 'components/organisms/DataTable'
import ConfirmDialog from 'components/ConfirmDialog'
import find from 'lodash/find'
import get from 'lodash/get'
import has from 'lodash/has'
// src
import { SettingsSliceProps } from 'redux/slices/settings'

import useStyles from './styles'
import {
  fetchSecurityProfilesRequested,
  fetchSeveritiesRequested,
  fetchVerificationTypesRequested,
  enableAlertRequested,
  disableAlertRequested,
  updateVerificationTypeOnAlertRequested,
  updateSevOnAlertRequested,
  createAlertRequested,
  deleteAlertRequested,
  setAlertId,
  setConfirmDialogText,
  setDefaultAlertId,
  setSecurityProfileId,
  setSeverity,
  setStatus,
  setVerification,
  setUpdateType,
  resetStates,
  openConfirmDialog,
  resetTable,
  ContextGraphAuditViewSliceProps,
} from './redux/contextGraphAuditViewSlice'
import { UPDATE_TYPES } from './updateEnums'
import Name from './components/Name'
import Cell from './components/Cell'

interface ParamTypes {
  account: string
}

interface Props {
  siteSlug: string | null
  siteName: string | null
  isExpanded: boolean
}

interface RowData {
  [key: string]: any
}

export default function ContextGraphAuditView({
  siteSlug = null,
  siteName = null,
  isExpanded = false,
}: Props): JSX.Element {
  const dispatch = useDispatch()
  const { account } = useParams<ParamTypes>()
  const darkMode = useSelector(
    (state: SettingsSliceProps) => state.settings.darkMode,
  )
  // eslint-disable-next-line
  const classes = useStyles({ darkMode })
  const securityProfiles = useSelector(
    (state: ContextGraphAuditViewSliceProps) =>
      state.contextGraphAuditView.securityProfiles,
  )
  const defaultAlerts = useSelector(
    (state: ContextGraphAuditViewSliceProps) =>
      state.contextGraphAuditView.defaultAlerts,
  )

  const verificationTypes = useSelector(
    (state: ContextGraphAuditViewSliceProps) =>
      state.contextGraphAuditView.verificationTypes,
  )
  const severities = useSelector(
    (state: ContextGraphAuditViewSliceProps) =>
      state.contextGraphAuditView.severities,
  )

  const securityProfilesLoading = useSelector(
    (state: ContextGraphAuditViewSliceProps) =>
      state.contextGraphAuditView.securityProfilesLoading,
  )
  const updateLoading = useSelector(
    (state: ContextGraphAuditViewSliceProps) =>
      state.contextGraphAuditView.updateLoading,
  )

  const confirmOpen = useSelector(
    (state: ContextGraphAuditViewSliceProps) =>
      state.contextGraphAuditView.confirmOpen,
  )

  const confirmDialogText = useSelector(
    (state: ContextGraphAuditViewSliceProps) =>
      state.contextGraphAuditView.confirmDialogText,
  )
  const updateType = useSelector(
    (state: ContextGraphAuditViewSliceProps) =>
      state.contextGraphAuditView.updateType,
  )
  const status = useSelector(
    (state: ContextGraphAuditViewSliceProps) =>
      state.contextGraphAuditView.status,
  )
  const verification = useSelector(
    (state: ContextGraphAuditViewSliceProps) =>
      state.contextGraphAuditView.verification,
  )
  const severity = useSelector(
    (state: ContextGraphAuditViewSliceProps) =>
      state.contextGraphAuditView.severity,
  )
  const defaultAlertId = useSelector(
    (state: ContextGraphAuditViewSliceProps) =>
      state.contextGraphAuditView.defaultAlertId,
  )
  const alertId = useSelector(
    (state: ContextGraphAuditViewSliceProps) =>
      state.contextGraphAuditView.alertId,
  )
  const securityProfileId = useSelector(
    (state: ContextGraphAuditViewSliceProps) =>
      state.contextGraphAuditView.securityProfileId,
  )

  const handleStatusChange = () => {
    switch (status) {
      case 'active':
        dispatch(
          enableAlertRequested({
            id: alertId,
            status: 'active',
            securityProfileId,
          }),
        )
        return
      case 'test':
        dispatch(
          enableAlertRequested({
            id: alertId,
            status: 'test',
            securityProfileId,
          }),
        )
        return
      case 'disabled':
        dispatch(disableAlertRequested({ id: alertId, securityProfileId }))
        break
      default:
        break
    }
  }

  const handleVerificationChange = () => {
    dispatch(
      updateVerificationTypeOnAlertRequested({
        alertId,
        verificationType: verification,
        securityProfileId,
      }),
    )
  }

  const handleSeverityChange = () => {
    dispatch(
      updateSevOnAlertRequested({
        alertId,
        severity,
        securityProfileId,
      }),
    )
  }

  const handleCreateAlert = () => {
    dispatch(
      createAlertRequested({
        defaultAlertId,
        securityProfileId,
      }),
    )
  }

  const handleDeleteAlert = () => {
    dispatch(deleteAlertRequested({ id: alertId, securityProfileId }))
  }

  const handleStatus = (id: number, value: string, secProId: number) => {
    batch(() => {
      dispatch(
        setConfirmDialogText({
          confirmDialogText: `Are you sure you want to set this alert to ${value}?`,
        }),
      )
      dispatch(setUpdateType({ updateType: UPDATE_TYPES.STATUS }))
      dispatch(setStatus({ status: value }))
      dispatch(setAlertId({ alertId: id }))
      dispatch(setSecurityProfileId({ securityProfileId: secProId }))
      dispatch(openConfirmDialog())
    })
  }

  const handleVerification = (
    id: number,
    value: string | null,
    secProId: number,
  ) => {
    const labelValue = get(
      find(verificationTypes, ['value', value]),
      'label',
      value,
    )
    const text = value
      ? `Are you sure you want to set Verification to ${labelValue}?`
      : `Are you sure you want to revert Verification back to default?`
    batch(() => {
      dispatch(
        setConfirmDialogText({
          confirmDialogText: text,
        }),
      )
      dispatch(setUpdateType({ updateType: UPDATE_TYPES.VERIFICATION }))
      dispatch(setVerification({ verification: value }))
      dispatch(setAlertId({ alertId: id }))
      dispatch(setSecurityProfileId({ securityProfileId: secProId }))
      dispatch(openConfirmDialog())
    })
  }

  const handleSeverity = (
    id: number,
    value: string,
    secProId: number,
    revert: boolean,
  ) => {
    const labelValue = get(find(severities, ['value', value]), 'label', value)
    const text = revert
      ? 'Are you sure you want to revert Severity back to default?'
      : `Are you sure you want to set Severity to ${labelValue}?`
    batch(() => {
      dispatch(
        setConfirmDialogText({
          confirmDialogText: text,
        }),
      )
      dispatch(setUpdateType({ updateType: UPDATE_TYPES.SEVERITY }))
      dispatch(setSeverity({ severity: value }))
      dispatch(setAlertId({ alertId: id }))
      dispatch(setSecurityProfileId({ securityProfileId: secProId }))
      dispatch(openConfirmDialog())
    })
  }

  const handleCreate = (id: number, secProId: number) => {
    const securityProfile = get(
      find(securityProfiles, ['id', secProId]),
      'name',
      null,
    )
    const defaultAlert = get(find(defaultAlerts, ['id', id]), 'name', null)
    const text =
      securityProfile && defaultAlert
        ? `Are you sure you want to deploy ${defaultAlert} on ${securityProfile}?`
        : `Are you sure you want to deploy this alert?`
    batch(() => {
      dispatch(setConfirmDialogText({ confirmDialogText: text }))
      dispatch(setUpdateType({ updateType: UPDATE_TYPES.CREATE }))
      dispatch(setDefaultAlertId({ defaultAlertId: id }))
      dispatch(setSecurityProfileId({ securityProfileId: secProId }))
      dispatch(openConfirmDialog())
    })
  }

  const handleDelete = (id: number, secProId: number) => {
    batch(() => {
      dispatch(
        setConfirmDialogText({
          confirmDialogText: 'Are you sure you want to delete this alert?',
        }),
      )
      dispatch(setUpdateType({ updateType: UPDATE_TYPES.DELETE }))
      dispatch(setAlertId({ alertId: id }))
      dispatch(setSecurityProfileId({ securityProfileId: secProId }))
      dispatch(openConfirmDialog())
    })
  }

  const handleConfirm = () => {
    switch (updateType) {
      case UPDATE_TYPES.STATUS:
        handleStatusChange()
        return
      case UPDATE_TYPES.VERIFICATION:
        handleVerificationChange()
        return
      case UPDATE_TYPES.SEVERITY:
        handleSeverityChange()
        return
      case UPDATE_TYPES.CREATE:
        handleCreateAlert()
        return
      case UPDATE_TYPES.DELETE:
        handleDeleteAlert()
        break
      default:
        break
    }
  }

  const columns = [
    {
      title: 'Name',
      field: 'name',
      render: Name,
      sorting: false,
    },
    ...map(securityProfiles, (sp: any) => {
      return {
        id: sp.id,
        title: sp.name,
        field: `${sp.id}`,
        sorting: false,
        render: (rowData: RowData) => {
          return (
            <Cell
              darkMode={darkMode}
              severities={severities}
              verificationTypes={verificationTypes}
              handleStatus={handleStatus}
              handleVerification={handleVerification}
              handleSeverity={handleSeverity}
              handleCreate={handleCreate}
              handleDelete={handleDelete}
              defaultAlertSeverity={get(rowData, 'severity', null)}
              defaultAlertId={get(rowData, 'id', null)}
              securityProfileId={sp.id}
              alertId={get(rowData[sp.id], 'id', null)}
              threatSignatureVerificationType={get(
                rowData,
                `${sp.id}.threatSignature.verificationType`,
                null,
              )}
              alertSeverity={get(rowData, `${sp.id}.severity`, null)}
              alertVerificationType={get(
                rowData,
                `${sp.id}.verificationType`,
                null,
              )}
              alertStatus={get(rowData, `${sp.id}.status`, null)}
              isDeployed={has(rowData, sp.id)}
              verificationTypeOverride={get(
                rowData[sp.id],
                'verificationTypeOverride',
                null,
              )}
            />
          )
        },
      }
    }),
  ]

  useEffect(() => {
    if (isExpanded) {
      batch(() => {
        dispatch(
          fetchSecurityProfilesRequested({
            accountSlug: account,
            siteSlugs: siteSlug ? [siteSlug] : null,
          }),
        )
        dispatch(fetchVerificationTypesRequested())
        dispatch(fetchSeveritiesRequested())
      })
    } else {
      dispatch(resetTable())
    }
  }, [dispatch, account, siteSlug, isExpanded])

  const title = `Alerts ${siteName}`

  return (
    <Grid
      container
      spacing={4}
      className={classes.root}
      alignItems='flex-start'
      direction='row'
      justify='space-evenly'
    >
      <Grid item lg={12} md={12} sm={12} xs={12} className={classes.title}>
        <Box
          display='flex'
          flexDirection='row'
          alignItems='center'
          justifyContent='space-between'
        >
          <Box>
            <div className='am-h4'>{title}</div>
          </Box>
        </Box>
      </Grid>
      <Grid item lg={12} md={12} sm={12} xs={12} className={classes.dataTable}>
        <Box>
          <DataTable
            isCountVisible={false}
            isPaginated={false}
            isSearchable
            darkMode={darkMode}
            data={defaultAlerts}
            columns={columns}
            defaultRowsPerPage={defaultAlerts.length}
            isLoading={securityProfilesLoading}
            showAddNowButton={false}
            disableHover
          />
        </Box>
      </Grid>
      <ConfirmDialog
        loading={updateLoading}
        content={confirmDialogText}
        open={confirmOpen}
        onClose={() => dispatch(resetStates())}
        onConfirm={handleConfirm}
      />
    </Grid>
  )
}
