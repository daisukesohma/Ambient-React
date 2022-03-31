import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import moment from 'moment'

import EvidenceGif from '../../AlertFeedPanel/AlertFeedContainer/AlertInstanceCard/EvidenceGif'

import useStyles from './styles'
import msToUnix from '../../../../../utils/msToUnix'

const propTypes = {
  alertInstance: PropTypes.object.isRequired,
}

function AlertInstanceView({ alertInstance }) {
  const { alert, id, tsIdentifier } = alertInstance
  const classes = useStyles()

  const momentTime = moment.unix(msToUnix(tsIdentifier))

  return (
    <div>
      <div style={{ flex: 1 }}>
        <EvidenceGif alertInstance={alertInstance} />
      </div>
      <div style={{ flex: 1, boxSizing: 'border-box' }}>
        <div className={classes.descriptionContainer}>
          <div>
            <Typography className='am-subtitle1'>{alert.name}</Typography>
            <Typography className='am-subtitle1'>
              <span className='am-caption'>Created on </span>
              <span>{momentTime.format('ddd MM/DD/YY HH:MM:ssA')}</span>
            </Typography>
          </div>
          <div>
            <Typography className='am-overline'>{`ID: ${id}`}</Typography>
          </div>
        </div>
      </div>
    </div>
  )
}

AlertInstanceView.propTypes = propTypes

export default AlertInstanceView
