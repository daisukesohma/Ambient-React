import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { Button } from 'ambient_ui'
import Grid from '@material-ui/core/Grid'
import get from 'lodash/get'
// src
import { createNotification } from 'redux/slices/notifications'
import Modal from 'components/Modal'
import ConfirmDialog from 'components/ConfirmDialog'
import { Can } from 'rbac'

import AddPanel from './components/AddPanel'
import UserForm from './Users/forms/UserForm'
import UserTable from './Users/UserTable/index'
import { trimUser, filterUser } from './utils'
import Skeleton from './components/Skeleton'
import Start from './components/Start'
import {
  GET_USERS,
  CREATE_USER,
  UPDATE_USER,
  DEACTIVATE_USER,
  GET_ROLES,
} from './gql'
import {
  GET_IDENTITY_SOURCE_TYPES,
  GET_IDENTITY_SOURCES,
  CREATE_IDENTITY_SOURCE,
  CREATE_IDENTITY_SOURCE_REQUESTS,
} from './IdentitySources/gql'
import {
  makeLabel,
  makeIdentitySourceParams,
  getIdentitySourcesMetaInfo,
} from './IdentitySources/utils'
import AddIdentitySourceForm from './IdentitySources/forms/AddIdentitySourceForm'

const userFormCustomStyle = {
  padding: 0,
  maxWidth: 675,
  border: 'none',
  overflowY: 'visible',
}

