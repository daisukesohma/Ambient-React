import React, { useCallback, useMemo, useState } from 'react'
import { useTheme } from '@material-ui/core/styles'
import { useSelector, useDispatch } from 'react-redux'
import Box from '@material-ui/core/Box'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
// src
import Tooltip from 'components/Tooltip'
import TooltipText from 'components/Tooltip/TooltipText'
import { Icon } from 'ambient_ui'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { some, findIndex, includes, isEmpty, without, filter, concat, find, map, get } from 'lodash'

import arrayToSeparatedString from 'utils/text/arrayToSeparatedString'
import { Can } from 'rbac'
import { updateAlertStreamsRequest } from 'redux/contextGraph/actions'
import { detailedAlertRegions } from 'selectors/contextGraph'
import { useFlexStyles, useCursorStyles } from 'common/styles/commonStyles'

import useStyles from './styles'

const CamerasCard = ({ region }) => {
  const { palette } = useTheme()
  const classes = useStyles()
  const flexClasses = useFlexStyles()
  const cursorClasses = useCursorStyles()
  const dispatch = useDispatch()
  const currentAlert = useSelector(state => state.contextGraph.detailed)
  const detailedRegions = useSelector(detailedAlertRegions)
  const [isStreamsVisible, setIsStreamsVisible] = useState(false)

  const activeSecurityProfile = useSelector(
    state => state.contextGraph.activeProfile,
  )
  const detailedAlert = useSelector(state => state.contextGraph.detailed)
  const streamsBySite = useSelector(state => state.contextGraph.streams)

  const allStreamsInRegion = useMemo(() => {
    return filter(
      streamsBySite,
      stream => get(stream, 'region.id') === region.id,
    )
  }, [streamsBySite, region.id])

  const activeStreamsInRegion = useCallback(
    regionItem => {
      return map(
        filter(
          detailedAlert.streams,
          stream => stream.region.id === regionItem.id,
        ),
        'id',
      )
    },
    [detailedAlert],
  )

  const isStreamEnabled = stream => some(detailedAlert.streams, { id: stream.id })

  const toggleStreamInRegion = useCallback(
    (regionItem, stream) => {
      let resultStreamIds
      const streams = activeStreamsInRegion(regionItem)
      if (includes(streams, stream.id)) {
        resultStreamIds = without(streams, stream.id)
      } else {
        resultStreamIds = concat(streams, stream.id)
      }
      const regionIndex = findIndex(detailedRegions, {
        regionId: regionItem.id,
      })
      detailedRegions[regionIndex].streamIds = resultStreamIds
      return detailedRegions
    },
    [detailedRegions, activeStreamsInRegion],
  )

  const countCamerasEnabled = filter(
    map(allStreamsInRegion, stream => isStreamEnabled(stream))
  ).length

  return (
    <Box className={classes.regionCardWrapper} id='region-card-container'>
      <List
        disablePadding
        aria-labelledby='nested-list-subheader'
        classes={{
          root: classes.regionList,
        }}
      >
        <ListItem classes={{ root: classes.regionListItem }}>
          <ListItemText
            classes={{
              primary: clsx(
                'am-subtitle2',
                flexClasses.row,
                flexClasses.centerBetween,
              ),
            }}
          >
            <div className={clsx(flexClasses.row, flexClasses.centerStart)}>
              <Icon icon='compass' color={palette.primary[300]} size={18} />
              <span
                className='am-subtitle2'
                style={{ marginLeft: 8 }}
              >
                {region.name}
              </span>
            </div>
            <div>
              <span className='am-overline'>
                {allStreamsInRegion.length} Cameras
              </span>
            </div>
          </ListItemText>
        </ListItem>
        {!isEmpty(allStreamsInRegion) && (
          <div
            className={clsx(flexClasses.row, flexClasses.centerBetween)}
            style={{ marginLeft: 24, marginBottom: isStreamsVisible ? 16 : 8 }}
          >
            <div className='am-overline'>
              {`${countCamerasEnabled} of ${allStreamsInRegion.length} Cameras Enabled`}
            </div>
            <div
              className={clsx(
                'am-overline',
                cursorClasses.pointer,
                cursorClasses.clickableText,
              )}
              style={{ color: palette.primary.main }}
              onClick={() => setIsStreamsVisible(!isStreamsVisible)}
            >
              {isStreamsVisible ? 'Hide' : 'View'}
            </div>
          </div>
        )}
        {isStreamsVisible && (
          <>
            <div className={classes.streamsWrapper} id='ts-streams-list'>
              {map(allStreamsInRegion, stream => {
                const incompatibleStream = find(
                  detailedAlert.incompatibleStreams,
                  s => s.stream.id === stream.id,
                )

                return (
                  <Can
                    I='update'
                    on='ContextGraph'
                    key={`${stream.id}`}
                    passThrough
                  >
                    {can => (
                      <div
                        className={clsx('am-subtitle2', classes.streamChip, {
                          [classes.streamChipDisabled]: !isStreamEnabled(
                            stream,
                          ),
                          [classes.streamChipUnauth]: !can,
                        })}
                        style={{ position: 'relative' }}
                        onClick={() => {
                          if (can) {
                            dispatch(
                              updateAlertStreamsRequest({
                                alertId: detailedAlert.id,
                                securityProfileId: activeSecurityProfile.id,
                                regions: toggleStreamInRegion(region, stream),
                              }),
                            )
                          }
                        }}
                      >
                        {stream.name}
                        {isStreamEnabled(stream) && incompatibleStream && (
                          <div
                            style={{
                              position: 'absolute',
                              top: -8,
                              right: 0,
                              // background: palette.grey[900],
                              borderRadius: '50%',
                              width: 16,
                              height: 16,
                              border: `1px solid ${palette.text.primary}`,
                            }}
                          >
                            <Tooltip
                              content={
                                <TooltipText>
                                  {`"${currentAlert.name}" is incompatible with this camera due to these unmet requirements: `}
                                  {arrayToSeparatedString(
                                    incompatibleStream.unmetRequirements,
                                  )}
                                  .
                                </TooltipText>
                              }
                            >
                              <span style={{ marginLeft: 3 }}>
                                <Icon
                                  icon='deployment'
                                  color={palette.warning.main}
                                  fill={palette.warning.main}
                                  size={12}
                                  viewBox='0 0 128 128'
                                />
                              </span>
                            </Tooltip>
                          </div>
                        )}
                      </div>
                    )}
                  </Can>
                )
              })}
            </div>
          </>
        )}
      </List>
    </Box>
  )
}

CamerasCard.propTypes = {
  region: PropTypes.object,
}

CamerasCard.defaultProps = {
  region: {
    name: '',
  },
}

export default CamerasCard
