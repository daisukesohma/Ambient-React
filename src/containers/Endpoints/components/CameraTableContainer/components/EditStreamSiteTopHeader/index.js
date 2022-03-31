import React, { useState } from 'react'
import { useTheme } from '@material-ui/core/styles'
import { useSelector, useDispatch } from 'react-redux'
import {
  updateStreamSiteRequested,
  setEditableTable,
} from 'redux/cameras/actions'
import clsx from 'clsx'
import Box from '@material-ui/core/Box'
import isEmpty from 'lodash/isEmpty'
// src
import { Button, SearchableSelectDropdown, Icon } from 'ambient_ui'
import sitesDropdownOptions from 'selectors/cameras/sitesDropdownOptions'

import useStyles from './styles'

function EditStreamSiteTopHeader({ selected }) {
  const { palette } = useTheme()
  const dispatch = useDispatch()
  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({ darkMode })
  const selectedSite = useSelector(state => state.cameras.selectedSite)
  const siteOptions = useSelector(sitesDropdownOptions)
  const sites = useSelector(state => state.cameras.sites)
  const selectedSiteName = sites.find(s => s.slug === selectedSite).name
  const [newSelectedSite, setNewSelectedSite] = useState()
  const updatedSite = sites.find(s => s.slug === newSelectedSite)

  const dispatchChangeStreamSite = () => {
    const requestData = selected.map(id => ({
      newSiteId: updatedSite.id,
      streamId: id,
    }))
    dispatch(updateStreamSiteRequested({ data: requestData }))
  }
  const handleSiteSelection = item => {
    if (isEmpty(item)) return
    setNewSelectedSite(item.value)
  }

  return (
    <div className={classes.editStreamSiteTopHeaderRoot}>
      <div className={clsx('am-h5', classes.header)}>Edit Site</div>
      <Box
        className={clsx('am-body1', classes.body)}
        display='flex'
        alignItems='center'
        justifyContent='space-between'
      >
        {selected.length === 0 ? (
          <div>Select streams below to change their site.</div>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <Box>
              <Box display='flex' alignItems='center'>
                <span>
                  Do you want to change
                  <span className={clsx('am-h5', classes.emphasis)}>
                    {` ${selected.length} ${
                      selected.length === 1 ? 'camera' : 'cameras'
                    } `}
                  </span>
                  from site
                  <span className='am-h5'>{` ${selectedSiteName} `}</span>
                  to{' '}
                </span>
                <span style={{ width: 300, marginLeft: 16 }}>
                  <SearchableSelectDropdown
                    id='cameras-siteSelector'
                    options={siteOptions}
                    value={siteOptions.find(
                      item => item.value === newSelectedSite,
                    )}
                    onChange={handleSiteSelection}
                  />
                </span>
              </Box>
              <Box
                className={clsx(classes.warning, 'am-caption')}
                display='flex'
                alignItems='center'
                mt={1}
              >
                <Icon
                  icon='alertCircle'
                  color={palette.warning.main}
                  size={16}
                />
                Note: This action will affect historical Activities, Dashboards
                and Alerting.
              </Box>
            </Box>
            <div>
              {newSelectedSite && (
                <Button onClick={dispatchChangeStreamSite}>Confirm</Button>
              )}
            </div>
          </div>
        )}
        <Button
          variant='text'
          onClick={() => dispatch(setEditableTable({ editable: false }))}
        >
          Cancel
        </Button>
      </Box>
    </div>
  )
}

export default EditStreamSiteTopHeader
