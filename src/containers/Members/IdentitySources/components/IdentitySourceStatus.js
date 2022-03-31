import React, { useEffect, useState } from 'react'
import { useTheme, makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { Paper } from '@material-ui/core'
import Box from '@material-ui/core/Box'
// TODO: Replace with standard icon
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline'
import SyncIcon from '@material-ui/icons/Sync'
import { Tooltip, Icons } from 'ambient_ui'
import moment from 'moment'

import SyncAlert from './SyncAlert'

const { Info } = Icons

const keepingTime = 30 * 60 * 1000

const useStyles = makeStyles(({ palette }) => ({
  fail: {
    backgroundColor: palette.error.light || '#FFEFF3',
    color: palette.error.main,
    maxWidth: 200,
  },
  success: {
    backgroundColor: palette.primary[50],
    color: palette.primary.main,
    maxWidth: 200,
  },
  inProgress: {
    borderColor: palette.secondary.light,
    color: palette.secondary.light,
    maxWidth: 200,
  },
}))

const IdentitySourceStatus = ({ data }) => {
  const { palette } = useTheme()
  const classes = useStyles()
  const [status, setStatus] = useState(data.status)
  const { type, lastSyncRequest } = data

  const lastSyncDateTime = lastSyncRequest
    ? moment.unix(lastSyncRequest.tsCreated).format('MM/DD/YYYY HH:mm:ss')
    : ''
  const lastSyncDetail = lastSyncRequest ? lastSyncRequest.details : ''

  const isAzure = type === 'Azure active directory'

  const success = status === 'COMPLETED'

  let statusName = ''
  let statusIcon
  let rootClassName
  if (success) {
    statusName = 'Up-to-date'
    statusIcon = <CheckCircleOutlineIcon style={{ fontSize: 23 }} />
    rootClassName = classes.success
  } else if (status === 'IN_PROGRESS') {
    statusName = 'In progress'
    statusIcon = <SyncIcon style={{ fontSize: 20 }} />
    rootClassName = classes.inProgress
  } else if (status === 'FAILED') {
    statusName = 'Update Needed'
    statusIcon = <Info width='20' height='20' stroke={palette.error.main} />
    rootClassName = classes.fail
  }

  const renderBox = () => (
    <Box
      display='flex'
      flexDirection='row'
      alignItems='center'
      justifyContent='center'
    >
      <Box p={1}>{statusName}</Box>
      <Box style={{ lineHeight: 0, marginRight: '8px' }}>{statusIcon}</Box>
    </Box>
  )

  const keepingProgress = () => {
    if (status === 'IN_PROGRESS') {
      setStatus('FAILED')
    }
  }

  useEffect(() => {
    setStatus(data.status)
    if (data.status === 'IN_PROGRESS') {
      setTimeout(() => {
        keepingProgress()
      }, keepingTime)
    }
    // eslint-disable-next-line
  }, [data.status])

  return (
    <Paper elevation='0' variant='outlined' classes={{ root: rootClassName }}>
      {status !== 'FAILED' ? (
        renderBox()
      ) : (
        <Tooltip
          title={
            <SyncAlert
              lastSyncDateTime={lastSyncDateTime}
              isAzure={isAzure}
              details={lastSyncDetail}
            />
          }
          placement='top'
          customStyle={{
            border: 'none',
            color: palette.common.white,
            backgroundColor: 'transparent',
            borderRadius: 4,
            padding: 0,
            boxShadow: 'none',
            width: 350,
          }}
        >
          {renderBox()}
        </Tooltip>
      )}
    </Paper>
  )
}

IdentitySourceStatus.propTypes = {
  data: PropTypes.object,
}

IdentitySourceStatus.defaultProps = {
  data: {},
}

export default IdentitySourceStatus
