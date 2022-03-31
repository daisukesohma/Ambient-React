/*

The creation of identity source workflows has the following two cases:

First Flow, User does not have federated profile
  1. Create Identity Source
  2. getFederationProfiles
  3. GetAzureUserList
  4. CreateFederatedProfile
  5. ActivateIdentitySource
  6. Sync -> CreateIdentitySourceRequest
  7. DeactivateUnfederatedUsers

Second Flow, User has federated profile
  1. Create Identity Source
  2. getFederationProfiles
  3. ActivateIdentitySource
  4. Sync -> Create IdentitySourceRequest

Difference of two workflows is user redirection.
First workflow has additional step which redirects user to Federation/index.
*/

import React, { useEffect } from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { withRouter, useParams } from 'react-router-dom'
import { batch, connect, useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import Grid from '@material-ui/core/Grid'
import InfoOutlined from '@material-ui/icons/InfoOutlined'
import SyncIcon from '@material-ui/icons/Sync'
import { Button, CircularProgress } from 'ambient_ui'
import get from 'lodash/get'
// src
import { redirectUrl as redirectUrlAction } from 'redux/slices/settings'
import { createNotification as createNotificationAction } from 'redux/slices/notifications'
import Modal from 'components/Modal'
import BreadCrumbs from 'components/BreadCrumbs'
import DataTable from 'components/organisms/DataTable'

import Skeleton from '../components/Skeleton'
import Tools from '../components/TableTools'

import {
  deactivateUnfederatedUsersRequested,
  fetchIdentitySourcesRequested,
  fetchIdSourceTypesRequested,
  createIdentitySourceRequested,
  setStateValues,
  deleteIdentitySourceRequested,
  activateIdentitySourceRequested,
  syncIdentitySourcesRequested,
  updateIdentitySourceRequested,
} from '../redux/userManagementSlice'
import { getIdSourceTypeOptions } from '../selectors'

import EditIdentitySourceForm from './forms/EditIdentitySourceForm'
import AddIdentitySourceForm from './forms/AddIdentitySourceForm'
import IdentitySourceStatus from './components/IdentitySourceStatus'
import { makeIdentitySourceParams, getIdentitySourcesMetaInfo } from './utils'
import LastSync from './components/LastSync'

const renderLastSync = rowData => {
  return <LastSync date={rowData.lastSyncRequest} />
}

const renderIdentitySourceStatus = rowData => {
  return <IdentitySourceStatus data={rowData} />
}

const IdentitySources = ({ syncId, redirectUrl, profileId }) => {
  const dispatch = useDispatch()
  const { palette } = useTheme()
  const tableColumns = [
    {
      title: 'Name',
      field: 'name',
      props: { style: { fontWeight: 'bold', color: palette.common.black } },
    },
    { title: 'Type', field: 'type' },
    { title: 'Last Sync', field: 'lastSyncRequest', render: renderLastSync },
    { title: 'Status', field: 'status', render: renderIdentitySourceStatus },
  ]

  const idSourceTypesOptions = useSelector(getIdSourceTypeOptions)
  const loadingIdSourceTypes = useSelector(
    state => state.userManagement.loadingIdSourceTypes,
  )
  const creatingIdentitySource = useSelector(
    state => state.userManagement.creatingIdentitySource,
  )
  const updatingIdentitySource = useSelector(
    state => state.userManagement.updatingIdentitySource,
  )
  const deletingIdentitySource = useSelector(
    state => state.userManagement.deletingIdentitySource,
  )
  const identitySources = useSelector(
    state => state.userManagement.identitySources,
  )
  const selectedIdentitySource = useSelector(
    state => state.userManagement.selectedIdentitySource,
  )
  const syncing = useSelector(state => state.userManagement.syncing)
  const isCreateOpen = useSelector(state => state.userManagement.isCreateOpen)
  const { account: accountSlug } = useParams()
  let refetchInterval = null

  useEffect(() => {
    batch(() => {
      dispatch(fetchIdentitySourcesRequested({ accountSlug }))
      dispatch(fetchIdSourceTypesRequested({ accountSlug }))
    })
  }, [dispatch, accountSlug])

  const deactivateUnfederatedUsers = () => {
    dispatch(deactivateUnfederatedUsersRequested({ accountSlug }))
  }

  const syncIdentitySource = identitySource => {
    dispatch(
      syncIdentitySourcesRequested({
        identitySourceIds: identitySource
          ? [identitySource.identitySourceId]
          : identitySources.map(idSource => idSource.identitySourceId),
      }),
    )
    // Set refetch interval when it does not exist and status is 'IN_PROGRESS'
    // it is temporary solution
    refetchInterval = setInterval(() => {
      dispatch(fetchIdentitySourcesRequested({ accountSlug }))
    }, 500)
    setTimeout(() => {
      clearInterval(refetchInterval)
    }, 10000)
  }

  // workflow start here, step 1 on both casese
  const addIdentitySource = identitySource => {
    dispatch(
      createIdentitySourceRequested({
        identitySource: makeIdentitySourceParams(identitySource, accountSlug),
      }),
    )
  }

  const editIdentitySource = identitySource => {
    dispatch(
      updateIdentitySourceRequested({
        identitySource: makeIdentitySourceParams(identitySource, accountSlug),
      }),
    )
  }

  const removeIdentitySource = identitySource => {
    dispatch(
      deleteIdentitySourceRequested({
        accountSlug,
        identitySourceId: identitySource.identitySourceId,
      }),
    )
  }

  // 5th step of first workflow and 3rd step of second workflow
  // activate newly created identity source
  // We manually activate an Identity Source to prevent the accidental
  // disabling of profiles not found on Azure AD via background sync
  // until the current account user is fully enabled
  const activatingIdentitySource = identitySource => {
    dispatch(
      activateIdentitySourceRequested({
        accountSlug,
        identitySourceId: identitySource.identitySourceId,
      }),
    )
  }

  // step 5, 6, 7 of first workflow and step 4 of second workflow
  // make manual sync request for newly created identity source
  useEffect(() => {
    if (syncId) {
      activatingIdentitySource({ identitySourceId: syncId })
      syncIdentitySource({ identitySourceId: syncId })
      deactivateUnfederatedUsers()
      redirectUrl({})
    }
    // eslint-disable-next-line
  }, [syncId])

  const renderSyncIcon = idSource => (
    <>
      {idSource.identitySourceId === syncing ? (
        <CircularProgress
          style={{ color: palette.primary.main, fontSize: 20 }}
        />
      ) : (
        <SyncIcon style={{ color: palette.primary.main, fontSize: 20 }} />
      )}
    </>
  )
  const renderInfoOutlined = () => (
    <InfoOutlined style={{ color: palette.grey[700], fontSize: 20 }} />
  )

  const breadCrumbsItems = [
    {
      link: `/accounts/${accountSlug}/settings/users`,
      label: 'Users',
    },
    {
      label: 'Identity Sources',
    },
  ]

  let associatedProfile = false
  if (selectedIdentitySource) {
    const { federationProfiles } = selectedIdentitySource
    associatedProfile =
      federationProfiles &&
      Array.isArray(federationProfiles) &&
      federationProfiles.some(({ profile }) => profile.id === profileId)
  }

  if (loadingIdSourceTypes) {
    return <Skeleton />
  }
  return (
    <Grid container justify='space-between'>
      <Grid item container justify='space-between' alignItems='center'>
        <BreadCrumbs items={breadCrumbsItems} />
        <Button
          onClick={() =>
            dispatch(setStateValues([{ key: 'isCreateOpen', value: true }]))
          }
        >
          Add Identity Source
        </Button>
      </Grid>
      <Grid item lg={12} md={12} sm={12} xs={12}>
        {identitySources && (
          <DataTable
            data={identitySources}
            columns={tableColumns}
            actions={[
              {
                icon: renderSyncIcon,
                tooltip: 'Sync',
                onClick: (e, idSource) => syncIdentitySource(idSource),
              },
              {
                icon: renderInfoOutlined,
                tooltip: 'Info',
                onClick: (e, idSource) => {
                  dispatch(
                    setStateValues([
                      {
                        key: 'selectedIdentitySource',
                        value: {
                          ...idSource,
                          initialType: idSourceTypesOptions.find(
                            ({ value }) => value === idSource.sourceTypeId,
                          ),
                        },
                      },
                    ]),
                  )
                },
              },
            ]}
            emptyComment='You currently have no identify sources'
            onAdd={() =>
              dispatch(setStateValues([{ key: 'isCreateOpen', value: true }]))
            }
            additionalTools={
              <Tools
                identitySourcesMetaInfo={getIdentitySourcesMetaInfo(
                  identitySources,
                )}
                onSync={() => syncIdentitySource()}
                syncing={syncing === 'all'}
              />
            }
          />
        )}
      </Grid>
      <Modal
        isChildOpen={isCreateOpen}
        handleChildClose={() =>
          dispatch(setStateValues([{ key: 'isCreateOpen', value: false }]))
        }
        showCloseIcon={false}
        customStyle={{
          padding: 0,
          maxWidth: 675,
          border: 'none',
        }}
      >
        <AddIdentitySourceForm
          addIdentitySource={addIdentitySource}
          hideForm={() =>
            dispatch(setStateValues([{ key: 'isCreateOpen', value: false }]))
          }
          loading={creatingIdentitySource}
          idSourceTypesOptions={idSourceTypesOptions}
        />
      </Modal>
      <Modal
        isChildOpen={selectedIdentitySource}
        customStyle={{
          padding: 0,
          maxWidth: 675,
          border: 'none',
        }}
        showCloseIcon={false}
        handleChildClose={() =>
          dispatch(
            setStateValues([{ key: 'selectedIdentitySource', value: null }]),
          )
        }
      >
        <EditIdentitySourceForm
          idSourceTypesOptions={idSourceTypesOptions}
          source={selectedIdentitySource}
          editIdentitySource={editIdentitySource}
          removeIdentitySource={removeIdentitySource}
          hideForm={() =>
            dispatch(
              setStateValues([{ key: 'selectedIdentitySource', value: null }]),
            )
          }
          loading={updatingIdentitySource || deletingIdentitySource}
          associatedProfile={associatedProfile}
        />
      </Modal>
    </Grid>
  )
}

IdentitySources.defaultProps = {
  profileId: '',
  syncId: '',
  redirectUrl: () => {},
  createNotification: () => {},
}

IdentitySources.propTypes = {
  profileId: PropTypes.string,
  syncId: PropTypes.string,
  redirectUrl: PropTypes.func,
  createNotification: PropTypes.func,
}

const mapStateToProps = state => {
  return {
    syncId: get(state, 'settings.redirectUrl.syncId'),
    profileId: get(state, 'auth.profile.id'),
  }
}

const mapDispatchToProps = dispatch => ({
  redirectUrl: data => dispatch(redirectUrlAction(data)),
  createNotification: ({ message }) =>
    dispatch(createNotificationAction({ message })),
})

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withRouter,
)(IdentitySources)
