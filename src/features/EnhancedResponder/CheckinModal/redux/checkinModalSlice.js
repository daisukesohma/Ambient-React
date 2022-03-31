/* eslint-disable no-case-declarations, no-param-reassign, no-fallthrough */
import { createSlice } from '@reduxjs/toolkit'
import get from 'lodash/get'

export const initialState = {
  users: [],
  sites: [],
  contactResources: [],

  usersLoading: false,
  sitesLoading: false,
  contactResourcesLoading: false,
  creatingWorkShift: false,

  checkinModalOpen: false,
  responderId: null,
  siteSlug: null,
  contactResourceId: null,

  responderReadOnly: false,
  contactResourceReadOnly: false,
  siteReadOnly: false,
  refreshUsers: false,

  error: null,
}

const checkinModalSlice = createSlice({
  name: 'checkinModal',
  initialState,
  reducers: {
    fetchSitesRequested: (state, action) => {
      state.sitesLoading = true
    },
    fetchSitesSucceeded: (state, action) => {
      state.sites = action.payload.sites
      state.sitesLoading = false
    },
    fetchSitesFailed: (state, action) => {
      state.error = action.payload.error
      state.sitesLoading = false
    },
    fetchUsersRequested: state => {
      state.usersLoading = true
    },
    fetchUsersSucceeded: (state, action) => {
      state.users = action.payload.users
      state.usersLoading = false
    },
    fetchUsersFailed: (state, action) => {
      state.error = action.payload.error
      state.usersLoading = false
    },
    updateUnSelectedSites: (state, action) => {
      state.unSelectedSites = action.payload.sites
    },
    fetchContactResourcesRequested: state => {
      state.contactResourcesLoading = true
    },
    fetchContactResourcesSucceeded: (state, action) => {
      state.contactResources = action.payload.contactResources
      state.contactResourcesLoading = false
    },
    fetchContactResourcesFailed: (state, action) => {
      state.error = action.payload.error
      state.contactResourcesLoading = false
    },
    createWorkShiftRequested: state => {
      state.creatingWorkShift = true
    },
    setCheckinModalOpen: (state, action) => {
      state.checkinModalOpen = action.payload.checkinModalOpen

      if (!action.payload.checkinModalOpen) {
        // reset when modal is closed
        state.responderId = null
        state.siteSlug = null
        state.contactResourceId = null
        state.responderReadOnly = false
        state.contactResourceReadOnly = false
        state.siteReadOnly = false
        state.refreshUsers = false
      } else {
        Object.keys(action.payload).forEach(key => {
          state[key] = action.payload[key]
        }) // checkinModalOpen, responderReadOnly, contactResourceReadOnly, refreshUsers
      }
    },
    setResponderId: (state, action) => {
      state.responderId = action.payload.responderId
    },
    setSiteSlug: (state, action) => {
      // need to check if current selected responder has access to the site
      state.siteSlug = action.payload.siteSlug
    },
    setContactResourceId: (state, action) => {
      state.contactResourceId = action.payload.contactResourceId
    },
    createWorkShiftSucceeded: (state, action) => {
      state.creatingWorkShift = false

      if (action.payload.data.createOrEndWorkShift.workShiftPeriod) {
        const foundContactResourceId = state.contactResources.findIndex(
          contactResource =>
            contactResource.id === action.payload.contactResourceId,
        )

        // Check to see if responder was checked in previously with a different contact resource id
        const oldContactResourceId = state.contactResources.findIndex(
          contactResource =>
            parseInt(
              get(contactResource, 'lastWorkShiftPeriod.profile.id', null),
              10,
            ) ===
              parseInt(
                action.payload.data.createOrEndWorkShift.workShiftPeriod.profile
                  .id,
                10,
              ) &&
            parseInt(contactResource.id, 10) !==
              parseInt(action.payload.contactResourceId, 10) &&
            get(contactResource, 'used') === true,
        )
        // set old contact resource to not being used
        if (oldContactResourceId !== -1) {
          state.contactResources[oldContactResourceId].used = false
          if (action.payload.signIn) {
            state.contactResources[
              oldContactResourceId
            ].lastWorkShiftPeriod.endWorkShift = {
              signIn: false,
              workShiftPeriodEnded: {
                id: -1,
              },
            }
          } else {
            state.contactResources[oldContactResourceId].lastWorkShiftPeriod =
              action.payload.data.createOrEndWorkShift.workShiftPeriod
          }
        }

        // Set new contact resource to being used and update workShift Period
        // while checking if its a check in or check out in case user checks
        // out with wrong contact resource. Dont want to update it wrong.
        if (foundContactResourceId !== -1 && action.payload.signIn) {
          const oldUserIndex = state.users.findIndex(
            user =>
              parseInt(get(user, 'profile.id'), 10) ===
              parseInt(
                get(
                  state.contactResources[foundContactResourceId],
                  'lastWorkShiftPeriod.profile.id',
                ),
                10,
              ),
          )

          if (oldUserIndex !== -1) {
            state.users[oldUserIndex].profile.isSignedIn = false
            state.users[
              oldUserIndex
            ].profile.lastWorkShiftPeriod.endWorkShift = {
              signIn: false,
              workShiftPeriodEnded: [
                {
                  id: state.users[oldUserIndex].profile.lastWorkShiftPeriod.id,
                  __typename: 'WorkShiftPeriodType',
                },
              ],
            }
          }

          state.contactResources[foundContactResourceId].used =
            action.payload.signIn

          state.contactResources[foundContactResourceId].lastWorkShiftPeriod =
            action.payload.data.createOrEndWorkShift.workShiftPeriod
        }

        const updatedUserIndex = state.users.findIndex(
          user => get(user, 'profile.id') === action.payload.userProfileId,
        )
        if (updatedUserIndex !== -1) {
          state.users[updatedUserIndex].profile.isSignedIn =
            action.payload.signIn

          state.users[updatedUserIndex].profile.lastWorkShiftPeriod =
            action.payload.data.createOrEndWorkShift.workShiftPeriod
        }
      }

      state.responderId = null
      state.siteSlug = null
      state.contactResourceId = null
      state.siteReadOnly = false
      state.responderReadOnly = false
      state.contactResourceReadOnly = false
      state.checkinModalOpen = false
    },
    createWorkShiftFailed: (state, action) => {
      state.error = action.payload.error
      state.creatingWorkShift = false
    },
    addContactResource: (state, action) => {
      const { contact } = action.payload
      contact.id = parseInt(contact.id, 10)
      state.contactResources.push(contact)
    },
    updateContactResource: (state, action) => {
      state.contactResources = state.contactResources.filter(
        e => parseInt(e.id, 10) !== parseInt(action.payload.contact.id, 10),
      )
      const { contact } = action.payload
      contact.id = parseInt(contact.id, 10)
      state.contactResources.push(contact)
    },
    deleteContactResource: (state, action) => {
      state.contactResources = state.contactResources.filter(
        e => parseInt(e.id, 10) !== parseInt(action.payload.id, 10),
      )
    },
  },
})

export const {
  fetchUsersRequested,
  fetchUsersSucceeded,
  fetchUsersFailed,
  fetchSitesRequested,
  fetchSitesSucceeded,
  fetchSitesFailed,
  updateUnSelectedSites,
  fetchContactResourcesRequested,
  fetchContactResourcesSucceeded,
  fetchContactResourcesFailed,
  setCheckinModalOpen,
  setResponderId,
  setSiteSlug,
  setContactResourceId,
  createWorkShiftRequested,
  createWorkShiftSucceeded,
  createWorkShiftFailed,
  addContactResource,
  updateContactResource,
  deleteContactResource,
} = checkinModalSlice.actions

export default checkinModalSlice.reducer
