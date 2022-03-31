import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'

import { fetchSitesRequested } from '../../redux/threatEscalation/actions'

import {
  ThreatResponseToolbar,
  Escalation,
  ThreatResponseHeader,
  EscalationPolicies,
  EscalationPolicyEdit,
} from './components'
import useRouteProfiles from './utils/useRouteProfiles'
import useRoutePolicies from './utils/useRoutePolicies'
import useRoutePolicyEdit from './utils/useRoutePolicyEdit'

const ThreatResponse = () => {
  const dispatch = useDispatch()
  const { account } = useParams()

  const isProfiles = useRouteProfiles()
  const isPolicies = useRoutePolicies()
  const isPolicyEdit = useRoutePolicyEdit()

  useEffect(() => {
    dispatch(
      fetchSitesRequested({
        accountSlug: account,
      }),
    )
  }, [dispatch, account])

  return (
    <div>
      {!isPolicyEdit && <ThreatResponseHeader />}
      <ThreatResponseToolbar />
      {isProfiles && <Escalation />}
      {isPolicies &&
        (isPolicyEdit ? <EscalationPolicyEdit /> : <EscalationPolicies />)}
    </div>
  )
}

export default ThreatResponse
