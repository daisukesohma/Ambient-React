import React, { useState, useEffect, useMemo } from 'react'
import { useTheme } from '@material-ui/core/styles'
import { useSelector, useDispatch, batch } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { Button } from 'ambient_ui'
import Grid from '@material-ui/core/Grid'
import get from 'lodash/get'
// src
import { createNotification } from 'redux/slices/notifications'
import Modal from 'components/Modal'
import MModal from '@material-ui/core/Modal'
import ConfirmDialog from 'components/ConfirmDialog'
import { Can } from 'rbac'
import {
  fetchContactResourcesRequested,
  fetchUsersRequested as fetchCheckinModalUsersRequested,
  setCheckinModalOpen,
} from 'features/EnhancedResponder/CheckinModal/redux/checkinModalSlice'
import CheckinModal from 'features/EnhancedResponder/CheckinModal'
import UserLoginAuditLog from 'features/UserLoginAuditLog'
import {
  openUserLoginAuditLog,
  resetUserLoginActivityDetails,
} from 'features/UserLoginAuditLog/redux/userLoginAuditLogSlice'

import AddPanel from './components/AddPanel'
import UserForm from './Users/forms/UserForm'
import UserTable from './Users/UserTable/index'
import Start from './components/Start'
import {
  makeIdentitySourceParams,
  getIdentitySourcesMetaInfo,
} from './IdentitySources/utils'
import { generateUserParams } from './utils'
import AddIdentitySourceForm from './IdentitySources/forms/AddIdentitySourceForm'
import {
  fetchUsersRequested,
  fetchIdSourceTypesRequested,
  fetchUserRolesRequested,
  fetchIdentitySourcesRequested,
  deleteUserRequested,
  createUserRequested,
  setStateValues,
  editUserRequested,
  syncIdentitySourcesRequested,
  createIdentitySourceRequested,
} from './redux/userManagementSlice'
import {
  getUserRoleOptions,
  getIdSourceTypeOptions,
  getUsers,
  getLoadingState,
} from './selectors'
import LoadingScreen from '../../containers/LoadingScreen'

const userFormCustomStyle = {
  padding: 0,
  maxWidth: 675,
  border: 'none',
  overflowY: 'visible',
}

