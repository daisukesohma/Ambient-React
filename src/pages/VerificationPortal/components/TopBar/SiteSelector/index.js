import React, { useState } from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import {
  Typography,
  Divider,
  Chip,
  InputAdornment,
  TextField,
} from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
// src
import { CircularProgress, Icons, Button } from 'ambient_ui'
import map from 'lodash/map'
import filter from 'lodash/filter'
import includes from 'lodash/includes'
import {
  wsConnect,
  setSitesQuery,
  setSelectedSites as setSelectedSitesAction,
} from 'pages/VerificationPortal/redux/verificationSlice'
import searchedSites from 'pages/VerificationPortal/selectors/searchedSites'

import useStyles from './styles'

const { Sites, Close } = Icons

const propTypes = {
  setIsSiteSelectorOpen: PropTypes.func,
}

const defaultProps = {
  setIsSiteSelectorOpen: () => {},
}

function SiteSelector({ setIsSiteSelectorOpen }) {
  const { palette } = useTheme()
  const classes = useStyles()
  const dispatch = useDispatch()
  const isSitesLoading = useSelector(state => state.verification.sitesLoading)
  const savedSites = useSelector(state => state.verification.selectedSites)
  const sitesQuery = useSelector(state => state.verification.sitesQuery)
  const allSites = useSelector(state => state.verification.sites)
  const sites = useSelector(searchedSites)

  const [selectedSites, setSelectedSites] = useState(savedSites || [])
  const siteOptions = map(sites, site => ({
    label: `${site.account.name} - ${site.name}`,
    value: site.id,
  }))

  // MAY NEED site id - whatever is nec. for param to filter with at endpoint
  const handleSiteSelection = value => {
    if (!includes(selectedSites, value)) {
      setSelectedSites([...selectedSites, value])
    }
  }
  const handleSiteDeletion = value =>
    setSelectedSites(filter(selectedSites, site => site !== value))
  const selectAllSites = () => setSelectedSites(map(allSites, 'id'))
  const clearAllSites = () => setSelectedSites([])

  const handleSaveSiteSelections = () => {
    dispatch(setSelectedSitesAction({ selectedSites }))
    dispatch(wsConnect())
    setIsSiteSelectorOpen(false)
  }

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Typography className='am-h5'>Site selection</Typography>
        <div className={classes.headerRight}>
          <span>{selectedSites.length}</span>
          <div className={classes.icon}>
            <Sites stroke={palette.primary.main} width={18} height={18} />
          </div>
        </div>
      </div>
      <Divider />
      <div className={classes.body}>
        <Typography className={classes.title}>
          Add or remove sites to your account
        </Typography>
        <TextField
          className={classes.searchInput}
          onChange={e => {
            dispatch(setSitesQuery({ sitesQuery: e.currentTarget.value }))
          }}
          value={sitesQuery}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon className={classes.searchIcon} />
              </InputAdornment>
            ),
            disableUnderline: true,
            className: classes.searchText,
          }}
        />
        {isSitesLoading && <CircularProgress />}
        {!isSitesLoading && (
          <div className={classes.chipsContainer}>
            {map(siteOptions, (site, index) => (
              <Chip
                key={index}
                label={
                  <Typography className='am-subtitle1'>{site.label}</Typography>
                }
                clickable
                className={
                  includes(selectedSites, site.value)
                    ? classes.selectedChip
                    : classes.chipRoot
                }
                onDelete={() => handleSiteDeletion(site.value)}
                onClick={() => handleSiteSelection(site.value)}
                deleteIcon={
                  <div className={classes.closeIcon}>
                    <Close stroke={palette.grey[700]} />
                  </div>
                }
              />
            ))}
          </div>
        )}
      </div>
      <div className={classes.footer}>
        <Button
          className={classes.footerButton}
          onClick={selectAllSites}
          color='secondary'
        >
          Select All
        </Button>
        <Button
          className={classes.footerButton}
          onClick={clearAllSites}
          color='secondary'
        >
          Clear
        </Button>
        <Button
          className={classes.footerButton}
          onClick={handleSaveSiteSelections}
        >
          Save
        </Button>
      </div>
    </div>
  )
}

SiteSelector.propTypes = propTypes
SiteSelector.defaultProps = defaultProps

export default SiteSelector
