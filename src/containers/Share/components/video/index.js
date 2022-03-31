import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useHistory } from 'react-router-dom'
import { ModalTypeEnum } from 'enums'
import { useQuery } from '@apollo/react-hooks'
import get from 'lodash/get'
import clsx from 'clsx'
// src
import CopyLink from 'components/CopyLink'
import shareLinkParams from 'selectors/shareLink/params'
import { showModal } from 'redux/slices/modal'

import { FIND_STREAM_BY_ID, GET_ALERT_EVENT } from 'containers/Share/gql'

import useStyles from './styles'

const ON_CLOSE_REDIRECT_ROUTE = '/'

// https://reactrouter.com/web/example/query-parameters
function useQueryString() {
  return new URLSearchParams(useLocation().search)
}

function ShareVideo() {
  const classes = useStyles()
  const urlAllParams = useSelector(shareLinkParams)
  const query = useQueryString()
  const dispatch = useDispatch()
  const history = useHistory()

  const isModalOpen = useSelector(state => state.modal.open)
  // Get Query String Params
  const streamId = Number(query.get('sId')) // MAKE THeSE PARAMS a SHARED CONSTANT FILE
  const initTs = Number(query.get('initTs'))
  const objectType = query.get('objectType')
  const objectId = query.get('objectId')

  // Open Alert Modal
  const alertEventOptions = {
    variables: {
      alertEventId: objectId,
    },
  }

  const {
    loading: loadingAlertEvent,
    error: errorAlertEvent,
    data: dataAlertEvent,
  } = useQuery(GET_ALERT_EVENT, alertEventOptions)

  // Open Video Modal
  // query db for values necessary for modal
  //
  const findStreamByIdOptions = {
    variables: {
      id: streamId,
    },
  }
  const { data, loading, error } = useQuery(
    FIND_STREAM_BY_ID,
    findStreamByIdOptions,
  )
  const hasObject = objectType && objectId
  const shouldOpenAlertModal =
    !isModalOpen &&
    streamId &&
    hasObject &&
    get(dataAlertEvent, 'getAlertEvent')
  const shouldOpenVideoModal =
    !isModalOpen && streamId && !hasObject && get(data, 'findStreamById')

  if (shouldOpenAlertModal) {
    const modalData = {
      content: {
        accountSlug: get(
          dataAlertEvent,
          'getAlertEvent.stream.site.account.slug',
        ),
        alertEvent: dataAlertEvent.getAlertEvent,
        closeButtonOverride: () => history.push(ON_CLOSE_REDIRECT_ROUTE), // will add this function to what happens on close button
      },
      type: ModalTypeEnum.ALERT,
    }
    dispatch(showModal(modalData))
  }

  if (shouldOpenVideoModal) {
    // optional
    let optionalParams = {}
    if (initTs) {
      optionalParams = {
        initTs,
      }
    }

    // dispatch the action to open the video modal
    const modalData = {
      content: {
        accountSlug: get(data, 'findStreamById.node.site.account.slug'),
        streamName: get(data, 'findStreamById.name'),
        streamId,
        nodeId: get(data, 'findStreamById.node.identifier'),
        siteName: get(data, 'findStreamById.node.site.name'),
        siteSlug: get(data, 'findStreamById.node.site.slug'),
        timezone: get(data, 'findStreamById.node.site.timezone'),
        ...optionalParams,
        closeButtonOverride: () => history.push(ON_CLOSE_REDIRECT_ROUTE),
      },
      type: ModalTypeEnum.VIDEO,
    }

    dispatch(showModal(modalData))
  }

  return (
    <div className={'am-h5'} style={{ color: 'white' }}>
      Share
      <div className={clsx('am-caption', classes.caption)}>{urlAllParams}</div>
      <CopyLink
        text={urlAllParams}
        confirmText='Your shareable link has been copied to the clipboard!'
        tooltipText='Copy shareable link'
      />
    </div>
  )
}

export default ShareVideo
