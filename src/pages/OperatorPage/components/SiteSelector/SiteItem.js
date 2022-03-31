/* eslint-disable no-restricted-globals */
import React, { useState } from 'react'
import Grid from '@material-ui/core/Grid'
import Collapse from '@material-ui/core/Collapse'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import UserAvatar from 'components/UserAvatar'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import Checkbox from '@material-ui/core/Checkbox'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import get from 'lodash/get'
import { useDispatch, useSelector } from 'react-redux'
import { updateUnSelectedSites } from 'redux/slices/operatorPage'
import OverflowTip from 'components/OverflowTip'
import { setCheckinModalOpen } from 'features/EnhancedResponder/CheckinModal/redux/checkinModalSlice'
import { createNotification } from 'redux/slices/notifications'

import useStyles from './styles'

const propTypes = {
  site: PropTypes.shape({
    name: PropTypes.string,
    slug: PropTypes.string,
    activeWorkShiftPeriods: PropTypes.array,
  }),
  isMonitoring: PropTypes.bool,
  onlySelection: PropTypes.bool,
}

const SiteItem = ({ site, isMonitoring = true, onlySelection = true }) => {
  const dispatch = useDispatch()
  const darkMode = useSelector(state => state.settings.darkMode)
  const unSelectedSites = useSelector(
    state => state.operatorPage.unSelectedSites || [],
  )
  const usersLoading = useSelector(state => state.checkinModal.usersLoading)
  const contactResourcesLoading = useSelector(
    state => state.checkinModal.contactResourcesLoading,
  )
  const classes = useStyles({ darkMode })
  const [expanded, setExpanded] = useState(true)

  const { slug, name, activeWorkShiftPeriods } = site
  const filteredActiveWorkShiftPeriods = activeWorkShiftPeriods.filter(
    workShiftPeriod => get(workShiftPeriod, 'endWorkShift') === null,
  )

  const handleOpenModal = workShiftPeriod => {
    if (usersLoading || contactResourcesLoading) {
      dispatch(createNotification({ message: 'Loading' }))
      return
    }
    dispatch(
      setCheckinModalOpen({
        checkinModalOpen: true,
        responderId: get(workShiftPeriod, 'profile.id'),
        responderReadOnly: true,
        siteSlug: slug,
        contactResourceId: isNaN(
          Number(get(workShiftPeriod, 'contactResource.id')),
        )
          ? null
          : Number(get(workShiftPeriod, 'contactResource.id')),
      }),
    )
  }

  return (
    <>
      <Grid
        container
        direction='row'
        alignItems='center'
        className={classes.siteItem}
        onClick={() => {
          setExpanded(!expanded)
        }}
      >
        <Grid className={clsx(classes.siteName, 'am-subtitle2')}>
          <OverflowTip text={name} width={180} />
        </Grid>
        <Grid item alignItems='center' className={classes.checkboxWrapper}>
          {onlySelection && (
            <Checkbox
              color={darkMode ? 'default' : 'primary'}
              classes={{
                root: classes.checkboxRoot,
                checked: classes.checkboxChecked,
              }}
              edge='start'
              checked={isMonitoring}
              tabIndex={-1}
              disableRipple
              onClick={() => {
                if (isMonitoring) {
                  dispatch(
                    updateUnSelectedSites({
                      sites: [...unSelectedSites, site],
                    }),
                  )
                } else {
                  dispatch(
                    updateUnSelectedSites({
                      sites: unSelectedSites.filter(
                        unSelectedSite => slug !== unSelectedSite.slug,
                      ),
                    }),
                  )
                }
              }}
            />
          )}
          {!onlySelection &&
            filteredActiveWorkShiftPeriods &&
            filteredActiveWorkShiftPeriods.length > 0 && (
              <>{expanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}</>
            )}
        </Grid>
      </Grid>
      {!onlySelection && (
        <Grid container direction='row' alignItems='center'>
          <Collapse in={expanded} timeout='auto' unmountOnExit>
            <List component='div' disablePadding>
              {(filteredActiveWorkShiftPeriods || []).map(workShiftPeriod => {
                const { profile } = workShiftPeriod

                return (
                  <ListItem
                    key={profile.user.email}
                    button
                    className={classes.nested}
                    onClick={() => {
                      handleOpenModal(workShiftPeriod)
                    }}
                  >
                    <ListItemIcon>
                      <UserAvatar
                        img={profile.img}
                        name={`${profile.user.firstName} ${profile.user.lastName}`}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={`${profile.user.firstName} ${profile.user.lastName}`}
                    />
                  </ListItem>
                )
              })}
            </List>
          </Collapse>
        </Grid>
      )}
    </>
  )
}
SiteItem.propTypes = propTypes

export default SiteItem
