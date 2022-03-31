import React, { useEffect, useState } from 'react'
import { useLazyQuery, useMutation } from '@apollo/react-hooks'
import { useDispatch } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'

import { withLayout } from '../../hoc'
import LoadingScreen from '../LoadingScreen'
import SidebarLayout from '../../layouts/SidebarLayout'
import { loginSucceeded } from '../../redux/slices/auth'

import { VERIFY_TOKEN, AUTH_INFO_BY_TOKEN } from './gql'

const SSOLandingScreen = () => {
  const { token } = useParams()
  const dispatch = useDispatch()
  const history = useHistory()
  const [verifyToken] = useMutation(VERIFY_TOKEN)
  const [getAuthInfo, { data: authInfo }] = useLazyQuery(AUTH_INFO_BY_TOKEN)
  const [payload, setPayload] = useState(null)

  const handleSuccessLogin = async authData => {
    const { accounts, sites } = authData
    dispatch(loginSucceeded(authData))
    history.push(`/accounts/${accounts[0].slug}/sites/${sites[0].slug}/live`)
  }

  const handleAuthentication = async () => {
    const verifyTokenResult = await verifyToken({
      variables: {
        token,
      },
    })

    const { payload: newPayload } = verifyTokenResult.data.verifyToken

    getAuthInfo({ variables: { token } })
    setPayload(newPayload)
  }

  useEffect(() => {
    handleAuthentication()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (authInfo) {
      const {
        user,
        profile,
        accounts,
        sites,
      } = authInfo.getAuthInformationByToken

      const authData = {
        payload,
        accounts,
        profile,
        token,
        user,
        sites,
      }

      handleSuccessLogin(authData)
    }
    // eslint-disable-next-line
  }, [authInfo, token])

  return <LoadingScreen />
}

export default withLayout(SidebarLayout)(SSOLandingScreen)
