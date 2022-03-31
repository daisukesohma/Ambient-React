import React, { useState, useEffect, useCallback } from 'react'
import { useTheme } from '@material-ui/core/styles'
import { useParams } from 'react-router-dom'
import Autocomplete from '@material-ui/lab/Autocomplete'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import Checkbox from '@material-ui/core/Checkbox'
import Divider from '@material-ui/core/Divider'
import TextField from '@material-ui/core/TextField'
import Chip from '@material-ui/core/Chip'
import { useSelector, useDispatch } from 'react-redux'
import { AlertLevelLabel, Button, Icon } from 'ambient_ui'
import clsx from 'clsx'

import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'
import filter from 'lodash/filter'
import sortBy from 'lodash/sortBy'
import find from 'lodash/find'
import some from 'lodash/some'
import map from 'lodash/map'
import get from 'lodash/get'

import {
  threatSignatureAutocompleteRequest,
  createDefaultAlertRequested,
  setCreateDefaultAlertOpen,
} from 'redux/contextGraph/actions'
import { useFlexStyles } from 'common/styles/commonStyles'

import useStyles from './styles'

const REGION_DELIMITER = 'on'

const CreateAlertForm = () => {
  const { palette } = useTheme()
  const classes = useStyles()
  const flexClasses = useFlexStyles()
  const dispatch = useDispatch()
  const { account } = useParams()
  const isInternal = useSelector(state => state.auth.user.internal)
  const [currentTerms, setCurrentTerms] = useState([])
  const [regionDelimiterIndex, setRegionDelimiterIndex] = useState(null)
  const [selectedRegions, setSelectedRegions] = useState([])
  const [selectedSev, setSelectedSev] = useState(null)
  const [selectedAccountSlug, setSelectedAccountSlug] = useState(account)
  const [matchingAlerts, setMatchingAlerts] = useState()
  const [needsCheck, setNeedsCheck] = useState(false)
  const [isExactAlertMatch, setIsExactAlertMatch] = useState(false)

  // existing alerts
  const {
    defaultAlerts,
    autocompleteFlat,
    autocompleteTerms,
    autocompleteLoading,
    autocompleteThreatSignature,
  } = useSelector(state => state.contextGraph)

  const existingAlerts = map(defaultAlerts, a => {
    return {
      threatSignatureId: a.threatSignature.id,
      regionIds: map(a.regions, 'id'),
      severity: a.severity,
    }
  })

  const regions = useSelector(state => state.contextGraph.regions)
  const activeProfile = useSelector(state => state.contextGraph.activeProfile)

  const sevs = [
    { name: 'high', label: 'High', value: 'sev0' },
    { name: 'medium', label: 'Medium', value: 'sev1' },
    { name: 'low', label: 'Low', value: 'sev2' },
  ]

  const ALL_REGIONS = 'All regions'

  useEffect(() => {
    dispatch(
      threatSignatureAutocompleteRequest({
        terms: currentTerms,
        flat: autocompleteFlat,
      }),
    )
  }, [currentTerms, autocompleteFlat, dispatch])

  const icon = <CheckBoxOutlineBlankIcon fontSize='small' />
  const checkedIcon = <CheckBoxIcon fontSize='small' />

  const isRegionMode = regionDelimiterIndex !== null

  const autocompleteOptions = () => {
    if (autocompleteThreatSignature) {
      if (isRegionMode) {
        const allRegions = map(regions, 'name')
        const sorted = allRegions ? allRegions.slice().sort() : []

        return [ALL_REGIONS, ...sorted]
      }
      return [REGION_DELIMITER]
    }
    return autocompleteTerms ? autocompleteTerms.slice().sort() : []
  }

  const getIdsFromSelected = useCallback((selected, allRegions) => {
    if (some(selected, r => r === ALL_REGIONS)) {
      return map(allRegions, 'id')
    }
    return map(selected, r => _getRegionIdsFromName(r, allRegions))
  }, [])

  // Validate if there is a matching Alert
  //
  // checks for threat id and region ids matching => matchingAlerts
  // and sets state with matching alert if there is one
  const checkIfExisting = useCallback(() => {
    const selectedRegionIds = getIdsFromSelected(selectedRegions, regions)
    const isMatching = filter(existingAlerts, existing => {
      return (
        isEqual(sortBy(existing.regionIds), sortBy(selectedRegionIds)) &&
        existing.threatSignatureId === get(autocompleteThreatSignature, 'id')
      )
    })

    if (isMatching) {
      setMatchingAlerts(isMatching)
      return true
    }

    return false
  }, [
    getIdsFromSelected,
    selectedRegions,
    regions,
    existingAlerts,
    autocompleteThreatSignature,
  ])

  // then if there is a matching alert, when severity is selected, it checks the sev
  //

  const checkIfExistingSev = useCallback(() => {
    return !!(
      matchingAlerts &&
      selectedSev &&
      some(matchingAlerts, { severity: selectedSev.value })
    )
  }, [matchingAlerts, selectedSev])

  // this is triggered on all selections to run the checking function and set state
  useEffect(() => {
    if (
      needsCheck &&
      !autocompleteLoading &&
      autocompleteThreatSignature &&
      selectedRegions.length > 0
    ) {
      const isExisting = checkIfExisting()
      if (isExisting) {
        if (checkIfExistingSev()) {
          setIsExactAlertMatch(true)
        } else {
          setIsExactAlertMatch(false)
        }
      }
      setNeedsCheck(false)
    }
  }, [
    needsCheck,
    autocompleteThreatSignature,
    currentTerms,
    selectedRegions,
    selectedSev,
    checkIfExistingSev,
    checkIfExisting,
    autocompleteLoading,
  ])

  // NB: @Vikesh: Yes, this is complex and non-ideal. This complexity will be removed
  // and its remnants will be moved to the backend once the generalized grammar
  // matures.
  const handleChange = (e, items, t) => {
    // e is event
    // items is a list of items, ie.  ["Animal Presence", "on", "Emergency Exit"]
    // t is internal name of action on the autocomplete. 'clear', 'remove-option', 'select-option'

    // Clear all set values, reset
    if (t === 'clear' || isEmpty(items)) {
      setCurrentTerms([])
      setRegionDelimiterIndex(null)
      setSelectedRegions([])
      return
    }

    // ensure we check
    setNeedsCheck(true)

    if (t === 'remove-option') {
      setSelectedSev(null)
    }

    // If already in regionMode and "on" is deleted
    // if in region selection and delete the "on" text
    if (
      isRegionMode &&
      regionDelimiterIndex === items.length &&
      t === 'remove-option'
    ) {
      setRegionDelimiterIndex(null)
      return
    }

    if (autocompleteThreatSignature) {
      if (regionDelimiterIndex) {
        // If TS is set and regionMode and entered a region, set regions selected
        const getRegionsFromItems = itemList => {
          return itemList.slice(regionDelimiterIndex + 1)
        }
        const selected = getRegionsFromItems(items)
        setSelectedRegions(selected)
        return
      }
      const indexOfEndOfTerms = items.length - 1
      setRegionDelimiterIndex(indexOfEndOfTerms)
      return
    }

    // If TS not complete, set items for autocomplete
    setCurrentTerms(items)
  }

  const _getRegionIdsFromName = (name, allRegions) => {
    return get(find(allRegions, { name }), 'id')
  }

  const handleSubmit = () => {
    dispatch(
      createDefaultAlertRequested({
        threatSignatureId: autocompleteThreatSignature.id,
        securityProfileId: activeProfile.id,
        regionIds: getIdsFromSelected(selectedRegions, regions),
        severity: selectedSev && selectedSev.value,
        accountSlug: selectedAccountSlug,
      }),
    )
  }

  const getHelperText = () => {
    if (!autocompleteThreatSignature) {
      return 'Select a threat signature.'
    }
    if (regionDelimiterIndex && isEmpty(selectedRegions)) {
      return 'Select one or more regions to apply this threat to.'
    }
    if (!isEmpty(selectedRegions)) {
      return 'Definition complete. Add another region or continue below.'
    }
    return ''
  }

  const renderDefinitionWorkflowStatus = () => {
    let status
    if (isExactAlertMatch) {
      status = (
        <span className={clsx('am-overline', classes.warningText)}>
          This threat signature already exists.
        </span>
      )
    } else if (autocompleteThreatSignature && selectedRegions.length > 0) {
      if (selectedSev) {
        status = (
          <span
            className={clsx(
              'am-overline',
              classes.validText,
              flexClasses.row,
              flexClasses.centerStart,
            )}
          >
            <Icon icon='checkCircle' size={18} color={palette.primary[300]} />
            <span style={{ marginLeft: 8 }}>
              This is a new valid threat signature.
            </span>
          </span>
        )
      } else {
        status = (
          <span className='am-overline'>
            Select a severity level for this threat signature
          </span>
        )
      }
    }

    return <span style={{ height: 24 }}>{status}</span>
  }

  // for conditional rendering
  const hasCompleteDefinitionBeforeSev =
    autocompleteThreatSignature && selectedRegions.length > 0
  const hasCompleteDefinitionAfterSev =
    hasCompleteDefinitionBeforeSev && selectedSev

  return (
    <Paper className={classes.modal}>
      <Grid container>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <Box mb={3.5}>
            <Autocomplete
              multiple
              size='small'
              autoHighlight
              options={autocompleteOptions()}
              loading={autocompleteLoading}
              onChange={handleChange}
              renderInput={params => (
                <TextField
                  {...params}
                  variant='standard'
                  label='Threat Signature Definition'
                  placeholder='Action'
                  helperText={getHelperText()}
                  fullWidth
                />
              )}
              renderTags={(tagValue, getTagProps) =>
                map(tagValue, (item, index) => (
                  <Chip
                    key={`tag-${index}`}
                    label={item}
                    {...getTagProps({ index })}
                    onDelete={null}
                  />
                ))
              }
              renderOption={(item, { selected }) => {
                if (isRegionMode) {
                  return (
                    <>
                      <Checkbox
                        size='small'
                        disableRipple
                        icon={icon}
                        checkedIcon={checkedIcon}
                        className={classes.renderCheckbox}
                        checked={selected}
                      />
                      <span className='am-subtitle2'>
                        {item}
                      </span>
                    </>
                  )
                }
                return (
                  <span className='am-subtitle2'>
                    {item}
                  </span>
                )
              }}
            />
          </Box>
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          {hasCompleteDefinitionBeforeSev && (
            <Box
              display='flex'
              flexDirection='row'
              alignItems='center'
              mb={2.0}
            >
              {map(sevs, (sev, index) => (
                <Box
                  className={
                    selectedSev && selectedSev.value === sev.value
                      ? classes.selectedSev
                      : classes.unselectedSev
                  }
                  onClick={() => {
                    setNeedsCheck(true)
                    setSelectedSev(sev)
                  }}
                  style={{
                    cursor: 'pointer',
                  }}
                  key={`sev-${index}`}
                >
                  <AlertLevelLabel level={sev.name} label={sev.label} />
                </Box>
              ))}
            </Box>
          )}
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <Box display='flex' flexDirection='row' alignItems='center' mb={2.0}>
            {renderDefinitionWorkflowStatus}
          </Box>
        </Grid>
      </Grid>
      {hasCompleteDefinitionAfterSev && (
        <Box mt={2} mb={2}>
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  disabled={!isInternal}
                  checked={Boolean(selectedAccountSlug === null)}
                  onChange={e => {
                    setSelectedAccountSlug(selectedAccountSlug ? null : account)
                  }}
                />
              }
              label={<span className='am-subtitle2'>Public</span>}
            />
          </Box>
          <Box>
            {!selectedAccountSlug ? (
              <div className='am-caption'>
                Public signatures are part of the Ambient library and can be
                applied on any account and any site.
              </div>
            ) : (
              <div className='am-caption'>
                Private. This threat signature definition will be available only
                on sites within the {account} account.
              </div>
            )}
          </Box>
        </Box>
      )}
      <Divider
        variant='fullWidth'
        light
        classes={{ root: classes.dividerRoot }}
      />
      <Box
        display='flex'
        flexDirection='row'
        alignItems='center'
        justifyContent='flex-end'
        mt={2}
      >
        <Box mr={1}>
          <Button
            color='default'
            onClick={() => {
              dispatch(setCreateDefaultAlertOpen(false))
            }}
          >
            Cancel
          </Button>
        </Box>
        <Box mr={1}>
          <Button
            disabled={
              !selectedSev || !autocompleteThreatSignature || isExactAlertMatch
            }
            onClick={handleSubmit}
          >
            Create
          </Button>
        </Box>
        <Box mr={1}>
          <Button
            disabled
            variant='contained'
            onClick={() => {
              // TODO
            }}
          >
            Create & Deploy
          </Button>
        </Box>
      </Box>
    </Paper>
  )
}

export default CreateAlertForm
