import React from 'react'
import PropTypes from 'prop-types'
import SimpleLabel from 'components/Label/SimpleLabel'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import get from 'lodash/get'
import clsx from 'clsx'
// src
import UserAvatar from 'components/UserAvatar'
import Tooltip from 'components/Tooltip'
import TooltipText from 'components/Tooltip/TooltipText'

import useStyles from './styles'

const Status = ({ status }) => {
  const classes = useStyles()
  const name = `${get(status, 'profile.user.firstName')} ${get(
    status,
    'profile.user.lastName',
  )}`

  return (
    <div>
      {(!status || status.endWorkShift !== null) && (
        <div className={classes.chip}>
          <SimpleLabel inlineTooltip toolTipWidth='fit-content'>
            Unused
          </SimpleLabel>
        </div>
      )}
      {status && status.endWorkShift === null && (
        <div className={classes.chip}>
          <span
            className={clsx(
              classes.labelType,
              classes.background,
              classes.inlineRoot,
            )}
          >
            <ListItem style={{ padding: 0 }}>
              <ListItemText
                primary='Assigned To:'
                classes={{ primary: classes.primary }}
              />
              <div style={{ paddingLeft: '8px', float: 'left' }}>
                <Tooltip
                  placement='top'
                  content={
                    <div>
                      <TooltipText text={`${name} `} />
                      <TooltipText text={get(status, 'profile.user.email')} />
                    </div>
                  }
                >
                  <UserAvatar name={name} img={get(status, 'profile.img')} />
                </Tooltip>
              </div>
            </ListItem>
          </span>
        </div>
      )}
    </div>
  )
}

Status.defaultProps = {
  status: {},
}

Status.propTypes = {
  status: PropTypes.object,
}

export default Status
