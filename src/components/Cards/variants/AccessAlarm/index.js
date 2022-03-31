import React, { useCallback } from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Chip from '@material-ui/core/Chip'
import { Icons, ImageNotFound, Icon as AmbientIcon } from 'ambient_ui'
import moment from 'moment'
import get from 'lodash/get'
import { useDispatch } from 'react-redux'
// src
import { showModal } from 'redux/slices/modal'
import {
  ActivityTypeEnum,
  AccessAlarmTypeEnum,
  ModalTypeEnum,
  ActivityTypeToReadableEnum,
  ActivityTypeColor,
} from 'enums'
import { getActivitySiteName, getActivitySite } from 'utils'
import Tooltip from 'components/Tooltip'
import TooltipText from 'components/Tooltip/TooltipText'

import Card from 'components/Cards/variants/BaseCard'
import AvatarName from 'components/Cards/variants/BaseCard/Content/AvatarName'
import FooterSingleLine from 'components/Cards/variants/BaseCard/FooterSingleLine'
import HeaderDoubleLine from 'components/Cards/variants/BaseCard/HeaderDoubleLine'
import Content from 'components/Cards/variants/BaseCard/Content'
import LabelValue from 'components/Cards/variants/BaseCard/Content/LabelValue'
import { FOOTER_HEIGHT } from 'components/Cards/variants/BaseCard/FooterSingleLine/styles'

import { getEventByThreatSignaturePause } from 'pages/ActivityLog/utils'

const {
  Bell,
  Person,
  Refresh,
  Door,
  AlertCircle,
  UserCheck,
  CloseOctagon,
  Info,
  Pause,
} = Icons

const propTypes = {
  activity: PropTypes.object,
  darkMode: PropTypes.bool,
}

