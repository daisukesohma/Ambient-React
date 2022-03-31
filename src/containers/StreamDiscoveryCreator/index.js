import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'

import RouteLeavingGuard from '../../hoc/routeLeavingGuard'
import { setIsCreatorDirty } from '../../redux/streamDiscovery/actions'

import StreamDiscoveryCreator from './StreamDiscoveryCreator'

export default function StreamDiscoveryCreatorContainer() {
  const dispatch = useDispatch()
  const history = useHistory()
  const { account } = useParams()
  const isDirty = useSelector(state => state.streamDiscovery.isCreatorDirty)
  const isSubmitting = useSelector(state => state.jobLog.isSubmitting)

  const resetCreator = () => {
    dispatch(setIsCreatorDirty(false))
  }

  // Go back to jobs page AFTER isSubmitting data
  useEffect(() => {
    if (isSubmitting) {
      history.push(`/accounts/${account}/infrastructure/jobs`)
    }
  }, [isSubmitting, account, history])

  return (
    <>
      <RouteLeavingGuard
        when={isDirty && !isSubmitting}
        onNavigate={path => {
          resetCreator()
          history.push(path)
        }}
        shouldBlockNavigation={location => isDirty && !isSubmitting}
      />
      <StreamDiscoveryCreator />
    </>
  )
}
