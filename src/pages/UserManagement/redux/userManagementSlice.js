/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import get from 'lodash/get'

const userManagementSlice = createSlice({
  name: 'userManagement',
  initialState: {
    userRoles: [],
    idSourceTypes: [],
    identitySources: [],
    users: [],
    currentPage: 0,
    pages: 0,
    limit: 10,
    // searchQuery: null,
    searchQuery: '',
    totalCount: 0,
    userToEdit: null,
    userToDelete: null,
    siteSlugs: null,
    roleIds: null,
    hasUsers: false,

    isCreateOpen: false,
    isUserCreateOpen: false,
    isIdentityCreateOpen: false,

    loadingRoles: false,
    loadingIdSourceTypes: false,
    loadingIdentitySources: false,
    loadingUsers: false,

    creatingUser: false,
    editingUser: false,
    deletingUser: false,

    syncing: null, // null or id or 'all'
    creatingIdentitySource: false,
    updatingIdentitySource: false,
    deletingIdentitySource: false,
    activatingIdentitySource: false,
    deactivatingUnfederatedUsers: false,
    selectedIdentitySource: null,
    error: null,
  },

  reducers: {
    setStateValues: (state, action) => {
      action.payload.forEach(({ key, value }) => {
        state[key] = value
      })
    },
    fetchUserRolesRequested: state => {
      state.loadingRoles = true
    },
    fetchUserRolesSucceeded: (state, action) => {
      state.loadingRoles = false
      state.userRoles = action.payload.userRoles
    },
    fetchUserRolesFailed: (state, action) => {
      state.loadingRoles = false
      state.error = action.payload.error
    },
    fetchIdSourceTypesRequested: state => {
      state.loadingIdSourceTypes = true
    },
    fetchIdSourceTypesSucceeded: (state, action) => {
      state.loadingIdSourceTypes = false
      state.idSourceTypes = action.payload.idSourceTypes
    },
    fetchIdSourceTypesFailed: (state, action) => {
      state.loadingIdSourceTypes = false
      state.error = action.payload.error
    },
    fetchIdentitySourcesRequested: (state, action) => {
      state.loadingIdentitySources = true
    },
    fetchIdentitySourcesSucceeded: (state, action) => {
      state.loadingIdentitySources = false
      state.identitySources = action.payload.identitySources
    },
    fetchIdentitySourcesFailed: (state, action) => {
      state.loadingIdentitySources = false
      state.error = action.payload.error
    },
    fetchUsersRequested: state => {
      state.loadingUsers = true
    },
    fetchUsersSucceeded: (state, action) => {
      state.loadingUsers = false
      state.users = action.payload.users
      state.pages = action.payload.pages
      state.currentPage = action.payload.currentPage
      state.totalCount = action.payload.totalCount
      if (
        Array.isArray(action.payload.users) &&
        action.payload.users.length > 0
      ) {
        state.hasUsers = true
      }
    },
    fetchUsersFailed: (state, action) => {
      state.loadingUsers = false
      state.error = action.payload.error
    },
    createUserRequested: state => {
      state.creatingUser = true
    },
    createUserSucceeded: (state, action) => {
      state.creatingUser = false
      state.isCreateOpen = false
      state.isUserCreateOpen = false
      state.users.unshift(action.payload.user)
    },
    createUserFailed: (state, action) => {
      state.creatingUser = false
      state.error = action.payload.error
    },
    updateUserCheckinAssignment: (state, action) => {
      const { lastWorkShiftPeriod } = action.payload
      if (!lastWorkShiftPeriod.endWorkShift) {
        // checked into a new contact resource or site
        const prevUserIndex = state.users.findIndex(
          user =>
            !get(user, 'lastWorkShiftPeriod.endWorkShift') &&
            get(user, 'lastWorkShiftPeriod.contactResource.id', null) ===
              get(lastWorkShiftPeriod, 'contactResource.id', undefined),
        )
        if (prevUserIndex !== -1) {
          state.users[prevUserIndex].lastWorkShiftPeriod.endWorkShift = {
            tsCreated: new Date(),
          }
        }
      }
      // find user
      const userIndex = state.users.findIndex(
        user => user.profileId === lastWorkShiftPeriod.profile.id,
      )
      if (userIndex !== -1) {
        state.users[userIndex].lastWorkShiftPeriod = lastWorkShiftPeriod
      }
    },
    editUserRequested: state => {
      state.editingUser = true
    },
    editUserSucceeded: (state, action) => {
      state.editingUser = false
      state.userToEdit = null
      const userIndex = state.users.findIndex(
        user => user.id === action.payload.user.id,
      )
      if (userIndex !== -1) {
        state.users[userIndex] = action.payload.user
      }
    },
    editUserFailed: (state, action) => {
      state.editingUser = false
      state.error = action.payload.error
    },
    deleteUserRequested: state => {
      state.deletingUser = true
    },
    deleteUserSucceeded: (state, action) => {
      state.deletingUser = false
      state.userToDelete = null
      state.users = state.users.filter(
        user => user.id !== action.payload.userId,
      )
    },
    deleteUserFailed: (state, action) => {
      state.deletingUser = false
      state.error = action.payload.error
    },
    syncIdentitySourcesRequested: (state, action) => {
      const { identitySourceIds } = action.payload
      if (identitySourceIds.length === 1) {
        state.syncing = identitySourceIds[0].identitySourceId
      } else {
        state.syncing = 'all'
      }
    },
    syncIdentitySourcesSucceeded: state => {
      state.syncing = null
    },
    syncIdentitySourcesFailed: state => {
      state.syncing = null
    },
    createIdentitySourceRequested: state => {
      state.creatingIdentitySource = true
    },
    createIdentitySourceSucceeded: (state, action) => {
      state.creatingIdentitySource = false
      if (action.payload.identitySource.active) {
        state.identitySources.unshift(action.payload.identitySource)
      }
      state.isCreateOpen = false
      state.isIdentityCreateOpen = false
    },
    createIdentitySourceFailed: (state, action) => {
      state.creatingIdentitySource = false
      state.error = action.payload.error
    },
    updateIdentitySourceRequested: state => {
      state.updatingIdentitySource = true
    },
    updateIdentitySourceSucceeded: (state, action) => {
      state.updatingIdentitySource = false
      state.selectedIdentitySource = null
      const sourceIndex = state.identitySources.findIndex(
        identitySource =>
          identitySource.identitySourceId ===
          action.payload.identitySource.identitySourceId,
      )
      if (sourceIndex !== -1) {
        state.identitySources[sourceIndex] = action.payload.identitySource
      }
    },
    updateIdentitySourceFailed: (state, action) => {
      state.updatingIdentitySource = false
      state.error = action.payload.error
    },
    activateIdentitySourceRequested: state => {
      state.activatingIdentitySource = true
    },
    activateIdentitySourceSucceeded: state => {
      state.activatingIdentitySource = false
    },
    activateIdentitySourceFailed: (state, action) => {
      state.activatingIdentitySource = false
      state.error = action.payload.error
    },
    deactivateUnfederatedUsersRequested: state => {
      state.deactivatingUnfederatedUsers = true
    },
    deactivateUnfederatedUsersSucceeded: state => {
      state.deactivatingUnfederatedUsers = false
    },
    deactivateUnfederatedUsersFailed: (state, action) => {
      state.deactivatingUnfederatedUsers = false
      state.error = action.payload.error
    },
    deleteIdentitySourceRequested: state => {
      state.deletingIdentitySource = true
    },
    deleteIdentitySourceSucceeded: (state, action) => {
      state.deletingIdentitySource = false
      state.selectedIdentitySource = null
      state.identitySources = state.identitySources.filter(
        identitySource =>
          identitySource.identitySourceId !== action.payload.identitySourceId,
      )
    },
    deleteIdentitySourceFailed: (state, action) => {
      state.deletingIdentitySource = false
      state.error = action.payload.error
    },
  },
})

