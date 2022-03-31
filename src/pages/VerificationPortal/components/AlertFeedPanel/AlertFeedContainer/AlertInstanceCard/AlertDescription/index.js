import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import { useSelector } from 'react-redux'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'
import clsx from 'clsx'
// src
import { AlertLevelLabel } from 'ambient_ui'
import { convertIsHardToAlertLevel } from 'utils'
import OverflowTip from 'components/OverflowTip'

import CardInfo from '../CardInfo'

import useStyles from './styles'
import CopyLink from '../../../../../../../components/CopyLink'

const propTypes = {
  alertInstance: PropTypes.object,
  AlertIcon: PropTypes.func,
  createDate: PropTypes.string,
  isMini: PropTypes.bool,
  readableTime: PropTypes.string,
  unixTs: PropTypes.number,
}

const defaultProps = {
  alertInstance: {},
  isMini: false,
  readableTime: '',
}

function AlertDescription({
  alertInstance,
  AlertIcon,
  createDate,
  isMini,
  readableTime,
  unixTs,
}) {
  const darkMode = useSelector(state => state.settings.darkMode)
  const {
    id,
    status,
    stream,
    alert,
    evaluatorState,
    verifyLoading,
  } = alertInstance
  const classes = useStyles({
    alertLevel: alert.level,
    darkMode,
    isMini,
  })

  const details = useMemo(() => {
    if (isEmpty(evaluatorState)) return null
    const evaluatorStateJson = JSON.parse(evaluatorState)
    return get(evaluatorStateJson, 'soc_message')
  }, [evaluatorState])

  if (verifyLoading) return <div className={classes.root}>Processing...</div>

  return (
    <div className={classes.root}>
      <Grid container justify='space-between' className={classes.rowSpace}>
        <Grid item xs={10}>
          <OverflowTip text={get(alert, 'name')} className='am-h6' />
        </Grid>

        <Grid item xs={2} container justify='flex-end' alignItems='center'>
          <CardInfo
            createDate={createDate}
            id={id}
            isMini={isMini}
            longReadableTime={readableTime}
            status={status}
            unixTs={unixTs}
            AlertIcon={AlertIcon}
          />
        </Grid>
      </Grid>

      <Grid
        container
        justify='flex-start'
        alignContent='center'
        alignItems='center'
      >
        <span className={isMini ? 'am-caption' : 'am-subtitle1'}>
          {`ID: ${alertInstance.id}`}
        </span>
        <span className={classes.copyLinkSpaces}>
          <CopyLink
            text={alertInstance.id}
            tooltipText={'Copy Alert Instance ID'}
            confirmText={'Alert Instance ID copied to clipboard'}
          />
        </span>
      </Grid>

      <Grid
        container
        justify='flex-start'
        alignContent='center'
        alignItems='center'
        className={classes.rowSpace}
      >
        <AlertLevelLabel
          level={convertIsHardToAlertLevel(alert.isHard)}
          darkMode={darkMode}
          classOverride={classes.miniLabel}
        />
        {!isEmpty(details) && (
          <OverflowTip
            text={`Details: ${details}`}
            className={clsx(
              classes.evaluatorDetails,
              isMini ? 'am-caption' : 'am-subtitle1',
            )}
          />
        )}
      </Grid>

      <Grid
        container
        justify='space-between'
        alignContent='center'
        alignItems='center'
        className={classes.descriptionBottomRowContainer}
      >
        <Grid container justify='flex-start' item xs={4}>
          <OverflowTip
            text={get(alert, 'site.name')}
            className={isMini ? 'am-caption' : 'am-subtitle1'}
          />
        </Grid>
        <Grid item container justify='center' xs={4}>
          <OverflowTip
            text={get(stream, 'name')}
            className={isMini ? 'am-caption' : 'am-subtitle1'}
          />
        </Grid>
        <Grid item container justify='flex-end' xs={4}>
          <OverflowTip
            text={readableTime}
            className={isMini ? 'am-caption' : 'am-subtitle1'}
          />
        </Grid>
      </Grid>
    </div>
  )
}

AlertDescription.propTypes = propTypes
AlertDescription.defaultProps = defaultProps

export default AlertDescription
