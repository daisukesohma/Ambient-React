import React from 'react'
import PropTypes from 'prop-types'
import { Grid, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(({ palette }) => ({
  statusContainer: {
    backgroundColor: ({ inProgress }) =>
      inProgress
        ? palette.secondary.light
        : palette.common.errorLightPink || '#FFEFF3',
    padding: '32px !important',
    marginBottom: 16,
  },
  statusTitle: {
    color: ({ inProgress }) =>
      inProgress ? palette.common.white : palette.error.main,
    fontSize: 16,
    letterSpacing: '0.02em',
  },
  statusDescription: {
    color: palette.common.black,
    fontSize: 16,
    wordWrap: 'break-word',
  },
}))

const SyncAlert = ({ lastSyncDateTime, isAzure, details, inProgress }) => {
  const classes = useStyles({ inProgress })
  return (
    <Grid
      container
      item
      lg={12}
      md={12}
      sm={12}
      xs={12}
      className={classes.statusContainer}
    >
      {inProgress ? (
        <Typography className={classes.statusTitle}>
          Sync is in progress.
        </Typography>
      ) : (
        <>
          {lastSyncDateTime && (
            <Typography className={classes.statusTitle}>
              Attempted sync at {lastSyncDateTime} failed.
            </Typography>
          )}
          <Typography className={classes.statusDescription}>
            {isAzure
              ? 'Please check to make sure your client id, tenant id, and client secret is valid and up to date.'
              : details}
          </Typography>
        </>
      )}
    </Grid>
  )
}

SyncAlert.propTypes = {
  details: PropTypes.string,
  isAzure: PropTypes.bool,
  inProgress: PropTypes.bool,
  lastSyncDateTime: PropTypes.object,
}

SyncAlert.defaultProps = {
  details: '',
  isAzure: false,
  lastSyncDateTime: '',
  inProgress: false,
}

export default SyncAlert