export const {
  setStateValues,
  updateUserCheckinAssignment,
  fetchUserRolesRequested,
  fetchUserRolesSucceeded,
  fetchUserRolesFailed,
  fetchIdSourceTypesRequested,
  fetchIdSourceTypesSucceeded,
  fetchIdSourceTypesFailed,
  fetchIdentitySourcesRequested,
  fetchIdentitySourcesSucceeded,
  fetchIdentitySourcesFailed,
  fetchUsersRequested,
  fetchUsersSucceeded,
  fetchUsersFailed,
  createUserRequested,
  createUserSucceeded,
  createUserFailed,
  editUserRequested,
  editUserSucceeded,
  editUserFailed,
  deleteUserRequested,
  deleteUserSucceeded,
  deleteUserFailed,
  syncIdentitySourcesRequested,
  syncIdentitySourcesSucceeded,
  syncIdentitySourcesFailed,
  createIdentitySourceRequested,
  createIdentitySourceSucceeded,
  createIdentitySourceFailed,
  updateIdentitySourceRequested,
  updateIdentitySourceSucceeded,
  updateIdentitySourceFailed,
  activateIdentitySourceRequested,
  activateIdentitySourceSucceeded,
  activateIdentitySourceFailed,
  deactivateUnfederatedUsersRequested,
  deactivateUnfederatedUsersSucceeded,
  deactivateUnfederatedUsersFailed,
  deleteIdentitySourceRequested,
  deleteIdentitySourceSucceeded,
  deleteIdentitySourceFailed,
} = userManagementSlice.actions

export default userManagementSlice.reducer
