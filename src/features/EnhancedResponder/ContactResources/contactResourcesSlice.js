/* eslint-disable no-case-declarations, no-param-reassign, no-fallthrough */
import { createSlice } from '@reduxjs/toolkit'
import get from 'lodash/get'

const initialState = {
  contacts: [],
  contactsLoading: false,
  createContactLoading: false,
  deleteContactLoading: false,
  updateContactLoading: false,
  createModalOpened: false,
  deleteModalOpened: false,
  updateModalOpened: false,
  contactToDelete: null,
  contactToUpdate: null,
}

const slice = createSlice({
  name: 'contactResources',
  initialState,

  reducers: {
    resetState: () => initialState,

    openCreateModal: state => {
      state.createModalOpened = true
    },

    closeCreateModal: state => {
      state.createModalOpened = false
    },

    openDeleteModal: (state, action) => {
      state.deleteModalOpened = true
      state.contactToDelete = action.payload.contact
    },

    closeDeleteModal: state => {
      state.deleteModalOpened = false
      state.contactToDelete = null
    },

    openUpdateModal: (state, action) => {
      state.updateModalOpened = true
      state.contactToUpdate = action.payload.contact
    },

    closeUpdateModal: state => {
      state.updateModalOpened = false
      state.contactToUpdate = null
    },

    fetchContactsRequested: state => {
      state.contactsLoading = true
    },

    fetchContactsSucceeded: (state, action) => {
      state.contacts = action.payload.contacts
      state.contactsLoading = false
    },

    fetchContactsFailed: (state, action) => {
      state.contactsLoading = false
      state.error = action.payload.error
    },

    createContactRequested: state => {
      state.createContactLoading = true
    },

    createContactSucceeded: (state, action) => {
      state.contacts.push(action.payload.contact)
      state.createContactLoading = false
      state.createModalOpened = false
    },

    createContactFailed: (state, action) => {
      state.createContactLoading = false
      state.error = action.payload.error
    },

    deleteContactRequested: state => {
      state.deleteContactLoading = true
    },

    deleteContactSucceeded: (state, action) => {
      state.contacts = state.contacts.filter(
        e => parseInt(e.id, 10) !== parseInt(action.payload.id, 10),
      )
      state.deleteContactLoading = false
      state.deleteModalOpened = false
    },

    deleteContactFailed: (state, action) => {
      state.error = action.payload.error
      state.deleteContactLoading = false
    },

    updateContactRequested: state => {
      state.updateContactLoading = true
    },

    updateContactSucceeded: (state, action) => {
      state.contacts = state.contacts.filter(
        e => parseInt(e.id, 10) !== parseInt(action.payload.contact.id, 10),
      )
      state.contacts.push(action.payload.contact)
      state.updateContactLoading = false
      state.updateModalOpened = false
    },

    updateContactFailed: (state, action) => {
      state.error = action.payload.error
      state.updateContactLoading = false
    },

    updateAssignment: (state, action) => {
      const old = state.contacts.find(
        contact =>
          parseInt(get(contact, 'lastWorkShiftPeriod.profile.id'), 10) ===
            parseInt(
              action.payload.data.createOrEndWorkShift.workShiftPeriod.profile
                .id,
              10,
            ) &&
          parseInt(contact.id, 10) !==
            parseInt(action.payload.contactResourceId, 10) &&
          get(contact, 'lastWorkShiftPeriod.endWorkShift') === null,
      )
      const updated = state.contacts.find(
        contact =>
          parseInt(contact.id, 10) ===
          parseInt(action.payload.contactResourceId, 10),
      )

      state.contacts = state.contacts.filter(
        e =>
          parseInt(e.id, 10) !== parseInt(action.payload.contactResourceId, 10),
      )
      if (old) {
        state.contacts = state.contacts.filter(
          contact =>
            parseInt(get(contact, 'id'), 10) !== parseInt(get(old, 'id'), 10),
        )
        if (!old.lastWorkShiftPeriod) {
          old.lastWorkShiftPeriod = {}
        }
        old.lastWorkShiftPeriod.endWorkShift = {
          signIn: false,
          workShiftPeriodEnded: [{ id: null }],
        }
        state.contacts.push(old)
      }

      if (updated) {
        updated.lastWorkShiftPeriod =
          action.payload.data.createOrEndWorkShift.workShiftPeriod

        state.contacts.push(updated)
      }
    },
  },
})

export const {
  resetState,

  openCreateModal,
  closeCreateModal,
  openDeleteModal,
  closeDeleteModal,
  openUpdateModal,
  closeUpdateModal,

  fetchContactsRequested,
  fetchContactsSucceeded,
  fetchContactsFailed,

  createContactRequested,
  createContactSucceeded,
  createContactFailed,

  deleteContactRequested,
  deleteContactSucceeded,
  deleteContactFailed,

  updateContactRequested,
  updateContactSucceeded,
  updateContactFailed,

  updateAssignment,
} = slice.actions

export default slice.reducer
