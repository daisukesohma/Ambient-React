import React, { useState } from 'react'
import { useTheme } from '@material-ui/core/styles'
import { useParams, Redirect } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import Switch from '@material-ui/core/Switch'
import { Grid, Typography } from '@material-ui/core'
import { Icons, LabelledSliderSwitch } from 'ambient_ui' // eslint-disable-line
import { isMobile, isMobileOnly } from 'react-device-detect'
import some from 'lodash/some'
import clsx from 'clsx'
import { showSPEStreams, showNormalStreams } from 'redux/slices/settings'
import config from 'config'
import { Can } from 'rbac'

import { StreamTypeEnum } from '../../enums'
import IndicatorStatusBadge from '../../components/IndicatorStatusBadge'
import VideoWall from '../../components/VideoWall'
import DemoPlayback from '../../components/DemoPlayback'

import SecurityProfileSelector from './SecurityProfileSelector/index'
import useStyles from './styles'
import './style.css'

const { Info } = Icons
const isDemo = config.settings.demo

export default function Dashboard() {
  const { palette } = useTheme()
  const { site } = useParams()
  const dispatch = useDispatch()
  const sites = useSelector(state => state.auth.sites)
  const sideBarOpened = useSelector(state => state.settings.sideBarOpened)
  const streamType = useSelector(state => state.settings.streamType)
  const [overriddenData, setOverriddenData] = useState(null)

  const isSPE = streamType === StreamTypeEnum.SPE
  const hasAccess = some(sites, { slug: site })

  const classes = useStyles({
    isMobile: isMobileOnly,
    overriddenData,
    sideBarOpened,
  })

  const handleSPESwitchChange = () =>
    isSPE ? dispatch(showNormalStreams()) : dispatch(showSPEStreams())
  const showOverriddenData = ({ user }) => setOverriddenData(user)

  if (!hasAccess) return <Redirect to='/404' />

  return (
    <Grid container className={classes.dashboardContainer}>
      <Grid item xs={12} className={classes.dashboardMain}>
        {overriddenData && (
          <Grid className={classes.topAlert}>
            <Grid className={classes.topAlertContent}>
              <Info stroke={palette.grey[700]} width={14} height={14} />
              <Typography className={clsx('am-overline', classes.alertText)}>
                {`Scheduled Security Profile overridden by ${overriddenData.firstName} ${overriddenData.lastName} (${overriddenData.email})`}
              </Typography>
            </Grid>
          </Grid>
        )}
        <Grid container className={classes.dashboardTopBar}>
          {isMobile ? (
            <>
              <Grid className={classes.mobileTop}>
                <Grid>
                  <IndicatorStatusBadge
                    status='LIVE'
                    showLivePulse
                    display='block'
                    variant='naked'
                    pulseColor={palette.error.main}
                    pulseRippleColor='red'
                    style={{ position: 'relative', marginLeft: 20 }} // override absolute positioning
                    fontStyle={{ color: palette.text.primary }} // for Dashboard need to force default behaviour, because we use white for video streams by the whole product
                  />
                </Grid>
                <Grid>
                  <Can I='is_internal' on='Admin'>
                    <div
                      id='spe-switch'
                      style={{ display: 'flex', flexDirection: 'row' }}
                    >
                      <div style={{ fontSize: 12 }}>SPE Mode</div>
                      <Switch
                        onChange={handleSPESwitchChange}
                        checked={isSPE}
                        color='primary'
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                        className={classes.switch}
                      />
                    </div>
                  </Can>
                </Grid>
              </Grid>
              <Grid className={classes.mobileSecurity}>
                <SecurityProfileSelector
                  showOverriddenData={showOverriddenData}
                />
              </Grid>
            </>
          ) : (
            <>
              <Grid item lg={1} md={1} sm={12} xs={12}>
                <div>
                  <IndicatorStatusBadge
                    status='LIVE'
                    showLivePulse
                    display='block'
                    variant='naked'
                    pulseColor={palette.error.main}
                    pulseRippleColor='red'
                    style={{ position: 'relative' }} // override absolute positioning
                    fontStyle={{ color: palette.text.primary }} // for Dashboard need to force default behaviour, because we use white for video streams by the whole product
                  />
                </div>
              </Grid>
              <Grid
                item
                lg={9}
                md={9}
                sm={12}
                xs={12}
                className={classes.dashboardSecurityProfileSelector}
              >
                <SecurityProfileSelector
                  showOverriddenData={showOverriddenData}
                />
              </Grid>
              <Grid item lg={2} md={2} sm={12} xs={12}>
                <Can I='is_internal' on='Admin'>
                  <div
                    id='spe-switch'
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <LabelledSliderSwitch
                      checked={isSPE}
                      onClick={handleSPESwitchChange}
                      darkIconContent='SPE'
                      lightIconContent='Normal'
                    />
                  </div>
                </Can>
              </Grid>
            </>
          )}
        </Grid>

        <Grid item xs={12}>
          <VideoWall />
        </Grid>
      </Grid>

      {isDemo && (
        <Grid item xs={12}>
          <DemoPlayback />
        </Grid>
      )}
    </Grid>
  )
}
