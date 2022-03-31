import React, { memo } from 'react'
import { useMutation } from '@apollo/react-hooks'
import Moment from 'react-moment'
import { useDispatch } from 'react-redux'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import { CircularProgress } from 'ambient_ui'
import PropTypes from 'prop-types'
import clsx from 'clsx'
// src
import { createNotification } from 'redux/slices/notifications'
import { EXPIRE_ALERT_EVENT_SHARE } from 'components/NewsFeed/saga/gql'
import ModalChip from 'components/AlertCommon/ModalChip'
import CopyLink from 'components/CopyLink'
import { useFlexStyles } from 'common/styles/commonStyles'

import useStyles from './styles'
import { msToUnix } from 'utils'

const ExternalProfileList = ({ shares }) => {
  const dispatch = useDispatch()
  const classes = useStyles()
  const flexClasses = useFlexStyles()
  const [expireAlertEventShareRequest] = useMutation(EXPIRE_ALERT_EVENT_SHARE, {
    onCompleted({ expireAlertEventShare }) {
      dispatch(
        createNotification({
          message: expireAlertEventShare.message,
        }),
      )
    },
  })

  const isShareExpired = tsExpiry => {
    return tsExpiry < msToUnix(Date.now())
  }

  if (!shares) {
    return <CircularProgress />
  }

  if (shares.length === 0) {
    return (
      <div className={clsx('am-caption', classes.caption)}>
        Alert has not been shared with anyone.
      </div>
    )
  }

  return (
    <List className={classes.ExternalProfileList}>
      {shares.map((share, index) => {
        const expired = isShareExpired(share.tsExpiry)
        return (
          <ListItem style={{ width: 'auto' }} key={`list-item-${index}`}>
            <ModalChip
              primaryLabel={share.name}
              secondaryLabel={
                <div
                  className={clsx(flexClasses.row, flexClasses.centerBetween)}
                >
                  {expired ? 'Expired ' : 'Expires '}{' '}
                  <Moment className={classes.time} fromNow unix>
                    {share.tsExpiry}
                  </Moment>{' '}
                  {!expired && share.shareLink && (
                    <CopyLink text={share.shareLink} tooltipText='Copy link' />
                  )}
                </div>
              }
              key={share.token}
              status={expired ? 'denied' : 'available'}
              disabled={expired}
              onDelete={() => {
                dispatch(
                  createNotification({
                    message:
                      'Revoking access for the shared event. This will take a moment.',
                  }),
                )
                expireAlertEventShareRequest({
                  variables: { id: share.id },
                })
              }}
            />
          </ListItem>
        )
      })}
    </List>
  )
}

ExternalProfileList.defaultProps = {
  shares: [
    {
      name: 'Paul Mc',
      tsExpiry: msToUnix(Date.now()) + 1800,
      token: '123456',
    },
    {
      name: 'John Ln',
      tsExpiry: msToUnix(Date.now()) - 3600,
      token: 'a12346',
    },
  ],
}

ExternalProfileList.propTypes = {
  shares: PropTypes.array,
}

export default memo(ExternalProfileList)
