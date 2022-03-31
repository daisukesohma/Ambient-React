import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import Button from '@material-ui/core/Button'
import { useParams } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import Box from '@material-ui/core/Box'
import CheckIcon from '@material-ui/icons/Check'
import NotInterestedIcon from '@material-ui/icons/NotInterested'
import { CircularProgress } from 'ambient_ui'
import Typography from '@material-ui/core/Typography'
import BackupIcon from '@material-ui/icons/Backup'
import Avatar from '@material-ui/core/Avatar'
import AndroidIcon from '@material-ui/icons/Android'
import get from 'lodash/get'
// src
import { DatabaseModelTypeEnum } from 'enums'
import {
  GET_ALERT_INSTANCE_BY_HASH,
  VERIFY_ALERT_INSTANCE_MOBILE,
} from 'pages/VerificationPortal/saga/gql'

import StatusList from './components/StatusList'
import AlertCommon from './components/AlertCommon'

const useStyles = makeStyles(theme => ({
  dismiss: {
    backgroundColor: '#FD235C',
    color: 'white',
  },
}))

export default function Verification() {
  const classes = useStyles()
  const [alertInstance, setAlertInstance] = useState(null)
  const { alertInstanceId, alertInstanceHash, userId } = useParams()

  const { data: getAlertInstanceByHashData } = useQuery(
    GET_ALERT_INSTANCE_BY_HASH,
    {
      variables: {
        alertInstanceId,
        alertInstanceHash,
      },
      pollInterval: 5000,
    },
  )

  const [
    verifyAlertInstanceRequest,
    { loading: verifyAlertInstanceMobileLoading },
  ] = useMutation(VERIFY_ALERT_INSTANCE_MOBILE)

  useEffect(() => {
    if (getAlertInstanceByHashData) {
      setAlertInstance(getAlertInstanceByHashData.alertInstanceByHash)
    }
  }, [getAlertInstanceByHashData])

  const collect = () => {
    alert('This feature is under development.') // eslint-disable-line
  }

  const isFinished = alertInstance && alertInstance.verified
  const isVerified = isFinished && alertInstance.status !== 'dismissed'
  const isDismissed = isFinished && alertInstance.status === 'dismissed'

  const verifyAlert = status => {
    verifyAlertInstanceRequest({
      variables: {
        alertInstanceId,
        alertInstanceHash,
        status,
        userId,
      },
      refetchQueries: [
        {
          query: GET_ALERT_INSTANCE_BY_HASH,
          variables: { alertInstanceId, alertInstanceHash },
        },
      ],
      awaitRefetchQueries: true,
    })
  }

  const actions = (
    <Box
      display='flex'
      flexDirection='column'
      justifyContent='center'
      alignItems='center'
    >
      <Box textAlign='center'>
        {!alertInstance && <CircularProgress />}
        <Typography>
          {!isFinished &&
            'This alert is under verification. Please respond below.'}
          {isVerified && 'This alert has already been verified and raised.'}
          {isDismissed &&
            'This alert has been dismissed but you can override the dismissal.'}
        </Typography>
      </Box>
      <Box>
        <Box
          display='flex'
          flexDirection='row'
          justifyContent='center'
          alignItems='center'
        >
          <Box m={1} p={1}>
            <Button
              variant='contained'
              color='primary'
              onClick={() => verifyAlert('verified')}
              disabled={
                !alertInstance || isVerified || verifyAlertInstanceMobileLoading
              }
            >
              <CheckIcon /> Verify
            </Button>
          </Box>
          <Box m={1}>
            <Button
              variant='contained'
              color='primary'
              className={classes.dismiss}
              onClick={() => verifyAlert('dismissed')}
              disabled={
                !alertInstance || isFinished || verifyAlertInstanceMobileLoading
              }
            >
              <NotInterestedIcon /> Dismiss
            </Button>
          </Box>
          <Box m={1}>
            <Button
              variant='contained'
              color='secondary'
              disabled={!alertInstance}
              onClick={() => collect()}
            >
              <BackupIcon /> Collect
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  )

  return (
    <div>
      <AlertCommon
        actions={actions}
        alertEventOrInstance={alertInstance}
        modelType={DatabaseModelTypeEnum.ALERT_INSTANCE}
      />
      {alertInstance && (
        <StatusList
          statuses={alertInstance.alertStatuses.map(item => {
            const username = item.user ? item.user.firstName : '(Bot)'
            const text =
              username + (item.user && item.user.id === userId ? ' (You)' : '')
            const img = get(item, 'user.profile.img')

            const avatar = item.user ? (
              <Avatar src={img} alt={text}>
                {username}
              </Avatar>
            ) : (
              <Avatar>
                <AndroidIcon />
              </Avatar>
            )

            const label = `${text} ${item.status}`

            return {
              id: item.id,
              ts: item.ts,
              avatar,
              user: {
                name: username,
                img,
              },
              label,
            }
          })}
        />
      )}
    </div>
  )
}