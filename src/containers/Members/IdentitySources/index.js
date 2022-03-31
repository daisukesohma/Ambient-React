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

import React, { useState, useEffect } from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { withRouter, useParams } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { connect } from 'react-redux'
import { compose } from 'redux'
import Grid from '@material-ui/core/Grid'
import InfoOutlined from '@material-ui/icons/InfoOutlined'
import SyncIcon from '@material-ui/icons/Sync'
import { Button, CircularProgress } from 'ambient_ui'
import get from 'lodash/get'
// src
import { redirectUrl as redirectUrlAction } from 'redux/slices/settings'
import { createNotification as createNotificationAction } from 'redux/slices/notifications'

import Modal from '../../../components/Modal'
import BreadCrumbs from '../../../components/BreadCrumbs'
import DataTable from 'components/organisms/DataTable'
import Skeleton from '../components/Skeleton'
import Tools from '../components/TableTools'

import {
  GET_IDENTITY_SOURCE_TYPES,
  GET_IDENTITY_SOURCES,
  CREATE_IDENTITY_SOURCE,
  UPDATE_IDENTITY_SOURCE,
  DEACTIVATE_IDENTITY_SOURCE,
  ACTIVATE_IDENTITY_SOURCE,
  CREATE_IDENTITY_SOURCE_REQUESTS,
  DEACTIVATE_UNFEDERATED_USERS,
} from './gql'
import EditIdentitySourceForm from './forms/EditIdentitySourceForm'
import AddIdentitySourceForm from './forms/AddIdentitySourceForm'
import IdentitySourceStatus from './components/IdentitySourceStatus'
import {
  makeLabel,
  makeIdentitySourceParams,
  makeSourceTypeName,
  getIdentitySourcesMetaInfo,
} from './utils'
import LastSync from './components/LastSync'

const renderLastSync = rowData => {
  return <LastSync date={rowData.lastSyncRequest} />
}

const renderIdentitySourceStatus = rowData => {
  return <IdentitySourceStatus data={rowData} />
}

