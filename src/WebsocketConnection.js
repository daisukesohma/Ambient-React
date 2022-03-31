import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { getAccountSlug } from './utils'
import { wsConnect } from './redux/websocket/actions'
import { wsConnect as signalWsConnect } from './redux/signal/actions'

const WebSocketConnection = ({
  dispatch,
  host,
  accountSlug,
  profileId,
  children,
}) => {
  useEffect(() => {
    if (accountSlug && profileId) {
      dispatch(wsConnect({ host, accountSlug, profileId }))
    }
    // TODO: @rachit, @benjaminshapero
    // Ensure this still works when we use a token when connecting to signal
    dispatch(signalWsConnect({ host }))
  }, [host, dispatch, accountSlug, profileId])

  return <>{children}</>
}

WebSocketConnection.defaultProps = {
  dispatch: () => {},
  host: undefined,
  children: undefined,
  accountSlug: '',
  profileId: null,
}

WebSocketConnection.propTypes = {
  dispatch: PropTypes.func,
  host: PropTypes.string,
  children: PropTypes.object,
  accountSlug: PropTypes.string,
  profileId: PropTypes.number,
}

const mapStateToProps = state => ({
  accountSlug: getAccountSlug(state),
  profileId: state.auth.profile ? state.auth.profile.id : null,
})

export default connect(mapStateToProps, null)(WebSocketConnection)
