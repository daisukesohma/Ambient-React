import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import clsx from 'clsx'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import PropTypes from 'prop-types'
import getUnixTime from 'date-fns/getUnixTime'
import SimpleLabel from 'components/Label/SimpleLabel'

import Tooltip from '../../../../components/Tooltip'
import TooltipText from '../../../../components/Tooltip/TooltipText'
import { MoreOptionMenu } from '../../../../ambient_ui'
import useInterval from '../../../../common/hooks/useInterval'
import OverflowTip from '../../../../components/OverflowTip'
import { CircularProgress } from '@material-ui/core'

const propTypes = {
  threatSignaturePausePeriod: PropTypes.object,
  handleDeletePause: PropTypes.func,
  cardKey: PropTypes.number,
  classes: PropTypes.object,
  darkMode: PropTypes.bool,
}

const defaultProps = {
  threatSignaturePausePeriod: undefined,
  handleDeletePause: () => {},
  cardKey: null,
  classes: null,
  darkMode: false,
}

function SecurityPostureCard({
  threatSignaturePausePeriod,
  handleDeletePause,
  cardKey,
  classes,
  darkMode,
}) {
  const [remainingTime, setRemainingTime] = useState('')
  const cancellingPausePeriods = useSelector(
    state => state.securityPosturePanel.cancellingPausePeriods,
  )
  const streamNames = get(threatSignaturePausePeriod, 'streams', [])
    .map(stream => {
      return stream.name
    })
    .join(', ')

  const getRemainingTime = (startTime, endTime) => {
    const remaining = endTime - startTime
    const seconds = remaining
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    // Needed due to clock skew with servers
    if (hours > 1 || (hours > 0 && minutes > 0)) {
      return `2 hours remaining`
    }
    if (minutes > 30) {
      return `1 hour remaining`
    }
    if (minutes > 15 && minutes <= 30) {
      return `30 minutes remaining`
    }
    if (minutes > 15) {
      return `15 minutes remaining`
    }
    return `Less than 15 minute remaining`
  }

  useEffect(() => {
    setRemainingTime(
      getRemainingTime(
        getUnixTime(new Date()),
        threatSignaturePausePeriod.endTs,
      ),
    )
  }, [threatSignaturePausePeriod])

  useInterval(() => {
    setRemainingTime(
      getRemainingTime(
        getUnixTime(new Date()),
        threatSignaturePausePeriod.endTs,
      ),
    )
  }, 1000)

  return (
    <Grid
      key={cardKey}
      container
      direction='row'
      justify='space-between'
      alignItems='center'
      className={clsx(classes.item)}
    >
      <Tooltip
        placement='top'
        className={classes.nameBlock}
        content={
          <TooltipText
            text={`Streams: ${isEmpty(streamNames) ? 'None' : streamNames}`}
          />
        }
        innerSpanStyles={{ width: '70%' }}
      >
        <Box onClick={() => {}} className={classes.nameBlock} pl={1.5}>
          <OverflowTip
            text={get(threatSignaturePausePeriod, 'threatSignature.name', '')}
            width={'100%'}
          />
        </Box>
        <Box onClick={() => {}} pl={0.5}>
          <div className={classes.chip}>
            <SimpleLabel inlineTooltip toolTipWidth='fit-content'>
              {get(threatSignaturePausePeriod, 'site.name', '')}
            </SimpleLabel>
          </div>
        </Box>
        <Box onClick={() => {}} className={classes.createdBy} pl={1.5}>
          <OverflowTip
            text={`Created by: ${get(
              threatSignaturePausePeriod,
              'createdBy.user.firstName',
              '',
            )} ${get(
              threatSignaturePausePeriod,
              'createdBy.user.lastName',
              '',
            )}`}
            width={'100%'}
          />
        </Box>
        <Box onClick={() => {}} className={classes.createdBy} pl={1.5}>
          <OverflowTip
            text={`Description: ${get(
              threatSignaturePausePeriod,
              'description',
              '',
            )}`}
            width={'100%'}
          />
        </Box>
        <Box onClick={() => {}} className={classes.remainingTime} pl={1.5}>
          <OverflowTip text={remainingTime} width='100%' />
        </Box>
      </Tooltip>
      <Box pr={1.5}>
        {cancellingPausePeriods.includes(
          parseInt(threatSignaturePausePeriod.id, 10),
        ) ? (
          <CircularProgress size={30} />
        ) : (
          <MoreOptionMenu
            noBackground
            darkMode={darkMode}
            menuItems={[
              {
                label: 'Reenable',
                onClick: () => handleDeletePause(threatSignaturePausePeriod.id),
              },
            ]}
          />
        )}
      </Box>
    </Grid>
  )
}

SecurityPostureCard.propTypes = propTypes

SecurityPostureCard.defaultProps = defaultProps

export default SecurityPostureCard
