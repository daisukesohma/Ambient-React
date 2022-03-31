import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import { useSelector } from 'react-redux'
import clsx from 'clsx'
import get from 'lodash/get'
import filter from 'lodash/filter'
import Box from '@material-ui/core/Box'
import ActivePulse from 'components/ActivePulse'
import Tooltip from 'components/Tooltip'
import TooltipText from 'components/Tooltip/TooltipText'
import { Icon } from 'ambient_ui'
import { useFlexStyles } from 'common/styles/commonStyles'

function ToolbarStatus() {
  const { palette } = useTheme()
  const flexClasses = useFlexStyles()
  const threats = useSelector(state => state.contextGraph.alerts)

  if (threats.length === 0) {
    return <></>
  }

  const partiallyDeployedThreats = filter(
    threats,
    t => get(t, 'incompatibleStreams.length') > 0,
  )

  const activeCount = filter(threats, { status: 'active' }).length
  const inactiveCount = threats.length - activeCount

  return (
    <span
      className='am-overline'
      id='context-graph-status'
    >
      <div className={flexClasses.row}>
        <div>
          <Tooltip
            placement='left'
            content={
              <TooltipText>
                {`${threats.length -
                  partiallyDeployedThreats.length} Fully Deployed Threat Signatures`}
              </TooltipText>
            }
          >
            <span className={clsx(flexClasses.row, flexClasses.centerAll)}>
              <Icon
                icon='deployment'
                color={palette.common.greenPastel}
                fill={palette.common.greenPastel}
                size={12}
                viewBox='0 0 128 128'
              />
              <span style={{ marginLeft: 4 }}>{threats.length}</span>
            </span>
          </Tooltip>
        </div>
        <Box ml={1}>
          <Tooltip
            placement='left'
            content={
              <TooltipText>
                {`${partiallyDeployedThreats.length} Partially Deployed Threat Signatures`}
              </TooltipText>
            }
          >
            <span className={clsx(flexClasses.row, flexClasses.centerAll)}>
              <Icon
                icon='deployment'
                color={palette.warning.main}
                fill={palette.warning.main}
                size={12}
                viewBox='0 0 128 128'
              />
              <span style={{ marginLeft: 4 }}>
                {partiallyDeployedThreats.length}
              </span>
            </span>
          </Tooltip>
        </Box>
      </div>
      <div className={flexClasses.row}>
        <div>
          <Tooltip
            placement='left'
            content={
              <TooltipText>
                {`${activeCount}  Active Deployed Threat Signatures`}
              </TooltipText>
            }
          >
            <span className={clsx(flexClasses.row, flexClasses.centerAll)}>
              <ActivePulse isActive />
              <span style={{ marginLeft: 4 }}>{activeCount}</span>
            </span>
          </Tooltip>
        </div>
        <Box ml={2}>
          <Tooltip
            placement='left'
            content={
              <TooltipText>
                {`${inactiveCount}  Inactive Deployed Threat Signatures`}
              </TooltipText>
            }
          >
            <span className={clsx(flexClasses.row, flexClasses.centerAll)}>
              <ActivePulse isActive={false} />
              <span style={{ marginLeft: 4 }}>{inactiveCount}</span>
            </span>
          </Tooltip>
        </Box>
      </div>
    </span>
  )
}

export default ToolbarStatus
