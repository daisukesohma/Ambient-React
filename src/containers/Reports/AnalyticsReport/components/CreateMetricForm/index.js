import React, { useState, useMemo, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { animateScroll as scroller } from 'react-scroll'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Chip from '@material-ui/core/Chip'
import Checkbox from '@material-ui/core/Checkbox'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Autocomplete from '@material-ui/lab/Autocomplete'
import get from 'lodash/get'
import find from 'lodash/find'
import map from 'lodash/map'
// src
import { DropdownMenu, Button, SearchableSelectDropdown } from 'ambient_ui'
import SimpleLabel from 'components/Label/SimpleLabel'
import { createAnalyticsMetricRequested } from 'redux/slices/analytics'
import useStyles from './styles'

const propTypes = {
  onCancel: PropTypes.func,
}

const defaultProps = {
  onCancel: () => {},
}

function CreateMetricForm({ onCancel }) {
  const dispatch = useDispatch()

  const metricTypes = useSelector(state => state.analytics.metricTypes)
  const threatSignatures = useSelector(
    state => state.analytics.threatSignatures,
  )
  const zones = useSelector(state => state.analytics.zones)
  const sites = useSelector(state => state.analytics.sites)
  const loadingCreateMetric = useSelector(state => state.loadingCreateMetric)
  const selectedDashboard = useSelector(
    state => state.analytics.selectedDashboard,
  )

  const [requestSent, setRequestSent] = useState(false)
  const [formMetricType, setFormMetricType] = useState(null)
  const [formName, setFormName] = useState(null)
  const [formChartType, setFormChartType] = useState(null)
  // Used by counter charts only
  const [formThreatSignature, setFormThreatSignature] = useState(null)
  const [formStreamIds, setFormStreamIds] = useState([])
  const [formSite, setFormSite] = useState(null)
  const [formIncludeZones, setIncludeZones] = useState(null)
  const [formExcludeZones, setExcludeZones] = useState(null)

  const classes = useStyles({ darkMode: false })

  const metricChartTypes = get(formMetricType, 'chartTypes', [])

  const chartTypeOptions = useMemo(
    () =>
      map(metricChartTypes, metricChartType => ({
        value: metricChartType,
        label: (
          <span>
            <SimpleLabel>Display</SimpleLabel>
            {metricChartType.name}
          </span>
        ),
      })),
    [metricChartTypes],
  )

  const threatSignatureOptions = useMemo(
    () =>
      map(threatSignatures, threatSignature => ({
        value: threatSignature.id,
        label: (
          <span>
            <SimpleLabel>of</SimpleLabel>
            {threatSignature.name}
          </span>
        ),
      })),
    [threatSignatures],
  )

  const metricTypeOptions = useMemo(
    () =>
      map(metricTypes, metricType => ({
        value: metricType,
        label: (
          <span>
            <SimpleLabel>Measure</SimpleLabel>
            {metricType.name}
          </span>
        ),
      })),
    [metricTypes],
  )

  const siteOptions = useMemo(
    () =>
      map(sites, site => ({
        value: site,
        label: (
          <span>
            <SimpleLabel>on</SimpleLabel>
            {site.name}
          </span>
        ),
        filterLabel: site.name,
      })),
    [sites],
  )

  const streams = get(formSite, 'streams', [])

  let submitEnabled = false
  if (formMetricType) {
    if (formMetricType.key === 'counter') {
      submitEnabled =
        !!formThreatSignature &&
        !!formStreamIds.length &&
        !!formName &&
        !!formSite &&
        !!formChartType
    } else {
      submitEnabled =
        !!formName && !!formStreamIds.length && !!formSite && !!formChartType
    }
  }

  useEffect(() => {
    if (requestSent && !loadingCreateMetric) {
      onCancel()
      scroller.scrollToBottom()
    }
  }, [loadingCreateMetric, requestSent, onCancel, dispatch])

  return (
    <Box
      className={classes.container}
      display='flex'
      flexDirection='column'
      justifyContent='space-between'
      alignItems='flex-start'
    >
      <Box mb={2} ml={1}>
        <Typography className='am-h5'>Create Metric</Typography>
      </Box>
      <Box width={1}>
        <Grid container>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Box ml={1} mr={1}>
              <TextField
                classes={{ root: classes.textFieldRoot }}
                fullWidth
                required
                label='Name'
                onChange={e => {
                  setFormName(e.target.value)
                }}
              />
            </Box>
          </Grid>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Box
              mt={2.0}
              display='flex'
              flexDirection='row'
              alignItems='center'
            >
              <Box flex={1}>
                <Typography className={classes.label}>Metric Type</Typography>
                <DropdownMenu
                  // darkMode={darkMode}
                  menuItems={metricTypeOptions}
                  handleSelection={o => {
                    setFormMetricType(o.value)
                  }}
                  selectedItem={find(metricTypeOptions, {
                    value: formMetricType,
                  })}
                />
              </Box>
              <Box flex={1}>
                {formMetricType && formMetricType.key === 'counter' && (
                  <>
                    <Typography className={classes.label}>Activity</Typography>
                    <DropdownMenu
                      // darkMode={darkMode}
                      menuItems={threatSignatureOptions}
                      handleSelection={o => {
                        setFormThreatSignature(o.value)
                      }}
                      selectedItem={find(threatSignatureOptions, {
                        value: formThreatSignature,
                      })}
                    />
                  </>
                )}
              </Box>
            </Box>
          </Grid>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Box
              mt={1.0}
              display='flex'
              flexDirection='row'
              alignItems='center'
            >
              <Box flex={1}>
                <>
                  <Typography className={classes.label}>
                    Display Type
                  </Typography>
                  <DropdownMenu
                    // darkMode={darkMode}
                    menuItems={chartTypeOptions}
                    handleSelection={o => {
                      setFormChartType(o.value)
                    }}
                    selectedItem={find(chartTypeOptions, {
                      value: formChartType,
                    })}
                  />
                </>
              </Box>
              <Box flex={1}>
                <Typography className={classes.label}>Site</Typography>
                <SearchableSelectDropdown
                  // darkMode={darkMode}
                  options={siteOptions}
                  onChange={o => {
                    setFormSite(o.value)
                    // Empty sites if selected before
                    setFormStreamIds([])
                  }}
                  value={find(siteOptions, { value: formSite })}
                />
              </Box>
            </Box>
          </Grid>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Box mt={2} ml={1} mr={1}>
              <Autocomplete
                multiple
                autoHighlight
                disableCloseOnSelect
                options={streams}
                getOptionLabel={stream => stream.name}
                onChange={(e, items, t) => {
                  setFormStreamIds(map(items, 'id'))
                }}
                renderTags={(value, getTagProps) =>
                  map(value, (stream, index) => (
                    <Chip
                      key={`stream-${index}`}
                      variant='contained'
                      size='small'
                      label={stream.name}
                      {...getTagProps({ index })}
                    />
                  ))
                }
                renderInput={params => (
                  <TextField
                    {...params}
                    label='Streams'
                    // placeholder='Streams'
                    classes={{ root: classes.textFieldRoot }}
                  />
                )}
                renderOption={(stream, { selected }) => (
                  <>
                    <Checkbox size='small' disableRipple checked={selected} />
                    <span>{stream.name}</span>
                  </>
                )}
              />
            </Box>
          </Grid>
          <Grid item lg={6} md={6} sm={6} xs={6}>
            <Box mt={2} ml={1} mr={1}>
              <Autocomplete
                multiple
                autoHighlight
                disableCloseOnSelect
                options={zones}
                getOptionLabel={zone => zone.name}
                onChange={(e, items, t) => setIncludeZones(map(items, 'id'))}
                renderTags={(value, getTagProps) =>
                  map(value, (zone, index) => (
                    <Chip
                      key={`includeZone-${index}`}
                      variant='contained'
                      size='small'
                      label={zone.name}
                      {...getTagProps({ index })}
                    />
                  ))
                }
                renderInput={params => (
                  <TextField
                    {...params}
                    label='Include Zones'
                    // placeholder='Streams'
                    classes={{ root: classes.textFieldRoot }}
                  />
                )}
                renderOption={(zone, { selected }) => (
                  <>
                    <Checkbox size='small' disableRipple checked={selected} />
                    <span>{zone.name}</span>
                  </>
                )}
              />
            </Box>
          </Grid>
          <Grid item lg={6} md={6} sm={6} xs={6}>
            <Box mt={2} ml={1} mr={1}>
              <Autocomplete
                multiple
                autoHighlight
                disableCloseOnSelect
                options={zones}
                getOptionLabel={zone => zone.name}
                onChange={(e, items, t) => setExcludeZones(map(items, 'id'))}
                renderTags={(value, getTagProps) =>
                  map(value, (zone, index) => (
                    <Chip
                      key={`excludeZone-${index}`}
                      variant='contained'
                      size='small'
                      label={zone.name}
                      {...getTagProps({ index })}
                    />
                  ))
                }
                renderInput={params => (
                  <TextField
                    {...params}
                    label='Exclude Zones'
                    // placeholder='Streams'
                    classes={{ root: classes.textFieldRoot }}
                  />
                )}
                renderOption={(zone, { selected }) => (
                  <>
                    <Checkbox size='small' disableRipple checked={selected} />
                    <span>{zone.name}</span>
                  </>
                )}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box
        display='flex'
        flexDirection='row'
        alignItems='flex-start'
        justifyContent='flex-end'
        mt={2}
        width={1}
      >
        <Box mr={2}>
          <Button variant='outlined' onClick={onCancel}>
            Cancel
          </Button>
        </Box>
        <Box mr={1.0}>
          <Button
            disabled={!submitEnabled}
            color='primary'
            variant='contained'
            onClick={() => {
              setRequestSent(true)
              dispatch(
                createAnalyticsMetricRequested({
                  dashboardId: selectedDashboard.id,
                  streamIds: formStreamIds,
                  name: formName,
                  metricType: get(formMetricType, 'key'),
                  chartType: get(formChartType, 'key'),
                  siteId: get(formSite, 'id'),
                  query:
                    get(formMetricType, 'key') === 'counter'
                      ? formThreatSignature
                      : 'person',
                  includeZones: formIncludeZones,
                  excludeZones: formExcludeZones,
                }),
              )
            }}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

CreateMetricForm.propTypes = propTypes
CreateMetricForm.defaultProps = defaultProps

export default CreateMetricForm
