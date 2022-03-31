import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useHistory, useLocation } from 'react-router-dom'
import { Button, SearchableSelectDropdown } from 'ambient_ui'
import { Grid } from '@material-ui/core'
import get from 'lodash/get'
import find from 'lodash/find'
// src
import useGlobalSelectedSite from 'common/hooks/useGlobalSelectedSite'
import { Can } from '../../../../rbac'
import { createEscalationPolicyForSevRequested } from '../../../../redux/threatEscalation/actions'
import dropDownOptions from '../../../../selectors/sites/dropDownOptions'
import useRoutePolicyEdit from '../../utils/useRoutePolicyEdit'
import PageTitle from '../../../../components/Page/Title'
import NewEscalationModal from '../EscalationPolicy/NewEscalation'
import useStyles from './styles'

const ThreatResponseToolbar = () => {
  const classes = useStyles()
  const { account } = useParams()
  const dispatch = useDispatch()
  const history = useHistory()
  const location = useLocation()
  const isEditMode = useRoutePolicyEdit()
  const siteOptions = useSelector(
    dropDownOptions([state => state.threatEscalation.sites]),
  )
  const [globalSelectedSite, setGlobalSelectedSite] = useGlobalSelectedSite()
  const selectedPolicy = useSelector(
    state => state.threatEscalation.selectedPolicy,
  )
  const sites = useSelector(state => state.threatEscalation.sites)
  const [newEscalationFormVisible, setNewEscalationFormVisible] = useState(
    false,
  )

  const createOrUpdateNewEscalation = ({ policyName }) => {
    const site = find(sites, { slug: globalSelectedSite })
    dispatch(
      createEscalationPolicyForSevRequested({
        siteId: get(site, 'id'),
        name: policyName,
      }),
    )
  }

  const handleSiteChange = e => {
    setGlobalSelectedSite(e.value)
  }

  const darkMode = useSelector(state => state.settings.darkMode)

  return (
    <Grid container style={{ marginTop: 16 }}>
      {isEditMode && (
        <>
          <Grid style={{ width: '100%', marginBottom: 16 }}>
            <PageTitle
              title={`Editing ${selectedPolicy ? selectedPolicy.name : ''}`}
              darkMode={darkMode}
            />
          </Grid>
          <Button
            onClick={() =>
              history.push(
                get(
                  location,
                  'state.from',
                  `/accounts/${account}/context/escalations/profiles`,
                ),
              )
            }
          >
            {' '}
            Back{' '}
          </Button>
        </>
      )}
      <Grid
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {!isEditMode && (
          <SearchableSelectDropdown
            id='threatSignatures-siteSelector'
            options={siteOptions}
            value={siteOptions.find(item => item.value === globalSelectedSite)}
            onChange={handleSiteChange}
            classOverride={classes.siteSelector}
          />
        )}
        {!isEditMode && history.location.pathname.includes('policies') && (
          <Can I='create' on='Escalations'>
            <Button
              onClick={() => setNewEscalationFormVisible(true)}
              customStyle={{ marginTop: 16 }}
            >
              {' '}
              Create Escalation Policy{' '}
            </Button>
          </Can>
        )}
      </Grid>
      <NewEscalationModal
        newEscalationFormVisible={newEscalationFormVisible}
        setNewEscalationFormVisible={setNewEscalationFormVisible}
        createNewEscalation={createOrUpdateNewEscalation}
      />
    </Grid>
  )
}

export default ThreatResponseToolbar
