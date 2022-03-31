import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import clsx from 'clsx'
import get from 'lodash/get'
import map from 'lodash/map'
import filter from 'lodash/filter'
import List from '@material-ui/core/List'
import ListSubheader from '@material-ui/core/ListSubheader'
// src
import { useCursorStyles } from 'common/styles/commonStyles'
import searchThreatSignatures from 'selectors/contextGraph/searchThreatSignatures'
import searchUndeployedThreatSignatures from 'selectors/contextGraph/searchUndeployedThreatSignatures'

import DeployThreat from '../DeployThreat'
import ThreatCard from '../../../ThreatCard'

import useStyles from './styles'

function ThreatCardList({
  isActiveThreatSignature,
  setThreatSignatureDetailViewAnchorEl,
}) {
  const cursorClasses = useCursorStyles()
  const classes = useStyles()
  const filterActiveSelected = useSelector(
    state => state.contextGraph.filterActiveSelected,
  )
  const filterSeveritySelected = useSelector(
    state => state.contextGraph.filterSeveritySelected,
  )
  const isDeployOpen = useSelector(state => state.contextGraph.createAlertOpen)
  const notDeployed = useSelector(searchUndeployedThreatSignatures)
  const previewMode = useSelector(state => state.contextGraph.previewMode)
  const alerts = useSelector(searchThreatSignatures)

  const filterActive = a => {
    if (!filterActiveSelected || filterActiveSelected === 'all') return a
    if (filterActiveSelected === 'active') {
      return a.status === 'active'
    }
    return a.status === 'disabled'
  }

  const filterAlertSeverity = a => {
    if (!filterSeveritySelected || filterSeveritySelected === 'all') return a
    return a.defaultAlert.severity === filterSeveritySelected
  }

  const filterDefaultAlertSeverity = a => {
    if (!filterSeveritySelected || filterSeveritySelected === 'all') return a
    return a.severity === filterSeveritySelected
  }

  const activeAlerts = filter(alerts, filterActive)
  const filteredAlerts = filter(activeAlerts, filterAlertSeverity)
  const filteredNotDeployed = filter(notDeployed, filterDefaultAlertSeverity)

  return (
    <List
      className={classes.root}
      disablePadding
      aria-labelledby='nested-list-subheader'
      id='threat-card-list'
    >
      <ListSubheader classes={{ root: classes.subheader }}>
        <span className='am-subtitle2'>
          {previewMode ? 'To Be Deployed' : 'Deployed'} ({alerts.length})
        </span>
      </ListSubheader>
      <div className={classes.list} id='threat-card-list-deployed'>
        {map(filteredAlerts, (tsAlert, index) => (
          <ThreatCard
            key={`tread-card-${index}`}
            leftAdornment={
              isDeployOpen ? (
                <div
                  className={clsx(
                    'am-overline',
                    cursorClasses.pointer,
                    classes.adornment,
                  )}
                >
                  Deployed
                </div>
              ) : null
            }
            tsAlert={tsAlert}
            tsName={tsAlert.name}
            isActiveThreatSignature={isActiveThreatSignature(tsAlert.id)}
            setEl={setThreatSignatureDetailViewAnchorEl}
            isHoverable
            showIncompatibleStreams
          />
        ))}
      </div>
      {!previewMode && (
        <ListSubheader classes={{ root: classes.subheader }}>
          <span className='am-subtitle2'>
            Not Deployed ({notDeployed.length})
          </span>
        </ListSubheader>
      )}
      <div className={classes.list} id='threat-card-list-not-deployed'>
        {isDeployOpen &&
          map(filteredNotDeployed, tsAlert => (
            <ThreatCard
              leftAdornment={<DeployThreat id={tsAlert.id} />}
              key={`tread-card-${tsAlert.id}`}
              tsAlert={tsAlert}
              tsName={get(tsAlert, 'threatSignature.name', '')}
              isHoverable={false}
              showIncompatibleStreams={false}
            />
          ))}
      </div>
    </List>
  )
}

ThreatCardList.propTypes = {
  isActiveThreatSignature: PropTypes.func,
  setThreatSignatureDetailViewAnchorEl: PropTypes.func,
}

ThreatCardList.defaultProps = {
  isActiveThreatSignature: () => {},
  setThreatSignatureDetailViewAnchorEl: () => {},
}

export default ThreatCardList
