/* eslint-disable no-console */
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import mixpanel from 'mixpanel-browser'
// src
import { verifyTokenRequested } from 'redux/slices/auth'
import createMixpanelUser from 'mixpanel/utils/createMixpanelUser'

import LoadingScreen from './containers/LoadingScreen'
import JWTService from './common/services/JWTService'

interface Props {
  children: React.ReactNode
}

interface MixPanelAuth {
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
  }
  profile: {
    role: {
      role: string
    }
  }
}

interface State {
  auth: {
    token: string
  }
}

export default function VerifyCredentialsGate({
  children,
}: Props): JSX.Element {
  const oldToken = useSelector((state: State) => state.auth.token)
  const token = JWTService.migrateToken(oldToken)
  const hasToken = !isEmpty(token)
  const [loading, setLoading] = useState(hasToken)
  // TODO: need to use this reducer property after disabling localStorage(redux-persist) for auth reducer
  // const verifyTokenLoading = useSelector((state : State) => state.auth.verifyTokenLoading)
  const dispatch = useDispatch()

  const initMixpanel = (auth: MixPanelAuth | null) => {
    const user = get(auth, 'user', {})
    const profile = get(auth, 'profile', {})
    try {
      if (!isEmpty(user)) {
        mixpanel.identify(get(user, 'id'))
        mixpanel.people.set(createMixpanelUser(user, profile))
      }
    } catch (e) {
      console.error(e.message)
    }
  }

  useEffect(() => {
    if (hasToken) {
      dispatch(
        verifyTokenRequested({
          token,
          afterVerify: (auth: MixPanelAuth) => {
            // authorize real mixpanel user
            initMixpanel(auth)
            setLoading(false)
          },
        }),
      )
    } else {
      // authorize temp mixpanel user
      initMixpanel(null)
    }
  }, [hasToken, token, dispatch])

  if (loading) return <LoadingScreen />

  return <>{children}</>
}
