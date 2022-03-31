import React, { useMemo } from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import Box from '@material-ui/core/Box'
import { AlertLevelLabel, Icon } from 'ambient_ui'
import clsx from 'clsx'
import get from 'lodash/get'
import map from 'lodash/map'
import isEmpty from 'lodash/isEmpty'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import { useDispatch, useSelector } from 'react-redux'
import ActivePulse from 'components/ActivePulse'
import Tooltip from 'components/Tooltip'
import TooltipText from 'components/Tooltip/TooltipText'

import {
  threatSignatureAlertsSetHovered,
  threatSignatureAlertsSetDetailedView,
} from '../../../../redux/contextGraph/actions'
import { getThreatCanonicalId } from '../../utils/getThreatCanonicalId'
import { SeverityToReadableTextEnum } from '../../../../enums'

import RegionList from './components/RegionList'
import useStyles from './styles'

function ThreatCard({
  tsAlert,
  tsName,
  isActiveThreatSignature,
  isHoverable,
  leftAdornment,
  setEl,
  showIncompatibleStreams,
  disableBottomBorder,
  disableAlertIdStatus,
}) {
  const { palette } = useTheme()
  const dispatch = useDispatch()

  const previewMode = useSelector(state => state.contextGraph.previewMode)
  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({ disableBottomBorder, darkMode })

  const severity =
    SeverityToReadableTextEnum[
      tsAlert.severity || get(tsAlert, 'defaultAlert.severity')
    ]

  const { incompatibleStreams } = tsAlert

  const incompatibleCount = get(incompatibleStreams, 'length', 0)

  const regionNames = useMemo(() => {
    if (!isEmpty(get(tsAlert, 'defaultAlert.regions', []))) {
      return map(tsAlert.defaultAlert.regions, 'name')
    }
    if (!isEmpty(get(tsAlert, 'regions', []))) {
      return map(tsAlert.regions, 'name')
    }
    return []
  }, [tsAlert])

  const isActive = tsAlert.status === 'active'

  const tsAlertIdStatus = (
    <Box display='flex' flexDirection='row' alignItems='center'>
      <Box>
        <ActivePulse isActive={isActive} />
      </Box>
      <Box className='am-overline'>
        {getThreatCanonicalId(tsAlert)}
      </Box>
    </Box>
  )

  const mainBody = (
    <>
      {leftAdornment && (
        <ListItemIcon>
          <span style={{ display: 'flex', alignItems: 'center' }}>
            {leftAdornment}
          </span>
        </ListItemIcon>
      )}
      <Box display='flex' flexDirection='column' width={1}>
        <Box
          display='flex'
          flexDirection='row'
          alignItems='center'
          pl={1}
          pr={1}
          id='threat-main-content'
        >
          <Box>
            {severity && (
              <AlertLevelLabel
                level={severity}
                label={severity}
                style={{
                  margin: '0px 8px 0px 2px !important',
                }}
              />
            )}
          </Box>
          <Box>
            <div className='am-caption'>
              <span>
                <Icon
                  icon='polygon'
                  color={palette.secondary.main}
                  size={14}
                  style={{ transform: 'translate(0, 4px)' }}
                />
                {tsName}
              </span>
              <span>
                <RegionList data={regionNames} />
              </span>
            </div>
          </Box>
        </Box>
        <Box
          display='flex'
          flexDirection='row'
          alignItems='center'
          pl={2}
          pt={0.5}
          pb={0.5}
          mt={1}
          className={clsx({
            active: isActiveThreatSignature,
          })}
          id='threat-bottom-content'
        >
          {!disableAlertIdStatus && <Box>{tsAlertIdStatus}</Box>}

          {showIncompatibleStreams && (
            <Box ml={3}>
              <Tooltip
                content={
                  <TooltipText>
                    {incompatibleCount > 0
                      ? 'Partially deployed on a subset of cameras'
                      : 'Fully deployed on all cameras'}
                  </TooltipText>
                }
                placement='left'
              >
                <span>
                  <Icon
                    icon='deployment'
                    color={
                      incompatibleCount > 0
                        ? palette.warning.main
                        : palette.common.greenPastel
                    }
                    fill={
                      incompatibleCount > 0
                        ? palette.warning.main
                        : palette.common.greenPastel
                    }
                    size={14}
                    viewBox='0 0 128 128'
                  />
                </span>
              </Tooltip>
            </Box>
          )}
        </Box>
      </Box>
    </>
  )

  if (isHoverable) {
    return (
      <ListItem
        id='threat-card'
        alignItems='flex-start'
        onMouseEnter={() =>
          dispatch(threatSignatureAlertsSetHovered(tsAlert.id))
        }
        onMouseLeave={() => dispatch(threatSignatureAlertsSetHovered(null))}
        onClick={e => {
          if (previewMode) return false
          dispatch(threatSignatureAlertsSetDetailedView(tsAlert.id))
          return setEl(e.currentTarget)
        }}
        classes={{
          root: clsx(classes.listItem, {
            active: isActiveThreatSignature,
          }),
        }}
        dense
        disableGutters
      >
        {mainBody}
      </ListItem>
    )
  }

  return (
    <ListItem
      id='threat-card'
      alignItems='flex-start'
      classes={{
        root: clsx(classes.listItem, {
          active: isActiveThreatSignature,
        }),
      }}
      dense
      disableGutters
    >
      {mainBody}
    </ListItem>
  )
}

ThreatCard.defaultProps = {
  isActiveThreatSignature: false,
  isHoverable: false,
  isSelectable: false,
  leftAdornment: null,
  setEl: () => {},
  showIncompatibleStreams: false,
  tsAlert: {},
  tsName: undefined,
  disableBottomBorder: false,
  disableAlertIdStatus: false,
}

ThreatCard.propTypes = {
  isActiveThreatSignature: PropTypes.bool,
  isHoverable: PropTypes.bool,
  isSelectable: PropTypes.bool,
  leftAdornment: PropTypes.node,
  setEl: PropTypes.func,
  showIncompatibleStreams: PropTypes.bool,
  tsAlert: PropTypes.object,
  tsName: PropTypes.string,
  disableBottomBorder: PropTypes.bool,
  disableAlertIdStatus: PropTypes.bool,
}

export default ThreatCard
