import React, { useState, useEffect } from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { Droppable } from 'react-beautiful-dnd'
import { Button, Icons } from 'ambient_ui'
import get from 'lodash/get'
import compact from 'lodash/compact'
import clsx from 'clsx'
import Grid from '@material-ui/core/Grid'
// src
import {
  escalationLevelUpdate,
  escalationLevelDeletion,
} from 'redux/threatEscalation/actions'
import { showModal, hideModal } from 'redux/slices/modal'
import { ModalTypeEnum } from 'enums'
import { useCursorStyles } from 'common/styles/commonStyles'

import { EscalationContact, EscalationContactCreationForm } from '..'

import EscalationDuration from './EscalationDuration'
import useStyles from './styles'
import './index.css'

const { Trash: TrashIcon } = Icons

const EscalationLevel = props => {
  const theme = useTheme()
  const {
    accountSlug,
    siteSlug,
    policyId,
    id,
    index,
    policyIndex,
    editEnabled,
  } = props
  const deleteConfirmed = useSelector(state =>
    get(state, 'modal.data.confirmed'),
  )
  const classes = useStyles()
  const escalationLevel = props.data
  const cursorClasses = useCursorStyles()
  const dispatch = useDispatch()

  const handleUpdateEscalationLevel = durationSecs => {
    dispatch(
      escalationLevelUpdate({
        accountSlug,
        siteSlug,
        levelId: id,
        durationSecs,
      }),
    )
  }

  const handleDeleteEscalationLevel = () => {
    dispatch(escalationLevelDeletion({ accountSlug, siteSlug, levelId: id }))
  }

  const initContacts = get(escalationLevel, 'contacts', [])
  const profileIds = initContacts.map(contact => {
    return contact.profile.id
  })
  const profileList = [...new Set(profileIds)]
  const calculatedContacts = Object.values(
    get(escalationLevel, 'contacts', []).reduce((res, current) => {
      if (res[current.profile.id]) {
        res[current.profile.id].push(current)
      } else {
        res[current.profile.id] = [current]
      }
      return res
    }, {}),
  ).map(valueArr => ({
    ...valueArr[0],
    methods: valueArr.map(({ method }) => method.toLowerCase()),
  }))
  const contacts = []
  profileList.forEach(profileId => {
    contacts.push(
      calculatedContacts.find(contact => contact.profile.id === profileId),
    )
  })

  const [state, setState] = useState({
    isCreating: false,
    updatingDuration: false,
    speech: true,
    duration_secs: get(escalationLevel, 'durationSecs', 0),
    edited_duration_secs: get(escalationLevel, 'durationSecs', 0),
    deleteModalOpened: false,
  })

  const toggleUpdatingDurationSecs = () => {
    const updatingDuration = !state.updatingDuration

    const updated = {
      updatingDuration,
    }

    if (!updatingDuration) {
      updated.edited_duration_secs = state.duration_secs
    }
    setState({
      ...state,
      ...updated,
    })
  }

  const updateDurationSecs = () => {
    const properDurationSecs =
      state.edited_duration_secs === '' ? 0 : state.edited_duration_secs

    handleUpdateEscalationLevel(properDurationSecs)

    setState({
      ...state,
      duration_secs: properDurationSecs,
      edited_duration_secs: properDurationSecs,
      updatingDuration: false,
    })
  }

  const onDurationChange = e => {
    setState({
      ...state,
      edited_duration_secs: e.target.value.replace(/\D/, ''),
    })
  }

  const handleDelete = () => {
    setState({ ...state, deleteModalOpened: true })

    dispatch(
      showModal({
        type: ModalTypeEnum.CONFIRM,
        content: {
          html: () => (
            <div className='escalation-contact-remove-modal'>
              Are you sure you want to remove Level {props.data.level}?
            </div>
          ),
          closeCallback: () => {
            setState({ ...state, deleteModalOpened: false })
          },
        },
      }),
    )
  }

  const contactCreation = state.isCreating ? (
    <EscalationContactCreationForm
      levelId={props.id}
      level={props.data}
      state={props.state}
      accountSlug={accountSlug}
      siteSlug={siteSlug}
      _createNotification={props._createNotification}
      hideContactForm={() => {
        setState({
          ...state,
          isCreating: false,
        })
      }}
    />
  ) : null
  let button = null
  if (!state.isCreating) {
    button = (
      <Button
        onClick={() => {
          setState({
            ...state,
            isCreating: true,
          })
        }}
      >
        Add Contact
      </Button>
    )
  }

  useEffect(() => {
    if (deleteConfirmed && state.deleteModalOpened) {
      handleDeleteEscalationLevel()
      dispatch(hideModal())
    }
    // eslint-disable-next-line
  }, [deleteConfirmed])

  return (
    <Droppable droppableId={String(props.id)} type='LEVEL' key={props.id}>
      {(provided, snapshot) => (
        <div key={props.id} className={classes.levelContainer}>
          <div className='row between'>
            <div className={clsx('am-h6', classes.level)}>
              Level {Number(props.data.level)}
            </div>
            <div className='col-lg-2 col-xs-2 col-sm-2 col-md-2'>
              {editEnabled && (
                <div onClick={handleDelete} className={cursorClasses.pointer}>
                  <TrashIcon
                    width={16}
                    height={16}
                    stroke={theme.palette.grey[500]}
                  />
                </div>
              )}
            </div>
          </div>
          <EscalationDuration
            editEnabled={editEnabled}
            durationSecs={Number(state.duration_secs)}
            edited_duration_secs={Number(state.edited_duration_secs)}
            onDurationChange={onDurationChange}
            toggleUpdatingDurationSecs={toggleUpdatingDurationSecs}
            updateDurationSecs={updateDurationSecs}
            updatingDuration={state.updatingDuration}
          />
          <div
            ref={provided.innerRef}
            style={{
              // backgroundColor: snapshot.isDraggingOver ? '#dbdbdb' : 'white',
            }}
            {...provided.droppableProps}
            className={classes.levelDroppableArea}
          >
            {compact(contacts).map((contact, contactIndex) => (
              <EscalationContact
                id={contact.id}
                key={`escalationContact-${contact.id}`}
                index={contactIndex}
                policyId={policyId}
                policyIndex={policyIndex}
                levelId={escalationLevel.id}
                levelIndex={index}
                accountSlug={accountSlug}
                siteSlug={siteSlug}
                data={contact}
                editEnabled={editEnabled}
                handleRemoveEscalationContact={
                  props.handleRemoveEscalationContact
                }
                handleEditEscalationContact={props.handleEditEscalationContact}
                _createNotification={props._createNotification}
              />
            ))}
            {provided.placeholder}
          </div>
          {contactCreation}
          {editEnabled && (
            <Grid container justify='flex-end'>
              {button}
            </Grid>
          )}
        </div>
      )}
    </Droppable>
  )
}

EscalationLevel.propTypes = {
  data: PropTypes.object,
  handleEditEscalationLevel: PropTypes.func,
  id: PropTypes.number,
  state: PropTypes.object,
  _createNotification: PropTypes.func,
  handleDeleteEscalationLevel: PropTypes.func,
  policyId: PropTypes.number,
  handleRemoveEscalationContact: PropTypes.func,
  handleEditEscalationContact: PropTypes.func,
  deleteEscalationLevel: PropTypes.func,
  accountSlug: PropTypes.string,
  siteSlug: PropTypes.string,
  index: PropTypes.string,
  policyIndex: PropTypes.string,
  editEnabled: PropTypes.bool,
}

EscalationLevel.defaultProps = {
  editEnabled: false,
  data: {},
  handleEditEscalationLevel: () => {},
  id: null,
  state: {},
  _createNotification: () => {},
  handleDeleteEscalationLevel: () => {},
  policyId: null,
  handleRemoveEscalationContact: () => {},
  handleEditEscalationContact: () => {},
  deleteEscalationLevel: () => {},
}

export default EscalationLevel
