/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice } from '@reduxjs/toolkit'

import { VIEWS } from '../enums'

export interface ReducerProps {
  login: {
    loading: boolean
    form: {
      username: string
      password: string
      accountSlug: string
      code: string
    }
    view: 'LOGIN' | 'SSO_LOGIN' | 'MFA_VERIFY'
    error: string
  }
}

const initialState = {
  loading: false,
  form: {
    username: '',
    password: '',
    accountSlug: '',
    code: '',
  },
  view: VIEWS.LOGIN,
  error: null,
}

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    updateForm: (state, action) => {
      const {
        field,
        value,
      }: {
        field: 'username' | 'password' | 'accountSlug' | 'code'
        value: string
      } = action.payload
      state.form[field] = value
    },
    changeView: (state, action) => {
      state.view = action.payload.view
    },

    checkMfaRequested: (state, action) => {
      state.loading = true
    },
    checkMfaSucceeded: (state, action) => {
      state.loading = false
    },
    checkMfaFailed: (state, action) => {
      state.loading = false
    },

    tokenAuthRequested: (state, action) => {
      state.loading = true
    },
    tokenAuthSucceeded: (state, action) => initialState,
    tokenAuthFailed: (state, action) => {
      state.loading = false
    },

    verifyTokenRequested: (state, action) => {
      state.loading = true
    },
    verifyTokenSucceeded: (state, action) => {
      state.loading = false
    },
    verifyTokenFailed: (state, action) => {
      state.loading = false
    },

    ssoLoginRequested: (state, action) => {
      state.loading = true
    },
    ssoLoginSucceeded: (state, action) => {
      state.loading = false
    },
    ssoLoginFailed: (state, action) => {
      state.loading = false
    },
  },
})

export const {
  updateForm,
  changeView,
  checkMfaRequested,
  checkMfaSucceeded,
  checkMfaFailed,
  tokenAuthRequested,
  tokenAuthSucceeded,
  tokenAuthFailed,
  verifyTokenRequested,
  verifyTokenSucceeded,
  verifyTokenFailed,
  ssoLoginRequested,
  ssoLoginSucceeded,
  ssoLoginFailed,
} = loginSlice.actions

export default loginSlice.reducer