export default function UserManagement() {
  const { palette } = useTheme()
  const darkMode = useSelector(state => state.settings.darkMode)
  const userName = useSelector(state => state.auth.user.username)
  const history = useHistory()
  const dispatch = useDispatch()
  const { account: accountSlug } = useParams()

  const [tabIndex, setTabIndex] = useState(0)

  const users = useSelector(getUsers)
  const currentPage = useSelector(state => state.userManagement.currentPage)
  const limit = useSelector(state => state.userManagement.limit)
  const searchQuery = useSelector(state => state.userManagement.searchQuery)
  const siteSlugs = useSelector(state => state.userManagement.siteSlugs)
  const roleIds = useSelector(state => state.userManagement.roleIds)

  const userToEdit = useSelector(state => state.userManagement.userToEdit)
  const userToDelete = useSelector(state => state.userManagement.userToDelete)
  const idSourceTypesOptions = useSelector(getIdSourceTypeOptions)
  const isCreateOpen = useSelector(state => state.userManagement.isCreateOpen)
  const isUserCreateOpen = useSelector(
    state => state.userManagement.isUserCreateOpen,
  )
  const isIdentityCreateOpen = useSelector(
    state => state.userManagement.isIdentityCreateOpen,
  )
  const isLoginHistoryOpen = useSelector(
    state => state.userLoginAuditLog.isLoginHistoryOpen,
  )
  const sites = useSelector(state => get(state.auth, 'sites', []))
  const roleOptions = useSelector(getUserRoleOptions)
  const identitySources = useSelector(
    state => state.userManagement.identitySources,
  )
  const isLoading = useSelector(getLoadingState)
  const loadingUsers = useSelector(state => state.userManagement.loadingUsers)
  const creatingUser = useSelector(state => state.userManagement.creatingUser)
  const editingUser = useSelector(state => state.userManagement.editingUser)
  const deletingUser = useSelector(state => state.userManagement.deletingUser)
  const syncing = useSelector(state => state.userManagement.syncing)
  const creatingIdentitySource = useSelector(
    state => state.userManagement.creatingIdentitySource,
  )
  const hasUsers = useSelector(state => state.userManagement.hasUsers)

  const usersLoading = useSelector(state => state.checkinModal.usersLoading)
  const sitesLoading = useSelector(state => state.checkinModal.sitesLoading)
  const contactResourcesLoading = useSelector(
    state => state.checkinModal.contactResourcesLoading,
  )

  const siteOptions = useMemo(
    () =>
      sites.map(site => ({
        label: site.name,
        value: Number(site.id),
      })),
    [sites],
  )

  useEffect(() => {
    dispatch(
      fetchUsersRequested({
        accountSlug,
        page: currentPage + 1,
        limit,
        searchQuery: searchQuery || null,
        roleIds: roleIds || null,
        siteSlugs: siteSlugs || null,
      }),
    )
  }, [currentPage])

  useEffect(() => {
    dispatch(
      fetchUsersRequested({
        accountSlug,
        page: 1,
        limit,
        searchQuery: searchQuery || null,
        roleIds: roleIds || null,
        siteSlugs: siteSlugs || null,
      }),
    )
  }, [searchQuery, roleIds, siteSlugs, limit])

  useEffect(() => {
    batch(() => {
      dispatch(fetchUserRolesRequested({ accountSlug }))
      dispatch(fetchIdSourceTypesRequested({ accountSlug }))
      dispatch(fetchIdentitySourcesRequested({ accountSlug }))

      dispatch(fetchContactResourcesRequested({ accountSlug }))
      dispatch(fetchCheckinModalUsersRequested({ accountSlug }))
    })
  }, [dispatch, accountSlug])

  const syncIdentitySource = () => {
    dispatch(
      syncIdentitySourcesRequested({
        identitySourceIds: identitySources.map(idSource => idSource.id),
      }),
    )
  }

  const addIdentitySource = async identitySource => {
    dispatch(
      createIdentitySourceRequested({
        identitySource: makeIdentitySourceParams(identitySource, accountSlug),
      }),
    )
  }

  const addUser = async user => {
    const { variables } = generateUserParams({
      user,
      accountSlug,
      sites,
    })
    dispatch(createUserRequested({ user: variables, accountSlug }))
  }

  const editUser = async user => {
    const { variables } = generateUserParams({
      user,
      accountSlug,
      sites,
    })
    dispatch(editUserRequested({ user: variables, accountSlug }))
  }

  const removeUser = user => {
    dispatch(deleteUserRequested({ accountSlug, userId: user.id }))
  }

  const onUserEdit = userid => {
    dispatch(
      setStateValues([
        {
          key: 'userToEdit',
          value: users.find(user => user.id === userid),
        },
      ]),
    )
  }

  const onUserDelete = username => {
    // Check if user is themselves
    if (username !== userName) {
      dispatch(
        setStateValues([
          {
            key: 'userToDelete',
            value: users.find(user => user.username === username),
          },
        ]),
      )
    } else {
      dispatch(createNotification({ message: 'Unable to delete yourself' }))
    }
  }

  const onViewUserLoginHistory = userid => {
    dispatch(
      openUserLoginAuditLog({
        user: users.find(user => user.id === userid),
      }),
    )
  }

  const handleAdd = index => {
    if (index === 0) {
      dispatch(setStateValues([{ key: 'isUserCreateOpen', value: true }]))
    } else {
      dispatch(setStateValues([{ key: 'isIdentityCreateOpen', value: true }]))
    }
  }

  const hideUserForm = () => {
    dispatch(
      setStateValues([
        { key: 'isCreateOpen', value: false },
        { key: 'isUserCreateOpen', value: false },
        { key: 'isIdentityCreateOpen', value: false },
        { key: 'userToEdit', value: null },
      ]),
    )
    setTabIndex(0)
  }

  const hideDeleteDialog = () => {
    dispatch(setStateValues([{ key: 'userToDelete', value: null }]))
  }

  const handleDeleteConfirm = () => {
    removeUser(userToDelete)
  }

  const onResponderAssign = user => {
    if (usersLoading || contactResourcesLoading || sitesLoading) {
      dispatch(createNotification({ message: 'Loading...' }))
      return
    }
    const { lastWorkShiftPeriod } = user

    dispatch(
      setCheckinModalOpen({
        checkinModalOpen: true,
        responderReadOnly: true,
        contactResourceId: Number(
          get(lastWorkShiftPeriod, 'contactResource.id'),
        ),
        responderId: get(user, 'profileId', null),
        siteSlug: get(lastWorkShiftPeriod, 'site.slug', null),
        refreshUsers: true,
      }),
    )
  }

  const redirectToIdentity = () =>
    history.push(`/accounts/${accountSlug}/settings/users/identity-sources`)

  const identitySourcesMetaInfo = getIdentitySourcesMetaInfo(identitySources)

  const hasIdWithoutUser =
    !hasUsers && identitySourcesMetaInfo.hasIdentitySources

  // if (isLoading) return <Skeleton />
  if (isLoading) return <LoadingScreen />

  return (
    <div>
      <Grid container justify='space-between'>
        <h3
          className='am-h4'
          style={{
            margin: '16px 0',
            color: darkMode ? palette.common.white : palette.common.black,
          }}
        >
          User Management
        </h3>
        {(hasUsers || hasIdWithoutUser) && (
          <div>
            {identitySourcesMetaInfo.hasIdentitySources ? (
              <div style={{ display: 'flex' }}>
                <Can I='is_internal' on='Admin'>
                  <Button
                    onClick={() =>
                      dispatch(
                        setStateValues([{ key: 'isCreateOpen', value: true }]),
                      )
                    }
                    customStyle={{ marginTop: 20 }}
                    disabled={loadingUsers}
                  >
                    Add Users
                  </Button>
                </Can>
                <Button
                  onClick={redirectToIdentity}
                  customStyle={{ marginTop: 20 }}
                  disabled={loadingUsers}
                >
                  View Identity Sources
                </Button>
              </div>
            ) : (
              <Button
                onClick={() =>
                  dispatch(
                    setStateValues([{ key: 'isCreateOpen', value: true }]),
                  )
                }
                customStyle={{ marginTop: 20 }}
                disabled={loadingUsers}
              >
                Add Users
              </Button>
            )}
          </div>
        )}
      </Grid>
      {loadingUsers ||
      hasUsers ||
      identitySourcesMetaInfo.hasIdentitySources ? (
        <>
          <CheckinModal noButton />
          <UserTable
            users={users}
            onUserEdit={onUserEdit}
            onUserDelete={onUserDelete}
            onViewUserLoginHistory={onViewUserLoginHistory}
            identitySourcesMetaInfo={identitySourcesMetaInfo}
            onSync={() => syncIdentitySource()}
            onResponderAssign={onResponderAssign}
            syncing={syncing}
            showAddNowButton={!identitySourcesMetaInfo.hasIdentitySources}
            emptyComment={
              identitySourcesMetaInfo.hasIdentitySources
                ? 'You currently have no items.\nAdd users to your identity sources and ensure syncing is happening successfully.'
                : 'You currently have no items.'
            }
          />
        </>
      ) : (
        <Start onAdd={handleAdd} darkMode={darkMode} />
      )}
      <Modal
        isChildOpen={userToEdit}
        handleChildClose={hideUserForm}
        customStyle={userFormCustomStyle}
      >
        <UserForm
          accountSlug={accountSlug}
          editUser={editUser}
          siteOptions={siteOptions}
          hideForm={hideUserForm}
          loading={editingUser}
          initialUser={userToEdit}
          roleOptions={roleOptions}
          readOnly={identitySourcesMetaInfo.hasIdentitySources} // if user has federationID so viewing or editing
        />
      </Modal>
      <Modal
        isChildOpen={isUserCreateOpen}
        handleChildClose={hideUserForm}
        showCloseIcon={false}
        customStyle={userFormCustomStyle}
      >
        <UserForm
          accountSlug={accountSlug}
          addUser={addUser}
          siteOptions={siteOptions}
          hideForm={hideUserForm}
          loading={creatingUser}
          roleOptions={roleOptions}
        />
      </Modal>
      <Modal
        isChildOpen={isIdentityCreateOpen}
        handleChildClose={hideUserForm}
        showCloseIcon={false}
        customStyle={{
          padding: 0,
          maxWidth: 675,
          border: 'none',
        }}
      >
        <AddIdentitySourceForm
          addIdentitySource={addIdentitySource}
          hideForm={hideUserForm}
          loading={creatingIdentitySource}
          idSourceTypesOptions={idSourceTypesOptions}
          redirect={redirectToIdentity}
        />
      </Modal>
      <Modal
        isChildOpen={isCreateOpen}
        handleChildClose={hideUserForm}
        showCloseIcon={false}
        customStyle={{ padding: 0, maxWidth: 675, overflowY: 'visible' }}
      >
        <AddPanel
          accountSlug={accountSlug}
          addUser={addUser}
          siteOptions={siteOptions}
          tabIndex={tabIndex}
          setTabIndex={setTabIndex}
          hideUserForm={hideUserForm}
          userFormLoading={creatingUser}
          roleOptions={roleOptions}
          redirectToIdentity={redirectToIdentity}
          idSourceTypesOptions={idSourceTypesOptions}
          addIdentitySource={addIdentitySource}
          identityFormLoading={creatingIdentitySource}
          hideIdentityForm={hideUserForm}
        />
      </Modal>
      <MModal
        open={isLoginHistoryOpen}
        onClose={() => {
          dispatch(resetUserLoginActivityDetails())
        }}
      >
        <>
          <UserLoginAuditLog />
        </>
      </MModal>
      <ConfirmDialog
        open={!!userToDelete}
        onClose={hideDeleteDialog}
        onConfirm={handleDeleteConfirm}
        loading={deletingUser}
        content={
          userToDelete &&
          `You are about to deactivate user "${userToDelete.firstName} ${userToDelete.lastName}".
          Are you sure you want to do this?
          This user will no longer have access to the Ambient.ai platform.`
        }
      />
    </div>
  )
}
