import React from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { Button } from 'ambient_ui'
import { useSelector } from 'react-redux'

import useRouteProfiles from '../../utils/useRouteProfiles'
import PageTitle from '../../../../components/Page/Title'

const ThreatResponseTabs = () => {
  const { account } = useParams()
  const history = useHistory()
  const tabIndex = useRouteProfiles() ? 0 : 1
  const darkMode = useSelector(state => state.settings.darkMode)

  const handleChange = () => {
    const tab = tabIndex === 1 ? 'profiles' : 'policies'
    history.push(`/accounts/${account}/context/escalations/${tab}`)
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <PageTitle
        title={tabIndex === 0 ? 'Security Profiles' : 'Escalation Policies'}
        darkMode={darkMode}
      />
      <Button onClick={handleChange}>
        Go to {tabIndex === 1 ? 'Security Profiles' : 'Escalation Policies'}
      </Button>
    </div>
  )
}

export default ThreatResponseTabs