const IdentitySources = ({ syncId, redirectUrl, profileId }) => {
  const { palette } = useTheme()
  const [identitySources, setIdentitySources] = useState([])
  const [idSourceTypesOptions, setIdSourceTypesOptions] = useState([])
  const [selectedIdentitySource, setSelectedIdentitySource] = useState(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [syncing, setSyncing] = useState()
  const { account: accountSlug } = useParams()
  let refetchInterval = null

  const {
    data,
    loading: gettingIds,
    refetch: refetchIdentitySources,
  } = useQuery(GET_IDENTITY_SOURCES, {
    variables: {
      accountSlug,
    },
  })

  const { data: idSourceTypes, loading: typesLoading } = useQuery(
    GET_IDENTITY_SOURCE_TYPES,
  )

  const [createIdentitySource, { loading: creatingIdentity }] = useMutation(
    CREATE_IDENTITY_SOURCE,
  )

  const [updateIdentitySource, { loading: updatingIdentity }] = useMutation(
    UPDATE_IDENTITY_SOURCE,
  )

  const [activateIdentitySource] = useMutation(ACTIVATE_IDENTITY_SOURCE)

  const [deleteIdentitySource, { loading: deletingIdentity }] = useMutation(
    DEACTIVATE_IDENTITY_SOURCE,
  )

  const [syncIdentitySourceRequests] = useMutation(
    CREATE_IDENTITY_SOURCE_REQUESTS,
  )

  const [deactivateUnfederatedUsersRequests] = useMutation(
    DEACTIVATE_UNFEDERATED_USERS,
  )

  const deactivateUnfederatedUsers = async () => {
    await deactivateUnfederatedUsersRequests({
      variables: { accountSlug },
    })
  }

  const syncIdentitySource = async identitySource => {
    setSyncing(identitySource ? identitySource.identitySourceId : 'all')
    await syncIdentitySourceRequests({
      variables: {
        identitySourceIds: identitySource
          ? [identitySource.identitySourceId]
          : identitySources.map(idSource => idSource.identitySourceId),
      },
      refetchQueries: [
        {
          query: GET_IDENTITY_SOURCES,
          variables: { accountSlug },
        },
      ],
      awaitRefetchQueries: true,
    })

    // Set refetch interval when it does not exist and status is 'IN_PROGRESS'
    // it is temporary solution
    refetchInterval = setInterval(() => {
      refetchIdentitySources()
    }, 500)
    setTimeout(() => {
      clearInterval(refetchInterval)
    }, 10000)
    setSyncing(null)
  }

  // workflow start here, step 1 on both casese
  const addIdentitySource = async identitySource => {
    const res = await createIdentitySource({
      variables: makeIdentitySourceParams(identitySource, accountSlug),
      refetchQueries: [
        {
          query: GET_IDENTITY_SOURCES,
          variables: {
            accountSlug,
          },
        },
      ],
      awaitRefetchQueries: true,
    })
    setIsCreateOpen(false)
    return res
  }

  const editIdentitySource = async identitySource => {
    const res = await updateIdentitySource({
      variables: makeIdentitySourceParams(identitySource, accountSlug),
      refetchQueries: [
        {
          query: GET_IDENTITY_SOURCES,
          variables: { accountSlug },
        },
      ],
      awaitRefetchQueries: true,
    })
    setSelectedIdentitySource(null)
    return res
  }

  const removeIdentitySource = async identitySource => {
    await deleteIdentitySource({
      variables: {
        accountSlug,
        identitySourceId: identitySource.identitySourceId,
      },
    })
    setIdentitySources(
      identitySources.filter(
        ({ identitySourceId }) =>
          identitySourceId !== identitySource.identitySourceId,
      ),
    )
    setSelectedIdentitySource(null)
  }

  // 5th step of first workflow and 3rd step of second workflow
  // activate newly created identity source
  // We manually activate an Identity Source to prevent the accidental
  // disabling of profiles not found on Azure AD via background sync
  // until the current account user is fully enabled
  const activatingIdentitySource = async identitySource => {
    await activateIdentitySource({
      variables: {
        accountSlug,
        identitySourceId: identitySource.identitySourceId,
      },
      refetchQueries: [
        {
          query: GET_IDENTITY_SOURCES,
          variables: { accountSlug },
        },
      ],
      awaitRefetchQueries: true,
    })
    setSelectedIdentitySource(null)
  }

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

  useEffect(() => {
    if (idSourceTypes && idSourceTypes.identitySourceTypes) {
      const options = idSourceTypes.identitySourceTypes.map(identitySource => ({
        label: makeLabel(identitySource.name),
        value: identitySource.id,
      }))
      setIdSourceTypesOptions(options)
    }
  }, [idSourceTypes])

  useEffect(() => {
    if (data) {
      const tableData = []
      data.getIdentitySourcesForAccount.forEach(item => {
        if (item.active) {
          const {
            username,
            host,
            port,
            dn,
            group,
            tenantId,
            clientId,
            clientSecret,
          } = JSON.parse(item.config)
          tableData.push({
            identitySourceId: item.id,
            name: item.name,
            host,
            type: makeSourceTypeName(item.sourceType.name),
            username,
            lastSyncRequest: item.lastSyncRequest,
            status: item.lastSyncRequest ? item.lastSyncRequest.status : null,
            port,
            dn,
            group,
            sourceTypeId: item.sourceType.id,
            sourceType: item.sourceType,
            tenantId,
            clientId,
            clientSecret,
            federationProfiles: item.federationProfiles,
          })
        }
      })
      setIdentitySources(tableData)
    }
  }, [data])

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

  if (gettingIds || typesLoading) {
    return <Skeleton />
  }
  return (
    <Grid container justify='space-between'>
      <Grid item container justify='space-between' alignItems='center'>
        <BreadCrumbs items={breadCrumbsItems} />
        <Button onClick={() => setIsCreateOpen(true)}>
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
                  setSelectedIdentitySource({
                    ...idSource,
                    initialType: idSourceTypesOptions.find(
                      ({ value }) => value === idSource.sourceTypeId,
                    ),
                  })
                },
              },
            ]}
            emptyComment='You currently have no identify sources'
            onAdd={() => setIsCreateOpen(true)}
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
        handleChildClose={() => setIsCreateOpen(false)}
        showCloseIcon={false}
        customStyle={{
          padding: 0,
          maxWidth: 675,
          border: 'none',
        }}
      >
        <AddIdentitySourceForm
          addIdentitySource={addIdentitySource}
          hideForm={() => setIsCreateOpen(false)}
          loading={creatingIdentity}
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
        handleChildClose={() => setSelectedIdentitySource(null)}
      >
        <EditIdentitySourceForm
          idSourceTypesOptions={idSourceTypesOptions}
          source={selectedIdentitySource}
          editIdentitySource={editIdentitySource}
          removeIdentitySource={removeIdentitySource}
          hideForm={() => setSelectedIdentitySource(null)}
          loading={updatingIdentity || deletingIdentity}
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
