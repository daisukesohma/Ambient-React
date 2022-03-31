import React from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Tooltip from '@material-ui/core/Tooltip'
import { useSelector, useDispatch } from 'react-redux'
import clsx from 'clsx'

import {
  setAnnotationModalOpen,
  setCurrentDataPoint,
  getEventAnnotationFetchRequested,
} from '../../../../../../redux/dataInfraSlice'

import useStyles from './styles'

const propTypes = {
  dataPoint: PropTypes.object,
  isMini: PropTypes.bool,
  readableTime: PropTypes.string,
  videoArchive: PropTypes.object,
  metadataArchive: PropTypes.object,
}

const defaultProps = {
  dataPoint: {},
  isMini: false,
  readableTime: '',
  videoArchive: {},
  metadataArchive: {},
}

function DataPointDescription({
  dataPoint,
  isMini,
  readableTime,
  videoArchive,
  metadataArchive,
}) {
  const { palette } = useTheme()
  const dispatch = useDispatch()
  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({
    darkMode,
    isMini,
  })

  const statusToColor = {
    SUCCEEDED: palette.common.greenPastelLight,
    FAILED: palette.error.light,
    REQUESTED: palette.warning.light,
  }

  const updateIsAnnotationModalOpen = () => {
    dispatch(setCurrentDataPoint({ currentDataPoint: dataPoint }))
    dispatch(
      getEventAnnotationFetchRequested({
        eventAnnotationId: dataPoint.eventAnnotation.id,
      }),
    )
    dispatch(setAnnotationModalOpen({ isAnnotationModalOpen: true }))
  }

  return (
    <div className={classes.root}>
      <div className={clsx(classes.descriptionRowContainer)}>
        <Typography className={isMini ? 'am-caption' : 'am-subtitle1'}>
          <span style={{ color: palette.grey[700] }}>{readableTime}</span>
        </Typography>
      </div>
      <div className={clsx(classes.descriptionRowContainer)}>
        <Typography className={isMini ? 'am-caption' : 'am-subtitle1'}>
          <span style={{ color: palette.grey[700] }}>{'Video Status: '}</span>
          <Tooltip title={videoArchive.statusReason} placement='left'>
            <span style={{ color: statusToColor[videoArchive.status] }}>
              {videoArchive.status}
            </span>
          </Tooltip>
        </Typography>
        <Button
          variant='outlined'
          color='primary'
          size='small'
          onClick={() => updateIsAnnotationModalOpen()}
        >
          Details
        </Button>
      </div>
      <div className={clsx(classes.descriptionRowContainer)}>
        <Typography className={isMini ? 'am-caption' : 'am-subtitle1'}>
          <span style={{ color: palette.grey[700] }}>
            {'Metadata Status: '}
          </span>
          <Tooltip title={metadataArchive.statusReason} placement='left'>
            <span style={{ color: statusToColor[metadataArchive.status] }}>
              {metadataArchive.status}
            </span>
          </Tooltip>
        </Typography>
      </div>
    </div>
  )
}

DataPointDescription.propTypes = propTypes
DataPointDescription.defaultProps = defaultProps

export default DataPointDescription
