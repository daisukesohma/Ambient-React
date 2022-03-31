import React, { useState } from 'react'
import { useTheme } from '@material-ui/core/styles'
import { useSelector } from 'react-redux'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Hidden from '@material-ui/core/Hidden'
import first from 'lodash/first'
import take from 'lodash/take'
import map from 'lodash/map'
import isEmpty from 'lodash/isEmpty'
// src
import { Icons } from 'ambient_ui'
import ActivePulse from 'components/ActivePulse'
import Tooltip from 'components/Tooltip'
import TooltipText from 'components/Tooltip/TooltipText'
import orderedAlerts from '../../selectors/orderedAlerts'

import { SITES_COUNT_IN_TOOLTIP } from '../../constants'

import CurrentUser from './CurrentUser'
import Logo from './Logo'
import Popup from './Popup'
import SiteSelector from './SiteSelector'
import useStyles from './styles'
import ActiveAlertInfo from './ActiveAlertInfo'
import InternetSpeedIndicator from 'components/organisms/InternetSpeedIndicator'
import VolumeSelector from './VolumeSelector'
import RefreshSelector from './RefreshSelector'
import selectedSitesList from '../../selectors/selectedSitesList'
import ClipSelector from './ClipSelector'

const { Sites, Bell } = Icons

function TopBar() {
  const { palette } = useTheme()
  const classes = useStyles()
  const selectedSites = useSelector(selectedSitesList)
  const alertInstances = useSelector(state => state.verification.alertInstances)
  const alerts = useSelector(orderedAlerts)
  const firstAlert = first(alerts)
  const isSocketConnected = useSelector(
    state => state.verification.isSocketConnected,
  )

  const [isSiteSelectorOpen, setIsSiteSelectorOpen] = useState(false)

  const getConnectionStatus = () => {
    if (isSocketConnected) return 'online'
    return isEmpty(selectedSites)
      ? 'No sites monitored'
      : 'Disconnected. Reconnection...'
  }

  return (
    <Grid
      container
      className={classes.root}
      direction='row'
      justify='space-between'
      alignItems='center'
    >
      <Grid
        item
        container
        xs={2}
        sm={2}
        md={3}
        lg={3}
        justify='flex-start'
        alignItems='center'
      >
        <Hidden only={['lg', 'xl']}>
          <Hidden only={['xs', 'sm']}>
            <Logo containerStyle={{ marginRight: 8 }} width={35} />
          </Hidden>
          <Typography>Verification Portal</Typography>
        </Hidden>
        <Hidden only={['xs', 'sm', 'md']}>
          <Logo containerStyle={{ marginRight: 16 }} width={35} />
          <Typography className={'am-h5'}>Alert Verification Portal</Typography>
        </Hidden>
      </Grid>

      <Grid
        item
        container
        xs={4}
        sm={4}
        md={3}
        lg={5}
        justify='center'
        alignItems='center'
      >
        <Grid item container xs={12} justify='center' alignItems='center'>
          <ActivePulse pulseSize={14} isActive={isSocketConnected} />
          <Hidden only={['lg', 'xl']}>{getConnectionStatus()}</Hidden>
          <Hidden only={['xs', 'sm', 'md']}>
            {`Connection: ${getConnectionStatus()}`}
          </Hidden>
          {` | `}
          <Hidden only={['lg', 'xl']}>
            <Tooltip
              innerSpanStyles={{ paddingTop: 8 }}
              content={<TooltipText>Internet connectivity speed</TooltipText>}
              placement='right'
            >
              <InternetSpeedIndicator />
            </Tooltip>
          </Hidden>
          <Hidden only={['xs', 'sm', 'md']}>
            Internet Signal Strength:&nbsp;
            <InternetSpeedIndicator />
          </Hidden>
        </Grid>

        {firstAlert && (
          <Grid item container xs={12} justify='center' alignItems='center'>
            <ActiveAlertInfo alert={firstAlert} />
          </Grid>
        )}
      </Grid>
      <Grid
        item
        container
        xs={6}
        sm={6}
        md={6}
        lg={4}
        justify='flex-end'
        alignItems='center'
      >
        <ClipSelector />
        <RefreshSelector />
        <VolumeSelector />
        <Tooltip
          content={
            <>
              <Typography className={'am-subtitle1'}>
                {isEmpty(selectedSites)
                  ? 'Sites not selected'
                  : 'Selected Sites:'}
              </Typography>
              {map(
                take(selectedSites, SITES_COUNT_IN_TOOLTIP),
                ({ id, name }, index) => (
                  <Typography key={id} className={'am-subtitle1'}>
                    {`${index + 1}. ${name}`}
                  </Typography>
                ),
              )}
              {selectedSites.length > 20 && (
                <Typography className={'am-subtitle1'}>...</Typography>
              )}
            </>
          }
          placement='bottom'
          theme='ambient-white'
          arrow
        >
          <Popup
            icon={() => (
              <Sites stroke={palette.primary.main} width={18} height={18} />
            )}
            badge={selectedSites && selectedSites.length}
            isOpen={isSiteSelectorOpen}
            setIsSiteSelectorOpen={setIsSiteSelectorOpen}
          >
            <SiteSelector setIsSiteSelectorOpen={setIsSiteSelectorOpen} />
          </Popup>
        </Tooltip>

        <Popup
          icon={() => (
            <Bell stroke={palette.common.black} width={18} height={18} />
          )}
          badge={alertInstances && alertInstances.length}
          badgeBackground={palette.error.main}
        />

        <CurrentUser />
      </Grid>
    </Grid>
  )
}

export default TopBar
