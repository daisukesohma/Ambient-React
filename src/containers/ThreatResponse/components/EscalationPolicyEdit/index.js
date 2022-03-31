import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { DragDropContext } from 'react-beautiful-dnd'
import { Alert, AlertTitle } from '@material-ui/lab'
import isEmpty from 'lodash/isEmpty'
// src
import { AlertLevelLabel } from 'ambient_ui'
import {
  getEscalationPolicyRequested,
  securityProfilesFetchRequested,
} from 'redux/threatEscalation/actions'
import PageTitle from 'components/Page/Title'
import SeverityToReadableTextEnum from 'enums/SeverityToReadableTextEnum'
import useGlobalSelectedSite from 'common/hooks/useGlobalSelectedSite'

import EscalationPolicy from '../EscalationPolicy'
import Skeleton from '../../Skeleton'
import useDragEnd from '../../utils/useDragEnd'

import useStyles from './styles'

const EscalationPolicyEdit = () => {
  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({ darkMode })
  const dispatch = useDispatch()
  const { account, policyId } = useParams()

  const securityProfiles = useSelector(
    state => state.threatEscalation.securityProfiles,
  )

  const loading = useSelector(state => state.threatEscalation.gettingPolicy)
  const [globalSelectedSite] = useGlobalSelectedSite()
  const selectedPolicy = useSelector(
    state => state.threatEscalation.selectedPolicy,
  )

  useEffect(() => {
    if (globalSelectedSite && isEmpty(securityProfiles)) {
      dispatch(
        securityProfilesFetchRequested({
          accountSlug: account,
          siteSlug: globalSelectedSite,
        }),
      )
    }
  }, [account, dispatch, globalSelectedSite, securityProfiles])

  useEffect(() => {
    if (globalSelectedSite) {
      dispatch(getEscalationPolicyRequested(policyId))
    }
  }, [dispatch, globalSelectedSite, policyId])

  const dragEndCallback = useDragEnd({
    securityProfiles,
    siteSlug: globalSelectedSite,
    account,
  })
  const onDragEnd = dropResult => {
    dragEndCallback(dropResult, () => {
      dispatch(getEscalationPolicyRequested(policyId))
    })
  }

  if (loading) return <Skeleton />
  if (!selectedPolicy)
    return <PageTitle title='Empty Escalation Policy' darkMode={darkMode} />

  return (
    <div className='app'>
      {selectedPolicy &&
        selectedPolicy.escalationPoliciesForSev &&
        selectedPolicy.escalationPoliciesForSev.length > 0 && (
          <Alert severity='warning' className={classes.alertPanel}>
            <AlertTitle>Escalation Policy attached to:</AlertTitle>
            {selectedPolicy.escalationPoliciesForSev.map(
              escalationPolicyForSev => {
                return (
                  <span
                    key={`warning-el-${escalationPolicyForSev.id}`}
                    className={classes.escalationPolicyForSevListing}
                  >
                    {escalationPolicyForSev.securityProfile.site.name} -{' '}
                    {escalationPolicyForSev.securityProfile.name}
                    <span className={classes.escalationPolicyForSevAlertLabel}>
                      <AlertLevelLabel
                        level={
                          escalationPolicyForSev.severity
                            ? SeverityToReadableTextEnum[
                                escalationPolicyForSev.severity
                              ].toLowerCase()
                            : ''
                        }
                        label={
                          escalationPolicyForSev.severity
                            ? SeverityToReadableTextEnum[
                                escalationPolicyForSev.severity
                              ]
                            : ''
                        }
                      />
                    </span>
                  </span>
                )
              },
            )}
          </Alert>
        )}
      <div className='threat-response'>
        <DragDropContext onDragEnd={onDragEnd} className='container-fluid'>
          <div key={`securityProfile-${policyId}-high`}>
            <EscalationPolicy
              data={{ escalationPolicy: selectedPolicy }}
              accountSlug={account}
              id={policyId}
              siteSlug={globalSelectedSite}
              viewMode={false}
            />
          </div>
        </DragDropContext>
      </div>
    </div>
  )
}

export default EscalationPolicyEdit
