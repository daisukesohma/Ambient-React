import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { Icon as IconKit } from 'react-icons-kit'
import { email as emailIcon } from 'react-icons-kit/entypo/email'
import { ic_textsms as icTextSms } from 'react-icons-kit/md/ic_textsms'
import { ic_call } from 'react-icons-kit/md/ic_call'

import { IconButton } from '../..'
import { UPDATE_CONTACT_METHODS_IN_PROGRESS } from '../../../data/notifications'

import './index.css'
import useStyles from './styles'

const EscalationContactMethodIndicator = ({
                                            _createNotification,
                                            editEnabled,
                                            escalationContactState,
                                            handleEditEscalationContact,
                                            methods,
                                          }) => {
  const { palette } = useTheme()
  const classes = useStyles()

  const buttonStyle = {
    fontSize: 12,
    borderRadius: 0,
    height: 'unset',
    minWidth: 'unset',
    borderTop: `1px solid ${palette.grey[300]}`,
    borderBottom: `1px solid ${palette.grey[300]}`,
    borderLeft: `1px solid ${palette.grey[300]}`,
    padding: 4,
  }

  const borderLeftStyle = {
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  }

  const borderRightStyle = {
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  }

  let email
  if (escalationContactState.updating_email) {
    email = 'warning'
  } else if (methods && methods.includes('email')) {
    email = 'success'
  } else {
    email = 'default'
  }
  let text
  if (escalationContactState.updating_text) {
    text = 'warning'
  } else if (methods && methods.includes('text')) {
    text = 'success'
  } else {
    text = 'default'
  }
  let call
  if (escalationContactState.updating_call) {
    call = 'warning'
  } else if (methods && methods.includes('call')) {
    call = 'success'
  } else {
    call = 'default'
  }

  const textColorByStatus = {
    'warning': palette.warning.main,
    'success': palette.text.primary,
    'default': palette.text.disabled
  }

  return (
    <div className={classes.buttonGroup}>
      <IconButton
        labelInfo='Email'
        icon={() => <IconKit icon={emailIcon} size={16} color='red' />}
        disabled={!editEnabled}
        onClick={() => {
          if (email !== 'updating') {
            handleEditEscalationContact('email')
          } else {
            _createNotification(UPDATE_CONTACT_METHODS_IN_PROGRESS)
          }
        }}
        buttonStyle='iconbutton--indicator'
        type={email}
        size='xs'
        customStyle={{ ...buttonStyle, ...borderLeftStyle, color: textColorByStatus[email] }}
      />
      <IconButton
        labelInfo='Text'
        icon={() => <IconKit icon={icTextSms} size={16} />}
        disabled={!editEnabled}
        onClick={() => {
          if (text !== 'updating') {
            handleEditEscalationContact('text')
          } else {
            _createNotification(UPDATE_CONTACT_METHODS_IN_PROGRESS)
          }
        }}
        buttonStyle='iconbutton--indicator'
        type={text}
        size='xs'
        customStyle={{ ...buttonStyle, color: textColorByStatus[text] }}
      />
      <IconButton
        labelInfo='Call'
        icon={() => (
          <IconKit
            icon={ic_call}
            size={16}
          />
        )}
        disabled={!editEnabled}
        onClick={() => {
          if (text !== 'updating') {
            handleEditEscalationContact('call')
          } else {
            _createNotification(UPDATE_CONTACT_METHODS_IN_PROGRESS)
          }
        }}
        buttonStyle='iconbutton--indicator'
        type={call}
        size='xs'
        customStyle={{ ...buttonStyle, ...borderRightStyle, borderRight: `1px solid ${palette.grey[300]}`, color: textColorByStatus[call] }}
      />
    </div>
  )
}

EscalationContactMethodIndicator.defaultProps = {
  _createNotification: () => {},
  editEnabled: false,
  escalationContactState: {},
  handleEditEscalationContact: () => {},
  methods: {},
}

EscalationContactMethodIndicator.propTypes = {
  _createNotification: PropTypes.func,
  editEnabled: PropTypes.bool,
  escalationContactState: PropTypes.object,
  handleEditEscalationContact: PropTypes.func,
  methods: PropTypes.object,
}

export default EscalationContactMethodIndicator
