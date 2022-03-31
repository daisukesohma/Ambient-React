import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import { useTheme } from '@material-ui/core/styles'
import { batch, useDispatch, useSelector } from 'react-redux'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Grid from '@material-ui/core/Grid'
import InputAdornment from '@material-ui/core/InputAdornment'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { Icons } from 'ambient_ui'
import TextField from '@material-ui/core/TextField'
import getSelectedSites from 'selectors/operatorPage/getSelectedSites'
import Tooltip from 'components/Tooltip'
import TooltipText from 'components/Tooltip/TooltipText'
import CheckinModal from 'features/EnhancedResponder/CheckinModal'
import {
  fetchContactResourcesRequested,
  fetchUsersRequested,
} from 'features/EnhancedResponder/CheckinModal/redux/checkinModalSlice'
import { useParams } from 'react-router-dom'

import useStyles from './styles'
import SiteList from './SiteList'

const SiteSelector = () => {
  const { palette } = useTheme()
  const dispatch = useDispatch()
  const { account } = useParams()
  const [opened, setOpenStatus] = useState(false)

  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({ darkMode, opened })

  const sites = useSelector(state => state.operatorPage.sites)
  const unSelectedSites = useSelector(
    state => state.operatorPage.unSelectedSites || [],
  )
  const selectedSites = useSelector(getSelectedSites)

  const [filterText, setFilterText] = useState('')
  const [tabIndex, setTabIndex] = useState(0)

  const searchSites = e => {
    const { value } = e.target
    setFilterText(value)
  }

  const filteredUnSelectedSites = unSelectedSites.filter(site =>
    site.name.toLowerCase().includes(filterText.toLowerCase()),
  )
  const filteredSelectedSites = selectedSites.filter(site =>
    site.name.toLowerCase().includes(filterText.toLowerCase()),
  )

  useEffect(() => {
    batch(() => {
      dispatch(fetchContactResourcesRequested({ accountSlug: account }))
      dispatch(fetchUsersRequested({ accountSlug: account }))
    })
  }, [account, dispatch])

  const renderSites = (
    <>
      <Grid container direction='column' className={classes.bodyContent}>
        <SiteList onlySelection={false} sites={sites} />
      </Grid>

      <Grid item>
        <CheckinModal />
      </Grid>
      <Grid item className={classes.footer}>
        <TextField
          variant='standard'
          fullWidth
          InputProps={{
            className: classes.searchInput,
            startAdornment: (
              <InputAdornment position='start'>
                <Icons.Investigate
                  width={24}
                  height={24}
                  stroke={palette.grey[500]}
                />
              </InputAdornment>
            ),
          }}
          name='search'
          placeholder='Search'
          onChange={searchSites}
          value={filterText}
        />
      </Grid>
    </>
  )

  const renderSelection = (
    <>
      <Grid container direction='column' className={classes.bodyContent}>
        <SiteList
          onlySelection
          isMonitoring={false}
          sites={filteredUnSelectedSites}
        />
        <SiteList onlySelection isMonitoring sites={filteredSelectedSites} />
      </Grid>

      <Grid item className={classes.footer}>
        <TextField
          variant='standard'
          fullWidth
          InputProps={{
            className: classes.searchInput,
            startAdornment: (
              <InputAdornment position='start'>
                <Icons.Investigate
                  width={24}
                  height={24}
                  stroke={palette.grey[500]}
                />
              </InputAdornment>
            ),
          }}
          name='search'
          placeholder='Search'
          onChange={searchSites}
          value={filterText}
        />
      </Grid>
    </>
  )

  return (
    <div className={classes.root}>
      <Grid
        container
        direction='row'
        justify='center'
        alignItems='center'
        className={classes.header}
        onClick={() => setOpenStatus(!opened)}
      >
        <Grid item sm={7} xs={7} md={7} lg={7} xl={7}>
          <div className='am-subtitle2'>
            {opened ? 'Check Into Sites' : 'Monitored Sites'}
          </div>
        </Grid>

        <Grid item sm={2} xs={2} md={2} lg={2} xl={2}>
          {selectedSites.length > 0 && (
            <Tooltip
              content={
                <TooltipText>
                  {selectedSites.length}{' '}
                  {selectedSites.length === 1 ? 'site' : 'sites'} monitored
                </TooltipText>
              }
            >
              <div className={clsx(classes.badge)}>{selectedSites.length}</div>
            </Tooltip>
          )}
        </Grid>

        <Grid item sm={2} xs={2} md={2} lg={2} xl={2}>
          {unSelectedSites.length > 0 && (
            <Tooltip
              content={
                <TooltipText>
                  {unSelectedSites.length}{' '}
                  {unSelectedSites.length === 1 ? 'site' : 'sites'} unmonitored
                </TooltipText>
              }
            >
              <div className={clsx(classes.badge, classes.badgeWarning)}>
                {unSelectedSites.length}
              </div>
            </Tooltip>
          )}
        </Grid>
        <Grid item sm={1} xs={1} md={1} lg={1} xl={1}>
          {opened ? <ExpandMoreIcon /> : <ExpandLessIcon />}
        </Grid>
      </Grid>

      {opened && (
        <Grid className={classes.body}>
          <Tabs
            value={tabIndex}
            indicatorColor='primary'
            variant='fullWidth'
            textColor='secondary'
            onChange={(_, index) => setTabIndex(index)}
          >
            <Tab
              classes={{
                root: classes.tabRoot,
                wrapper: classes.tabWrapper,
                selected: classes.tabSelected,
              }}
              label={
                <>
                  <span className='am-button' style={{ marginRight: 8 }}>
                    Responder Status
                  </span>
                </>
              }
            />
            <Tab
              classes={{
                root: classes.tabRoot,
                wrapper: classes.tabWrapper,
                selected: classes.tabSelected,
              }}
              label={
                <>
                  <span className='am-button' style={{ marginRight: 8 }}>
                    Monitored Sites
                  </span>
                </>
              }
            />
          </Tabs>
          {tabIndex === 0 && renderSites}
          {tabIndex === 1 && renderSelection}
        </Grid>
      )}
    </div>
  )
}

export default SiteSelector
