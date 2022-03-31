/* eslint-disable react/no-deprecated */
import React, { useEffect, useState } from 'react'
import { useTheme } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { Draggable } from 'react-beautiful-dnd'
import get from 'lodash/get'
import clsx from 'clsx'
// src
import { Icons } from 'ambient_ui'
import genericAvatar from 'assets/generic_profile.jpg'
import { showModal, hideModal } from 'redux/slices/modal'
import { ModalTypeEnum } from 'enums'
import {
  escalationContactUpdate,
  escalationContactDeletion,
} from 'redux/threatEscalation/actions'
import UserAvatar from 'components/UserAvatar'
import { useCursorStyles, useFlexStyles } from 'common/styles/commonStyles'

import EscalationContactMethodIndicator from './EscalationContactMethodIndicator'
import './index.css'
import useStyles from './styles'

const EscalationContact = ({
  id,
  index,
  levelId,
  accountSlug,
  siteSlug,
  data,
  editEnabled,
  _createNotification,
}) => {
  const theme = useTheme()
  const classes = useStyles()
  const flexClasses = useFlexStyles()
  const cursorClasses = useCursorStyles()
  const deleteConfirmed = useSelector(state =>
    get(state, 'modal.data.confirmed'),
  )
  const { Close } = Icons
  const dispatch = useDispatch()

  const [isDeleteModal, setIsDeleteModal] = useState(false)

  const userProfile = get(data, 'profile')
  const firstName = get(userProfile, 'user.firstName', 'John')
  const lastName = get(userProfile, 'user.lastName', 'Doe')
  const name = `${firstName} ${lastName}`

  const updateStart = method => {
    const stateObj = {}
    const updatingState = `updating_${method}`
    stateObj[updatingState] = true
  }

  const updateComplete = method => {
    const stateObj = {}
    const updatingState = `updating_${method}`
    stateObj[updatingState] = false
  }

  const handleDelete = () => {
    setIsDeleteModal(true)
    dispatch(
      showModal({
        type: ModalTypeEnum.CONFIRM,
        content: {
          html: () => (
            <div className='escalation-contact-remove-modal'>
              Are you sure you want to remove {name}?
            </div>
          ),
          closeCallback: () => {
            setIsDeleteModal(false)
          },
        },
      }),
    )
  }

  const handleUpdate = method => {
    const { methods } = data
    const isRemove = methods.includes(method)
    if (isRemove) {
      dispatch(
        escalationContactDeletion({
          methods: [method],
          profileId: userProfile.id,
          escalationLevelId: levelId,
        }),
      )
    } else {
      dispatch(
        escalationContactUpdate({
          methods: [...methods, method],
          profileId: userProfile.id,
          siteSlug,
          accountSlug,
          escalationLevelId: levelId,
        }),
      )
    }
  }

  const handleDeleteAction = () => {
    const { methods } = data
    dispatch(
      escalationContactDeletion({
        methods,
        profileId: userProfile.id,
        escalationLevelId: levelId,
      }),
    )
  }

  useEffect(() => {
    if (deleteConfirmed && isDeleteModal) {
      handleDeleteAction()
      dispatch(hideModal())
    }
    // eslint-disable-next-line
  }, [deleteConfirmed])

  const avatar = userProfile ? userProfile.img : genericAvatar
  const role = get(userProfile, 'role.name', '')

  const isSignedIn =
    role !== 'Responder' || userProfile.isSignedIn ? '--signedin' : ''

  return (
    <Draggable
      draggableId={`draggable-escalation-contact-${levelId}:${id}`}
      type='PERSON'
      index={index}
      className='container-fluid'
      isDragDisabled={!editEnabled}
    >
      {(provided, snapshot) => (
        <div className={`card card-block contact${isSignedIn}`}>
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <div className={flexClasses.row}>
              <div>
                <UserAvatar name={name} img={avatar} size='md' />
              </div>
              <div>
                <div>
                  <div className={classes.infoContainer}>
                    <div
                      className={clsx('am-subtitle1', classes.escalationName)}
                    >
                      {name}
                    </div>
                    <div className={clsx('am-caption', classes.escalationRole)}>
                      {role}
                    </div>
                  </div>
                  <div className={classes.contactContainer}>
                    <EscalationContactMethodIndicator
                      contactId={id}
                      levelId={levelId}
                      methods={data.methods}
                      editEnabled={editEnabled}
                      handleEditEscalationContact={handleUpdate}
                      updateComplete={updateComplete}
                      updateStart={updateStart}
                      _createNotification={_createNotification}
                    />
                  </div>
                </div>
              </div>
              <div>
                {editEnabled && (
                  <div onClick={handleDelete} className={cursorClasses.pointer}>
                    <Close
                      width={20}
                      height={20}
                      stroke={theme.palette.grey[500]}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          {provided.placeholder}
        </div>
      )}
    </Draggable>
  )
}

EscalationContact.defaultProps = {
  data: {},
  id: null,
  levelId: null,
  handleEditEscalationContact: () => {},
  _createNotification: () => {},
  handleRemoveEscalationContact: () => {},
  index: null,
  editEnabled: false,
}

EscalationContact.propTypes = {
  data: PropTypes.object,
  id: PropTypes.number,
  levelId: PropTypes.number,
  handleEditEscalationContact: PropTypes.func,
  _createNotification: PropTypes.func,
  handleRemoveEscalationContact: PropTypes.func,
  index: PropTypes.number,
  policyIndex: PropTypes.string,
  levelIndex: PropTypes.string,
  accountSlug: PropTypes.string,
  siteSlug: PropTypes.string,
  editEnabled: PropTypes.bool,
}

export default EscalationContact
