/* eslint-disable react/no-deprecated */
import React, { useState, useEffect } from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import get from 'lodash/get'
import clsx from 'clsx'
import { useParams, useHistory } from 'react-router-dom'
// src
import { AlertLevelLabel, Button, DropdownMenu, Icons } from 'ambient_ui'
import { animations } from 'common/styles/animations'
import {
  escalationLevelCreation,
  updateEscalationPolicyForSevRequested,
} from 'redux/threatEscalation/actions'
import { SeverityToReadableTextEnum } from 'enums'
import SimpleLabel from 'components/Label/SimpleLabel'
import { useCursorStyles, useFlexStyles } from 'common/styles/commonStyles'
import { createNotification } from 'redux/slices/notifications'
import { Can } from 'rbac'

import { EscalationLevel } from '..'

import './index.css'
import useStyles from './styles'

const { Edit: EditIcon } = Icons

const EscalationPolicy = props => {
  const {
    index,
    accountSlug,
    siteSlug,
    viewMode,
    data: securityProfile,
  } = props
  const theme = useTheme()
  const classes = useStyles()
  const flexClasses = useFlexStyles()
  const cursorClasses = useCursorStyles()
  const history = useHistory()
  const { account } = useParams()
  const [editEnabled, setEditEnabled] = useState(!props.viewMode)
  const [
    selectedEscalationPolicyOption,
    setSelectedEscalationPolicyOption,
  ] = useState()
  const { deleteEscalationLevel } = props
  const escalationPolicies = useSelector(
    state => state.threatEscalation.escalationPolicies,
  )
  const dispatch = useDispatch()
  const levels = get(securityProfile, 'escalationPolicy.levels', [])
  const policyId = get(securityProfile, 'escalationPolicy.id')

  const escalationOptions = escalationPolicies.map(escalationPolicy => ({
    label: (
      <div>
        {escalationPolicy.name} <SimpleLabel>Escalation Policy</SimpleLabel>
      </div>
    ),
    value: escalationPolicy.id,
  }))

  useEffect(() => {
    if (securityProfile.escalationPolicy) {
      setSelectedEscalationPolicyOption(
        escalationOptions.find(
          option =>
            Number(option.value) ===
            Number(securityProfile.escalationPolicy.id),
        ),
      )
    }
    // eslint-disable-next-line
  }, [securityProfile])

  const handleCreateEscalationLevel = level => {
    dispatch(
      escalationLevelCreation({ accountSlug, siteSlug, policyId, level }),
    )
  }

  const handleEdit = () => {
    if (viewMode) {
      history.push({
        pathname: `/accounts/${account}/context/escalations/policies/${get(
          securityProfile,
          'escalationPolicy.id',
          '',
        )}`,
        state: {
          from: `/accounts/${account}/context/escalations/profiles`,
        },
      })
    } else {
      setEditEnabled(!editEnabled)
    }
  }

  const darkMode = useSelector(state => state.settings.darkMode)

  return (
    <div className=''>
      <div className='row policy'>
        {viewMode && (
          <>
            <div className='policy__name'>
              <span className={clsx('am-subtitle2', classes.subtitle)}>on</span>
              <div className='severity-label'>
                <AlertLevelLabel
                  level={
                    securityProfile.severity
                      ? SeverityToReadableTextEnum[
                          securityProfile.severity
                        ].toLowerCase()
                      : ''
                  }
                  label={
                    securityProfile.severity
                      ? SeverityToReadableTextEnum[securityProfile.severity]
                      : ''
                  }
                />
              </div>
              <span className={clsx('am-subtitle2', classes.subtitle)}>
                severity incidents, use the{' '}
              </span>
            </div>
            <Can I='update' on='Escalations' passThrough>
              {can => (
                <DropdownMenu
                  darkMode={darkMode}
                  menuItems={escalationOptions}
                  selectedItem={selectedEscalationPolicyOption}
                  handleSelection={option => {
                    if (can) {
                      setSelectedEscalationPolicyOption(option)
                      dispatch(
                        updateEscalationPolicyForSevRequested({
                          index: securityProfile.index,
                          securityProfileId: securityProfile.id,
                          severity: securityProfile.severity,
                          policyId: option.value,
                        }),
                      )
                    } else {
                      dispatch(
                        createNotification({
                          message:
                            'You do not have permissions to change escalation policies',
                        }),
                      )
                    }
                  }}
                />
              )}
            </Can>
          </>
        )}
        {props.viewMode && (
          <div
            className={cursorClasses.pointer}
            style={{ marginTop: 8 }}
            onClick={handleEdit}
          >
            <Can I='update' on='Escalations'>
              <EditIcon
                width={16}
                height={16}
                stroke={theme.palette.grey[500]}
              />
            </Can>
          </div>
        )}

        {editEnabled && (
          <Button
            onClick={() => {
              handleCreateEscalationLevel(levels.length + 1)
            }}
          >
            Add Escalation Level
          </Button>
        )}
      </div>
      <div className={clsx(flexClasses.row, classes.policyLevels)}>
        <AnimatePresence>
          {levels.length > 0 &&
            levels.map((level, levelIndex) => (
              <motion.div
                initial={animations.one.initial}
                animate={animations.one.animate}
                exit={animations.one.exit}
                key={`motion-escalationLevel-${level.id}`}
              >
                <EscalationLevel
                  accountSlug={accountSlug}
                  siteSlug={siteSlug}
                  data={level}
                  id={level.id}
                  key={`escalationLevel-${level.id}`}
                  index={levelIndex}
                  policyId={policyId}
                  policyIndex={index}
                  editEnabled={editEnabled}
                  handleDeleteEscalationLevel={
                    props.handleDeleteEscalationLevel
                  }
                  deleteEscalationLevel={deleteEscalationLevel}
                  handleCreateEscalationContact={
                    props.handleCreateEscalationContact
                  }
                  handleOpenCreateEscalationContactForm={
                    props.handleOpenCreateEscalationContactForm
                  }
                  handleRemoveEscalationContact={
                    props.handleRemoveEscalationContact
                  }
                  handleEditEscalationContact={
                    props.handleEditEscalationContact
                  }
                  handleEditEscalationLevel={props.handleEditEscalationLevel}
                  _createNotification={props._createNotification}
                />
              </motion.div>
            ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

EscalationPolicy.propTypes = {
  id: PropTypes.number,
  _createNotification: PropTypes.func,
  handleEditEscalationLevel: PropTypes.func,
  handleEditEscalationContact: PropTypes.func,
  handleRemoveEscalationContact: PropTypes.func,
  handleOpenCreateEscalationContactForm: PropTypes.func,
  handleCreateEscalationContact: PropTypes.func,
  handleDeleteEscalationLevel: PropTypes.func,
  data: PropTypes.object,
  viewMode: PropTypes.bool,
  deleteEscalationLevel: PropTypes.func,
  accountSlug: PropTypes.string,
  siteSlug: PropTypes.string,
  index: PropTypes.number,
}

EscalationPolicy.defaultProps = {
  id: null,
  _createNotification: () => {},
  handleEditEscalationLevel: () => {},
  handleEditEscalationContact: () => {},
  handleRemoveEscalationContact: () => {},
  handleOpenCreateEscalationContactForm: () => {},
  handleCreateEscalationContact: () => {},
  handleDeleteEscalationLevel: () => {},
  data: {},
  viewMode: true,
  deleteEscalationLevel: () => {},
}

export default EscalationPolicy
