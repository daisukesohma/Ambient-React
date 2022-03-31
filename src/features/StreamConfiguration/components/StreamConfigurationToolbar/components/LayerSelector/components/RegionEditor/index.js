import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Box } from '@material-ui/core'
import { get, map, find } from 'lodash'
import { useParams } from 'react-router-dom'
import { Button, CircularProgress, DropdownMenu } from 'ambient_ui'
import {
  fetchRegionsRequested,
  updateStreamRegionRequested,
} from 'features/StreamConfiguration/streamConfigurationSlice'

export default function RegionEditor() {
  const dispatch = useDispatch()
  const { account } = useParams()

  const activeStream = useSelector(
    state => state.streamConfiguration.activeStream,
  )
  const streamRegionLoading = useSelector(
    state => state.streamConfiguration.streamRegionLoading,
  )
  const regions = useSelector(state => state.streamConfiguration.regions)
  const globalSelectedSite = useSelector(state => state.settings.selectedSite)
  const site = useSelector(state => state.streamConfiguration.sites)
  const defaultSlug = get(site, '[0].slug', null)

  // fetch regions on first render
  useEffect(() => {
    dispatch(
      fetchRegionsRequested({
        accountSlug: account,
        siteSlug: globalSelectedSite || defaultSlug,
      }),
    )
  }, [])
  // set local state
  const [showEditor, setShowEditor] = useState(false)
  const [selectedRegionId, setSelectedRegionId] = useState(
    get(activeStream, 'region.id'),
  )

  // format dropdown
  const regionOptions = map(regions, ({ name, id }) => ({
    label: name,
    value: id,
  }))

  // handle selection
  const handleSelection = selection => {
    if (selection) {
      setSelectedRegionId(selection.value)
    }
  }

  const saveRegion = () => {
    dispatch(
      updateStreamRegionRequested({
        streamId: activeStream.id,
        regionId: selectedRegionId,
      }),
    )
    setShowEditor(false)
  }

  const activeStreamRegionName = get(activeStream, 'region.name')
  return (
    <Box p={2}>
      {streamRegionLoading && <CircularProgress size={14} />}
      {!showEditor && !streamRegionLoading && (
        <Box
          display='flex'
          flexDirection='row'
          justifyContent='space-between'
          alignItems='center'
        >
          <span>{activeStreamRegionName || 'No region associated'}</span>
          <Button variant='text' onClick={() => setShowEditor(true)}>
            {activeStreamRegionName ? 'Edit' : 'Add'}
          </Button>
        </Box>
      )}
      {showEditor && (
        <Box>
          <DropdownMenu
            menuItems={regionOptions}
            selectedItem={find(regionOptions, { value: selectedRegionId })}
            handleSelection={handleSelection}
          />
          <Box
            display='flex'
            flexDirection='row'
            justifyContent='flex-end'
            alignItems='center'
            mt={2}
          >
            <Button variant='text' onClick={() => setShowEditor(false)}>
              Cancel
            </Button>
            <Button onClick={saveRegion}>Save</Button>
          </Box>
        </Box>
      )}
    </Box>
  )
}
