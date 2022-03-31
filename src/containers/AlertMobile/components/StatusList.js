import React from 'react'
import PropTypes from 'prop-types'
import { Box, List, ListItem, ListItemText, ListItemAvatar, Typography } from '@material-ui/core'
import Moment from 'react-moment'
import { map } from 'lodash'
// src
import UserAvatar from 'components/UserAvatar'

StatusList.propTypes = {
  statuses: PropTypes.array,
}

export default function StatusList({ statuses }) {
  return (
    <List>
      {map(statuses, status => {
        return (
          <ListItem divider key={`status-${status.id}`}>
            <ListItemAvatar>
              {status.avatar ? status.avatar : <UserAvatar name={status.user.name} img={status.user.img} />}
            </ListItemAvatar>
            <ListItemText
              disableTypography
              primary={<Typography>{status.label}</Typography>}
              secondary={(
                <Box display='flex' flexDirection='column'>
                  <Typography>
                    <Moment unix>{status.ts}</Moment>
                  </Typography>
                  <Typography variant='caption'>
                    <Moment fromNow unix>
                      {status.ts}
                    </Moment>
                  </Typography>
                </Box>
              )}
            />
          </ListItem>
        )
      })}
    </List>
  )
}
