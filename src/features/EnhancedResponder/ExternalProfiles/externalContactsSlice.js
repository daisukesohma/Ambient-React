/* eslint-disable no-case-declarations, no-param-reassign, no-fallthrough */
import { createSlice } from '@reduxjs/toolkit'
import remove from 'lodash/remove'
import findIndex from 'lodash/findIndex'

const initialState = {
  contacts: [],
  contactsLoading: false,
  createContactLoading: false,
  deleteContactLoading: false,
  updateContactLoading: false,
  createModalOpen: false,
  updateModalOpen: false,
  deleteModalOpen: false,
  contact: null,
}

const slice = createSlice({
  name: 'externalContacts',
  initialState,

  reducers: {
    resetState: () => initialState,

    openCreateModal: state => {
      state.createModalOpen = true
    },
    closeCreateModal: state => {
      state.createModalOpen = false
    },
    openUpdateModal: (state, action) => {
      state.updateModalOpen = true
      state.contact = action.payload.contact
    },
    closeUpdateModal: state => {
      state.updateModalOpen = false
      state.contact = null
    },
    openDeleteModal: (state, action) => {
      state.deleteModalOpen = true
      state.contact = action.payload.contact
    },
    closeDeleteModal: state => {
      state.deleteModalOpen = false
      state.contact = null
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
      // console.log('action.payload.contact', action.payload.contact)
      state.contacts.push(action.payload.contact)
      state.createContactLoading = false
      state.createModalOpen = false
    },

    createContactFailed: (state, action) => {
      state.createContactLoading = false
      state.error = action.payload.error
    },

    deleteContactRequested: state => {
      state.deleteContactLoading = true
    },

    deleteContactSucceeded: (state, action) => {
      remove(state.contacts, { id: action.payload.input.id })
      state.deleteContactLoading = false
      state.deleteModalOpen = false
    },

    deleteContactFailed: (state, action) => {
      state.error = action.payload.error
      state.deleteContactLoading = false
    },

    updateContactRequested: (state, action) => {
      state.updateContactLoading = true
    },

    updateContactSucceeded: (state, action) => {
      const index = findIndex(state.contacts, c => {
        return c.id === action.payload.input.id
      })
      state.contacts[index].name = action.payload.input.name
      state.contacts[index].email = action.payload.input.email
      state.contacts[index].phoneNumber = action.payload.input.phoneNumber
      state.updateContactLoading = false
      state.updateModalOpen = false
    },

    updateContactFailed: (state, action) => {
      state.error = action.payload.error
      state.updateContactLoading = false
    },
  },
})

export const {
  resetState,

  openCreateModal,
  closeCreateModal,
  openUpdateModal,
  closeUpdateModal,
  openDeleteModal,
  closeDeleteModal,

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
} = slice.actions

export default slice.reducer
