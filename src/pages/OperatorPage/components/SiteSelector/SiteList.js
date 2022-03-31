import React, { useState } from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { useSelector } from 'react-redux'

import useStyles from './styles'
import SiteItem from './SiteItem'

const propTypes = {
  sites: PropTypes.array,
  isMonitoring: PropTypes.bool,
  onlySelection: PropTypes.bool,
}

const SiteList = ({ sites, isMonitoring = true, onlySelection = true }) => {
  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({ darkMode })
  const [expanded, setExpanded] = useState(true)

  if (sites.length === 0) {
    return null
  }

  return (
    <>
      {onlySelection && (
        <Grid
          container
          direction='row'
          justify='center'
          alignItems='center'
          className={clsx(classes.header, classes.headerSiteList)}
          onClick={() => setExpanded(!expanded)}
        >
          <Grid item sm={8} xs={8} md={8} lg={8} xl={8}>
            <div className={clsx('am-overline', classes.headerTitle)}>
              {isMonitoring ? 'Monitored Sites' : 'Unmonitored Sites'}
            </div>
          </Grid>

          <Grid
            container
            alignItems='center'
            justify='center'
            sm={3}
            xs={3}
            md={3}
            lg={3}
            xl={3}
          >
            <div
              className={clsx(
                classes.badge,
                !isMonitoring && classes.badgeWarning,
              )}
            >
              {sites.length > 0 && sites.length}
            </div>
          </Grid>

          <Grid container sm={1} xs={1} md={1} lg={1} xl={1}>
            {expanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}
          </Grid>
        </Grid>
      )}
      {expanded && (
        <>
          {sites.length > 0 ? (
            sites.map(site => {
              return (
                <SiteItem
                  key={site.slug}
                  site={site}
                  isMonitoring={isMonitoring}
                  onlySelection={onlySelection}
                />
              )
            })
          ) : (
            <Grid container justify='center' className={classes.noSites}>
              No Sites
            </Grid>
          )}
        </>
      )}
    </>
  )
}

SiteList.propTypes = propTypes
export default SiteList
