import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { DragDropContext } from 'react-beautiful-dnd'
import get from 'lodash/get'
import clsx from 'clsx'
import Divider from '@material-ui/core/Divider'
// src
import SimpleLabel from 'components/Label/SimpleLabel'
import {
  securityProfilesFetchRequested,
  getEscalationPoliciesRequested,
} from 'redux/threatEscalation/actions'
import { useFlexStyles } from 'common/styles/commonStyles'
import useGlobalSelectedSite from 'common/hooks/useGlobalSelectedSite'

import EscalationPolicy from '../EscalationPolicy'
import Skeleton from '../../Skeleton'
import useDragEnd from '../../utils/useDragEnd'

import './index.css'
import useStyles from './styles'
import LoadingScreen from '../../../LoadingScreen'

const Escalation = () => {
  const classes = useStyles()
  const flexClasses = useFlexStyles()
  const dispatch = useDispatch()
  const { account } = useParams()

  const loading = useSelector(
    state =>
      state.threatEscalation.loading ||
      state.threatEscalation.loadingEscalationPolicies,
  )
  const securityProfiles = useSelector(
    state => state.threatEscalation.securityProfiles,
  )
  const [globalSelectedSite] = useGlobalSelectedSite()

  useEffect(() => {
    // TODO: @rodaan - we will remove this when we remove this page from site level routing
    if (globalSelectedSite) {
      dispatch(
        securityProfilesFetchRequested({
          accountSlug: account,
          siteSlug: globalSelectedSite,
        }),
      )
      dispatch(
        getEscalationPoliciesRequested({
          accountSlug: account,
          siteSlug: globalSelectedSite,
        }),
      )
    }
  }, [account, dispatch, globalSelectedSite])

  const onDragEnd = useDragEnd({
    securityProfiles,
    siteSlug: globalSelectedSite,
    account,
  })

  // if (loading) return <Skeleton />
  if (loading) return <LoadingScreen />

  return (
    <div className='app'>
      <div className='threat-response'>
        <DragDropContext onDragEnd={onDragEnd} className='container-fluid'>
          {securityProfiles.map((securityProfile, index) => {
            const { escalationPoliciesForSev } = securityProfile

            // High Policy
            let highPolicy = escalationPoliciesForSev.find(policy => {
              return policy.severity === 'sev0'
            })

            if (!highPolicy) {
              highPolicy = { ...securityProfile, severity: 'sev0', index: 0 }
            } else {
              highPolicy = { ...highPolicy, ...securityProfile, index: 0 }
            }

            // Medium Policy
            let mediumPolicy = escalationPoliciesForSev.find(policy => {
              return policy.severity === 'sev1'
            })

            if (!mediumPolicy) {
              mediumPolicy = { ...securityProfile, severity: 'sev1', index: 1 }
            } else {
              mediumPolicy = { ...mediumPolicy, ...securityProfile, index: 1 }
            }

            return (
              <div key={index}>
                <Divider classes={{ root: classes.dividerRoot }} />
                <div
                  className={clsx(
                    flexClasses.row,
                    flexClasses.centerStart,
                    classes.titleContainer,
                  )}
                >
                  <div className={clsx('am-h6', classes.policyTitle)}>
                    {securityProfile.name}{' '}
                  </div>
                  <SimpleLabel>Security Profile</SimpleLabel>
                </div>
                <div
                  key={`securityProfile-${get(
                    highPolicy,
                    'escalationPolicy.id',
                  )}-high`}
                >
                  <EscalationPolicy
                    data={highPolicy}
                    accountSlug={account}
                    id={get(highPolicy, 'escalationPolicy.id')}
                    siteSlug={globalSelectedSite}
                    index={index}
                  />
                </div>
                <div
                  key={`securityProfile-${get(
                    mediumPolicy,
                    'escalationPolicy.id',
                  )}-medium`}
                >
                  <EscalationPolicy
                    data={mediumPolicy}
                    accountSlug={account}
                    id={get(mediumPolicy, 'escalationPolicy.id')}
                    siteSlug={globalSelectedSite}
                    index={index}
                  />
                </div>
              </div>
            )
          })}
        </DragDropContext>
      </div>
    </div>
  )
}

export default Escalation
