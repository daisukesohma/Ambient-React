import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import AutorenewIcon from '@material-ui/icons/Autorenew'
import LinkIcon from '@material-ui/icons/Link'
import Typography from '@material-ui/core/Typography'
import { Tooltip, CircularProgress } from 'ambient_ui'

import IdentitySourceStatus from '../../IdentitySources/components/IdentitySourceStatus'

import useStyles from './styles'

const Tools = ({ identitySourcesMetaInfo, syncing, onSync }) => {
  const { palette } = useTheme()
  const classes = useStyles()

  const { hasIdentitySources, info, sourceStatusData } = identitySourcesMetaInfo

  return (
    <div className={classes.root}>
      {hasIdentitySources && (
        <>
          <div className={classes.infoContainer}>
            <LinkIcon fontSize='small' />
            <Typography className={classes.infoTxt}>{info}</Typography>
          </div>
          <Tooltip
            title='Sync now'
            placement='bottom'
            customStyle={{
              border: 'none',
              color: palette.common.white,
              backgroundColor: palette.common.black,
              borderRadius: 4,
              boxShadow: '0px 1px 4px rgba(34, 36, 40, 0.05)',
            }}
          >
            {syncing ? (
              <div className={classes.syncBtn}>
                <CircularProgress className={classes.refreshIcon} />
              </div>
            ) : (
              <div className={classes.syncBtn} onClick={onSync}>
                <AutorenewIcon className={classes.refreshIcon} />
              </div>
            )}
          </Tooltip>
          <Typography className={classes.controllerTxt}>Status</Typography>
          <div className={classes.statusContainer}>
            <IdentitySourceStatus data={sourceStatusData} />
          </div>
        </>
      )}
    </div>
  )
}

Tools.defaultProps = {
  identitySourcesMetaInfo: {},
  syncing: false,
  onSync: () => {},
}

Tools.propTypes = {
  identitySourcesMetaInfo: PropTypes.object,
  syncing: PropTypes.bool,
  onSync: PropTypes.func,
}

export default Tools
