import React, { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import { CircularProgress } from 'ambient_ui'

import { get, isEmpty, sortBy, filter, isNumber } from 'lodash'
import clsx from 'clsx'

// src
import { createNotification } from 'redux/slices/notifications'
import { dispatchInternalRequested } from 'redux/slices/alertModal'
import trackEventToMixpanel from '../../../mixpanel/utils/trackEventToMixpanel'
import { MixPanelEventEnum } from '../../../enums'

import { stringUtility } from 'utils'
import { useFlexStyles } from 'common/styles/commonStyles'

import ModalChip from '../ModalChip'

import CopyLink from 'components/CopyLink'
import useStyles from './styles'

const ResponderList = ({ responders, alertEventId, alertEventHash }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const flexClasses = useFlexStyles()

  const userId = useSelector(state => state.auth.user.id)

  const renderList = useMemo(() => {
    if (isEmpty(responders)) return []
    const list = sortBy(responders, [
      responder => -get(responder, 'profile.user.firstName'),
    ])
    const availableList = filter(list, { status: 'available' })
    const restList = filter(list, ({ status }) => status !== 'available')
    return [...availableList, ...restList]
  }, [responders])

  if (!responders) return <CircularProgress />

  if (responders.length === 0) {
    return (
      <div className={clsx('am-caption', classes.noneText)}>
        No responders associated with this site
      </div>
    )
  }

  const dispatchResponder = (responder) => (event) => {
    if(!isNumber(alertEventId) || !alertEventHash) return false

    dispatch(
      createNotification({
        message: `Dispatching ${get(
          responder,
          'profile.user.firstName',
        )}. This will take a moment.`,
      }),
    )
    const variables = {
      alertEventId,
      alertEventHash,
      profileId: get(responder, 'profile.id'),
      userId,
    }
    dispatch(
      dispatchInternalRequested({
        variables,
        afterDispatch: () => {
          trackEventToMixpanel(MixPanelEventEnum.ALERT_DISPATCH)
        },
      }),
    )
    return true
  }

  return (
    <List className={classes.ResponderList}>
      {renderList.map(responder => {
        let displayLink = false
        if (
          responder.status !== 'available' &&
          responder.status !== 'signed-out'
        ) {
          displayLink = true
        }

        return (
          <ListItem
            button
            className={classes.listItemButton}
            onClick={dispatchResponder(responder)}
            key={`responder-list-${get(responder, 'profile.id')}`}
          >
            <ModalChip
              primaryLabel={`${get(responder, 'profile.user.firstName')}`}
              secondaryLabel={
                <div
                  className={clsx(flexClasses.row, flexClasses.centerBetween)}
                >
                  <span className={classes.status}>
                    {stringUtility.toTitleCase(responder.status)}
                  </span>
                  {responder.dispatchLink && displayLink && (
                    <CopyLink
                      text={responder.dispatchLink}
                      tooltipText='Copy link'
                    />
                  )}
                </div>
              }
              status={responder.status}
              img={get(responder, 'profile.img')}
            />
          </ListItem>
        )
      })}
    </List>
  )
}

ResponderList.defaultProps = {
  responders: [],
  alertEventId: null,
  alertEventHash: '',
}

ResponderList.propTypes = {
  responders: PropTypes.array,
  alertEventId: PropTypes.number,
  alertEventHash: PropTypes.string,
}

export default ResponderList
