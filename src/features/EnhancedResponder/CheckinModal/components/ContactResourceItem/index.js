import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import PropTypes from 'prop-types'
import get from 'lodash/get'
// src
import Tooltip from 'components/Tooltip'
import TooltipText from 'components/Tooltip/TooltipText'
import UserAvatar from 'components/UserAvatar'

import useStyles from './styles'

const defaultProps = {
  contact: null,
  darkMode: false,
}

const propTypes = {
  contact: PropTypes.object,
  darkMode: PropTypes.bool,
}

const Contact = ({ contact, darkMode }) => {
  const { palette } = useTheme()
  const classes = useStyles({ darkMode })
  const name = `${get(
    contact,
    'lastWorkShiftPeriod.profile.user.firstName',
  )} ${get(contact, 'lastWorkShiftPeriod.profile.user.lastName')}`

  const details =
    get(contact, 'email') === null
      ? get(contact, 'phoneNumber')
      : get(contact, 'email')
  return (
    <ListItem
      style={{
        padding: 0,
        color: darkMode ? palette.common.white : palette.common.black,
      }}
    >
      <ListItemText
        classes={{ root: classes.listItem, secondary: classes.listItem }}
        primary={get(contact, 'name')}
        secondary={details}
      />
      {get(contact, 'used') && (
        <div style={{ float: 'left', paddingLeft: '16px' }}>
          <Tooltip
            placement='top'
            content={
              <div>
                <TooltipText text={`${name} `} />
                <TooltipText
                  text={get(contact, 'lastWorkShiftPeriod.profile.user.email')}
                />
              </div>
            }
          >
            <UserAvatar
              name={name}
              img={get(contact, 'lastWorkShiftPeriod.profile.img')}
            />
          </Tooltip>
        </div>
      )}
    </ListItem>
  )
}

Contact.propTypes = propTypes
Contact.defaultProps = defaultProps

export default Contact
