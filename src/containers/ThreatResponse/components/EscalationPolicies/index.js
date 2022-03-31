import React, { useEffect, useMemo, useCallback, useState } from 'react'
import { useTheme } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'
import get from 'lodash/get'
import map from 'lodash/map'
import isEmpty from 'lodash/isEmpty'
import EditIcon from '@material-ui/icons/EditOutlined'
import DeleteIcon from '@material-ui/icons/Delete'
import Chip from '@material-ui/core/Chip'
import LinkIcon from '@material-ui/icons/Link'
// src
import useGlobalSelectedSite from 'common/hooks/useGlobalSelectedSite'
import { Can } from '../../../../rbac'
import {
  getEscalationPoliciesRequested,
  deleteEscalationPolicyRequested,
} from '../../../../redux/threatEscalation/actions'
import Skeleton from '../../Skeleton'
import { AlertLevelLabel } from '../../../../ambient_ui'
import DataTable from 'components/organisms/DataTable'
import SeverityToReadableTextEnum from '../../../../enums/SeverityToReadableTextEnum'
import ConfirmDialog from 'components/ConfirmDialog'

const EscalationPolicies = () => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const history = useHistory()
  const { account } = useParams()

  const [policyIdToDelete, setPolicyIdToDelete] = useState(null)

  const darkMode = useSelector(state => state.settings.darkMode)

  const loading = useSelector(
    state => state.threatEscalation.loadingEscalationPolicies,
  )
  const escalationPolicies = useSelector(
    state => state.threatEscalation.escalationPolicies,
  )
  const [globalSelectedSite] = useGlobalSelectedSite()
  const deletingPolicy = useSelector(
    state => state.threatEscalation.deletingPolicy,
  )

  useEffect(() => {
    if (globalSelectedSite) {
      dispatch(
        getEscalationPoliciesRequested({
          accountSlug: account,
          siteSlug: globalSelectedSite,
        }),
      )
    }
  }, [account, dispatch, globalSelectedSite])

  // Table Methods
  const renderStatus = useCallback(escalation => {
    return isEmpty(escalation.escalationPoliciesForSev) ? (
      <Chip label='Unused' />
    ) : (
      <Chip label='Attached' icon={<LinkIcon />} color='primary' />
    )
  }, [])

  const actions = useMemo(
    () => [
      {
        icon: () => (
          <EditIcon
            style={{
              // color: theme.palette.grey[700],
              cursor: 'pointer',
              fontSize: 20,
            }}
          />
        ),
        tooltip: 'Edit',
        onClick: (e, escalation) => {
          history.push({
            pathname: `/accounts/${account}/context/escalations/policies/${escalation.id}`,
            state: {
              from: `/accounts/${account}/context/escalations/policies`,
            },
          })
        },
      },
      {
        icon: () => (
          <DeleteIcon
            style={{
              // color: theme.palette.grey[700],
              cursor: 'pointer',
              fontSize: 20,
            }}
          />
        ),
        tooltip: 'Delete',
        onClick: (e, escalation) => {
          setPolicyIdToDelete(escalation.id)
        },
      },
    ],
    [history, account],
  )

  const renderProfileData = useCallback(escalation => {
    return (
      <div>
        {map(escalation.escalationPoliciesForSev, eps => {
          return (
            <div style={{ display: 'flex' }}>
              <span style={{ marginRight: 4 }}>
                {`${get(eps, 'securityProfile.site.name', '')} - ${get(
                  eps,
                  'securityProfile.name',
                  '',
                )}`}
              </span>
              <span style={{ marginTop: '2px' }}>
                <AlertLevelLabel
                  level={SeverityToReadableTextEnum[eps.severity]}
                  label={
                    eps.severity ? SeverityToReadableTextEnum[eps.severity] : ''
                  }
                />
              </span>
            </div>
          )
        })}
      </div>
    )
  }, [])

  const handleDelete = () => {
    dispatch(deleteEscalationPolicyRequested(policyIdToDelete))
    setPolicyIdToDelete(null)
  }

  const tableColumns = [
    {
      title: 'Name',
      field: 'name',
      props: {
        style: { fontWeight: 'bold', color: theme.palette.text.primary },
      },
    },
    {
      title: 'Status',
      render: renderStatus,
    },
    {
      title: 'Attached Security Profiles',
      render: renderProfileData,
    },
  ]

  if (loading) return <Skeleton />

  return (
    <Can I='update' on='Escalations' passThrough>
      {can => (
        <>
          <DataTable
            darkMode={darkMode}
            actions={can && actions}
            columns={tableColumns}
            data={escalationPolicies}
            defaultRowsPerPage={10}
          />

          <ConfirmDialog
            open={[null, undefined].indexOf(policyIdToDelete) === -1}
            onClose={() => setPolicyIdToDelete(null)}
            onConfirm={handleDelete}
            loading={deletingPolicy}
            content={`You are about to delete the escalation policy.
              Are you sure you want to do this?`}
          />
        </>
      )}
    </Can>
  )
}

export default EscalationPolicies
