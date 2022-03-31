import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { useDispatch } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import Box from '@material-ui/core/Box'
import { CircularProgress } from 'ambient_ui'
import Typography from '@material-ui/core/Typography'
import BlockIcon from '@material-ui/icons/Block'
// src
import parseLatLng from 'utils/parseLatLng'
import { GET_ALERT_EVENT_SHARE_BY_TOKEN } from 'components/NewsFeed/saga/gql'

import AlertCommon from './components/AlertCommon'
import DispatchInfo from './components/DispatchInfo'

const useStyles = makeStyles(theme => ({
  expired: {
    backgroundColor: '#FD235C',
    height: '100%',
  },
  expiredIcon: {
    color: '#fbfbfb',
    width: '100%',
    height: '100%',
  },
  expiredText: {
    color: 'white',
  },
  container: {
    textAlign: 'center',
  },
}))

const Share = ({ match }) => {
  const classes = useStyles()
  const dispatch = useDispatch()

  const [expired, setExpired] = useState(true)
  const [share, setShare] = useState(null)
  const { token } = match.params

  const { loading, data: alertEventShareData } = useQuery(
    GET_ALERT_EVENT_SHARE_BY_TOKEN,
    {
      variables: {
        token,
      },
    },
  )

  useEffect(() => {
    if (alertEventShareData) {
      setExpired(alertEventShareData.alertEventShareByToken.expired)
      setShare(alertEventShareData.alertEventShareByToken.share)
    }
  }, [alertEventShareData, dispatch])

  if (loading) {
    return (
      <Box display='flex' flexDirection='column' justifyContent='center'>
        <CircularProgress />
      </Box>
    )
  }

  if (expired) {
    return (
      <Box
        display='flex'
        flexDirection='column'
        justifyContent='center'
        alignItems='center'
        className={classes.expired}
      >
        <Box className={classes.container}>
          <Box>
            <BlockIcon className={classes.expiredIcon} />
          </Box>
          <Box>
            <Typography className={classes.expiredText}>
              You no longer have access to this page
            </Typography>
          </Box>
        </Box>
      </Box>
    )
  }

  const actions = (
    <Typography>
      You have been requested to assist with this incident at{' '}
      {share.alertEvent.alert.site.name}
    </Typography>
  )

  const { lat, lng } = parseLatLng(share.alertEvent.alert.site.latlng)

  return (
    <div>
      <AlertCommon actions={actions} alertEventOrInstance={share.alertEvent} />
      <DispatchInfo lat={lat} lng={lng} />
    </div>
  )
}

Share.defaultProps = {
  match: {},
}

Share.propTypes = {
  match: PropTypes.object,
}

export default withRouter(Share)