const AccessAlarmCard = ({ activity, darkMode }) => {
  const { __typename, ts } = activity
  const dispatch = useDispatch()
  const { palette } = useTheme()
  const AccessAlarmColorMapping = useCallback(accessAlarmType => {
    const scheme = {
      [AccessAlarmTypeEnum.GRANTED_ACCESS]:
        ActivityTypeColor[ActivityTypeEnum.AccessAlarmType],
      [AccessAlarmTypeEnum.DOOR_HELD_OPEN]: palette.error.main,
      [AccessAlarmTypeEnum.DOOR_FORCED_OPEN]: palette.error.main,
      [AccessAlarmTypeEnum.INVALID_BADGE]: palette.warning.main,
      [AccessAlarmTypeEnum.GRANTED_NO_ENTRY]: palette.warning.main,
      [AccessAlarmTypeEnum.OTHER]: palette.warning.main,
    }
    return scheme[accessAlarmType] || palette.warning.main // fallback Color
  }, [])

  const AccessAlarmIconMapping = useCallback(accessAlarmType => {
    const scheme = {
      [AccessAlarmTypeEnum.GRANTED_ACCESS]: UserCheck,
      [AccessAlarmTypeEnum.DOOR_HELD_OPEN]: Door,
      [AccessAlarmTypeEnum.DOOR_FORCED_OPEN]: Door,
      [AccessAlarmTypeEnum.INVALID_BADGE]: CloseOctagon,
      [AccessAlarmTypeEnum.GRANTED_NO_ENTRY]: CloseOctagon,
      [AccessAlarmTypeEnum.OTHER]: AlertCircle,
    }
    return scheme[accessAlarmType] || Info // fallback Icon
  }, [])

  const badge = ActivityTypeToReadableEnum[__typename]
  const decoratorColor = ActivityTypeColor[__typename]
  let statusColor = decoratorColor

  let title = ''
  let Icon = Bell
  let avatarName = ''
  let avatarUrl = ''
  let avatarEmail = ''
  let site = ''
  let body = null
  let stream = ''

  if (__typename === ActivityTypeEnum.AccessAlarmType) {
    const { name, accessAlarmType, reader, evidenceAvailable, clip } = activity
    title = name
    statusColor = AccessAlarmColorMapping(accessAlarmType)
    Icon = AccessAlarmIconMapping(accessAlarmType)
    site = get(reader, 'site.name', '')
    stream = get(reader, 'stream.name', '')
    if (evidenceAvailable) {
      body = (
        <>
          <Box ml={2}>
            <LabelValue label='Device' value={reader.deviceId} isHorizontal />
          </Box>
          <Grid item>
            <img
              onError={e => {
                e.target.onerror = null
                e.target.src = ImageNotFound
              }}
              style={{
                width: '100%',
                objectFit: 'cover',
                marginBottom: FOOTER_HEIGHT - 6,
              }}
              src={clip}
              alt='Avatar'
            />
          </Grid>
        </>
      )
    } else {
      body = (
        <Grid item xs={12}>
          <Box ml={2}>
            <LabelValue label='Device' value={reader.deviceId} isHorizontal />
          </Box>
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            No Stream Associated
          </div>
        </Grid>
      )
    }
  } else if (__typename === ActivityTypeEnum.WorkShiftType) {
    const { signIn, profile } = activity
    title = 'Responder Status'
    if (!signIn) statusColor = darkMode ? palette.grey[100] : palette.grey[700]
    Icon = Person
    avatarName = `${get(profile, 'user.firstName', '')} ${get(
      profile,
      'user.lastName',
      '',
    )}`
    avatarUrl = profile.img
    avatarEmail = get(profile, 'user.email', '')
    body = (
      <Box ml={2}>
        <LabelValue value={`Checked ${signIn ? 'In' : 'Out'}`} />
      </Box>
    )
  } else if (__typename === ActivityTypeEnum.ProfileOverrideLogType) {
    const {
      user,
      overridingSecurityProfile,
      overriddenSecurityProfile,
    } = activity
    title = 'Security Profile Changed'
    Icon = Refresh
    avatarName = `${user.firstName} ${user.lastName}`
    avatarUrl = get(user, 'profile.img', '')
    avatarEmail = user.email
    site = get(overridingSecurityProfile, 'site.name', '')
    body = (
      <>
        <Grid item xs={12}>
          <Box ml={2}>
            <LabelValue
              label='Overridden Security Profile'
              value={
                overriddenSecurityProfile
                  ? overriddenSecurityProfile.name
                  : 'N/A'
              }
            />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box ml={2}>
            <LabelValue
              label='Overriding Security Profile'
              value={
                overridingSecurityProfile
                  ? overridingSecurityProfile.name
                  : 'N/A'
              }
            />
          </Box>
        </Grid>
      </>
    )
  } else if (__typename === ActivityTypeEnum.ThreatSignaturePausePeriodType) {
    const { createdBy } = activity
    title = 'Threat Signature Pause Period'
    Icon = Pause
    avatarName = `${get(createdBy, 'user.firstName', '')} ${get(
      createdBy,
      'user.lastName',
      '',
    )}`
    avatarUrl = get(createdBy, 'profile.img', '')
    avatarEmail = get(createdBy, 'user.email', '')
    site = get(activity, 'site.name', '')
    body = <Box m={2}>{getEventByThreatSignaturePause(activity)}</Box>
  }

  const viewStream = () => {
    if (__typename === ActivityTypeEnum.AccessAlarmType) {
      const { reader } = activity
      const streamName = get(reader, 'stream.name')
      const streamId = get(reader, 'stream.id')
      const nodeId = get(reader, 'stream.node.identifier', '')
      const siteSlug = get(reader, 'site.slug', '')
      const initTs = get(activity, 'ts', null)
      const siteName = getActivitySiteName(activity)
      const timezone = get(getActivitySite(activity), 'timezone')

      dispatch(
        showModal({
          content: {
            streamName,
            streamId,
            nodeId,
            siteName,
            siteSlug,
            initTs,
            timezone,
          },
          type: ModalTypeEnum.VIDEO,
        }),
      )
    }
  }

  return (
    <Card
      width='100%'
      inlineStyle={{ height: '100%', minHeight: 380 }}
      darkMode={darkMode}
      borderColor={decoratorColor}
    >
      <Grid container>
        <Box mt={1} ml={1}>
          <Chip
            size='small'
            label={badge}
            style={{ backgroundColor: decoratorColor, borderRadius: 4 }}
          />
        </Box>
      </Grid>

      <HeaderDoubleLine
        title={title}
        titleDecorator={
          <div
            style={{
              width: 8,
              height: 8,
              marginTop: 9,
              background: statusColor,
              borderRadius: 4,
            }}
          />
        }
        description={
          <>
            <span
              className='am-subtitle2'
              style={{
                color: darkMode ? palette.grey[100] : palette.grey[700],
              }}
            >
              {moment.unix(ts).format('MM/DD/YYYY HH:mm:ss')}
            </span>
          </>
        }
        topRight={
          __typename === ActivityTypeEnum.AccessAlarmType &&
          activity.evidenceAvailable ? (
            <Tooltip
              placement='bottom'
              content={<TooltipText>View Stream</TooltipText>}
            >
              <div onClick={viewStream}>
                <AmbientIcon
                  icon='eye'
                  color={darkMode ? palette.common.white : palette.common.black}
                  size={24}
                />
              </div>
            </Tooltip>
          ) : (
            <Icon stroke={decoratorColor} width={24} height={24} />
          )
        }
        darkMode={darkMode}
      />
      <Content darkMode={darkMode}>
        <Grid container direction='column'>
          {__typename !== ActivityTypeEnum.AccessAlarmType && (
            <AvatarName
              url={avatarUrl}
              name={avatarName}
              description={avatarEmail}
            />
          )}
          <Grid container>{body}</Grid>
        </Grid>
      </Content>
      <FooterSingleLine
        name={site}
        time={moment.unix(ts).fromNow()}
        info={stream}
        darkMode={darkMode}
      />
    </Card>
  )
}

AccessAlarmCard.propTypes = propTypes

export default AccessAlarmCard