export default function Users() {
  const userName = useSelector(state => state.auth.user.username)
  const history = useHistory()
  const dispatch = useDispatch()
  const [users, setUsers] = useState([])
  const [userToEdit, setUserToEdit] = useState(null)
  const [userToDelete, setUserToDelete] = useState(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [tabIndex, setTabIndex] = useState(0)
  const [roleOptions, setRoleOptions] = useState([])
  const [idSourceTypesOptions, setIdSourceTypesOptions] = useState([])
  const [identitySources, setIdentitySources] = useState([])
  const [isUserCreateOpen, setIsUserCreateOpen] = useState(false)
  const [isIdentityCreateOpen, setIsIdentityCreateOpen] = useState(false)
  const [isRefetching, setIsRefetching] = useState(false)
  const sites = useSelector(state => state.auth.sites)
  const { account: accountSlug } = useParams()

  const siteOptions = sites.map(site => {
    return {
      label: site.name,
      value: Number(site.id),
    }
  })

  const { data: userRoles, loading: rolesLoading } = useQuery(GET_ROLES, {
    variables: {
      accountSlug,
    },
  })

  const { data: idSourceTypes, loading: typesLoading } = useQuery(
    GET_IDENTITY_SOURCE_TYPES,
  )

  const { data: identitySourcesData, loading: gettingIds } = useQuery(
    GET_IDENTITY_SOURCES,
    {
      variables: {
        accountSlug,
      },
    },
  )

  const { data, loading: gettingUsers, refetch } = useQuery(GET_USERS, {
    variables: {
      accountSlug,
    },
  })

  const refetchUsers = async () => {
    setIsRefetching(true)
    await refetch()
    setIsRefetching(false)
  }

  const [createUser, { loading: creatingUser }] = useMutation(CREATE_USER)

  const [updateUser, { loading: updatingUser }] = useMutation(UPDATE_USER)

  const [deleteUser, { loading: deletingUser }] = useMutation(DEACTIVATE_USER)

  const [createIdentitySource, { loading: creatingIdentity }] = useMutation(
    CREATE_IDENTITY_SOURCE,
  )

  const [syncIdentitySourceRequests, { loading: syncing }] = useMutation(
    CREATE_IDENTITY_SOURCE_REQUESTS,
  )

  const syncIdentitySource = async () => {
    const res = await syncIdentitySourceRequests({
      variables: {
        identitySourceIds: identitySources.map(idSource => idSource.id),
      },
      refetchQueries: [
        {
          query: GET_IDENTITY_SOURCES,
          variables: { accountSlug },
        },
      ],
      awaitRefetchQueries: true,
    })
    handleError(res, 'createIdentitySourceRequests')
  }

  const addIdentitySource = async identitySource => {
    const res = await createIdentitySource({
      variables: makeIdentitySourceParams(identitySource, accountSlug),
      refetchQueries: [
        {
          query: GET_IDENTITY_SOURCES,
          variables: { accountSlug },
        },
      ],
      awaitRefetchQueries: true,
    })
    handleError(res, 'createIdentitySource')
    setIsCreateOpen(false)
    setIsIdentityCreateOpen(false)
    return res
  }

  const addUser = async user => {
    const variables = {
      ...user,
      accountSlug,
    }
    if (user.sites) {
      variables.sites = user.sites.map(({ value }) => Number(value))
    }
    if (user.role) {
      variables.role = Number(user.role.value)
    }
    const res = await createUser({ variables })
    handleError(res, 'createUser')
    await refetchUsers()
    if (
      !get(res, 'data.createUser.ok') &&
      get(res, 'data.createUser.message')
    ) {
      dispatch(
        createNotification({ message: get(res, 'data.createUser.message') }),
      )
    } else {
      setIsCreateOpen(false)
      setIsUserCreateOpen(false)
    }
  }

  const editUser = async user => {
    const variables = {
      ...user,
      accountSlug,
    }
    if (user.sites) {
      variables.sites = user.sites.map(({ value }) => Number(value))
    }
    if (user.role) {
      variables.role = Number(user.role.value)
    }
    const res = await updateUser({ variables })
    handleError(res, 'updateProfile')
    await refetchUsers()
    setUserToEdit(null)
  }

  const removeUser = async user => {
    const res = await deleteUser({
      variables: { accountSlug, userId: user.id },
    })
    handleError(res, 'deactivateUser')
    await refetchUsers()
    setUserToDelete(null)
  }

  const onUserEdit = userid => {
    setUserToEdit(users.find(user => user.id === userid))
  }

  const onUserDelete = username => {
    // Check if user is themselves
    if (username !== userName) {
      setUserToDelete(users.find(user => user.username === username))
    } else {
      dispatch(createNotification({ message: 'Unable to delete yourself' }))
    }
  }

  const handleError = (res, key) => {
    if (get(res, `data.${key}.ok`, null) === false) {
      const message = get(res, `data.${key}.message`, '')
      dispatch(createNotification({ message }))
    }
  }

  const handleAdd = index => {
    if (index === 0) {
      setIsUserCreateOpen(true)
    } else {
      setIsIdentityCreateOpen(true)
    }
  }

  const hideUserForm = () => {
    setIsCreateOpen(false)
    setIsUserCreateOpen(false)
    setIsIdentityCreateOpen(false)
    setUserToEdit(null)
    setTabIndex(0)
  }

  const hideDeleteDialog = () => {
    setUserToDelete(null)
  }

  const handleDeleteConfirm = async () => {
    await removeUser(userToDelete)
    hideDeleteDialog()
  }

  const redirectToIdentity = () =>
    history.push(`/accounts/${accountSlug}/settings/users/identity-sources`)

  useEffect(() => {
    if (data && data.allActiveOrNewUsersByAccount) {
      const userList = data.allActiveOrNewUsersByAccount
        .map(user => trimUser(user, accountSlug))
        .filter(user =>
          filterUser(
            user,
            identitySourcesMetaInfo.hasIdentitySources,
            sites.map(({ slug }) => slug),
          ),
        )
      setUsers(userList)
    }
    // eslint-disable-next-line
  }, [data])

  useEffect(() => {
    if (userRoles && userRoles.getUserRoles) {
      const options = userRoles.getUserRoles.map(({ id, name }) => ({
        label: name,
        value: id,
      }))
      setRoleOptions(options)
    }
  }, [userRoles])

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
    if (
      identitySourcesData &&
      identitySourcesData.getIdentitySourcesForAccount &&
      Array.isArray(identitySourcesData.getIdentitySourcesForAccount)
    ) {
      setIdentitySources(
        identitySourcesData.getIdentitySourcesForAccount.filter(
          item => item.active,
        ),
      )
    }
  }, [identitySourcesData])

  const hasUsers = users && Array.isArray(users) && users.length > 0

  const identitySourcesMetaInfo = getIdentitySourcesMetaInfo(identitySources)

  const hasIdWithoutUser =
    !hasUsers && identitySourcesMetaInfo.hasIdentitySources

  if (gettingUsers || rolesLoading || typesLoading || gettingIds) {
    return <Skeleton />
  }

  return (
    <div>
      {(hasUsers || hasIdWithoutUser) && (
        <Grid container justify='space-between'>
          <h3 className='am-h4' style={{ margin: '16px 0' }}>
            User Management
          </h3>
          {identitySourcesMetaInfo.hasIdentitySources ? (
            <div style={{ display: 'flex' }}>
              <Can I='is_internal' on='Admin'>
                <Button
                  onClick={() => setIsCreateOpen(true)}
                  customStyle={{ marginTop: 20 }}
                >
                  Add Users
                </Button>
              </Can>
              <Button
                onClick={redirectToIdentity}
                customStyle={{ marginTop: 20 }}
              >
                View Identity Sources
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => setIsCreateOpen(true)}
              customStyle={{ marginTop: 20 }}
            >
              Add Users
            </Button>
          )}
        </Grid>
      )}
      {hasUsers || identitySourcesMetaInfo.hasIdentitySources ? (
        <UserTable
          users={users}
          onUserEdit={onUserEdit}
          onUserDelete={onUserDelete}
          identitySourcesMetaInfo={identitySourcesMetaInfo}
          onSync={() => syncIdentitySource()}
          syncing={syncing}
          showAddNowButton={!identitySourcesMetaInfo.hasIdentitySources}
          emptyComment={
            identitySourcesMetaInfo.hasIdentitySources
              ? 'You currently have no items.\nAdd users to your identity sources and ensure syncing is happening successfully.'
              : 'You currently have no items.'
          }
        />
      ) : (
        <Start onAdd={handleAdd} />
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
          loading={updatingUser || isRefetching}
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
          loading={creatingUser || isRefetching}
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
          loading={creatingIdentity}
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
          userFormLoading={creatingUser || isRefetching}
          roleOptions={roleOptions}
          redirectToIdentity={redirectToIdentity}
          idSourceTypesOptions={idSourceTypesOptions}
          addIdentitySource={addIdentitySource}
          identityFormLoading={creatingIdentity}
          hideIdentityForm={hideUserForm}
        />
      </Modal>
      <ConfirmDialog
        open={userToDelete}
        onClose={hideDeleteDialog}
        onConfirm={handleDeleteConfirm}
        loading={deletingUser || isRefetching}
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
