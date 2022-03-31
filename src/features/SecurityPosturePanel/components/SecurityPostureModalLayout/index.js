import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { useTheme, withStyles } from '@material-ui/core/styles'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { TextField, Typography, Grid } from '@material-ui/core'
import { Button, SearchableSelectDropdown, CircularProgress } from 'ambient_ui'
import Check from 'ambient_ui/components/icons/contents/Check'
// src
import MuiAccordion from '@material-ui/core/Accordion'
import MuiAccordionSummary from '@material-ui/core/AccordionSummary'
import MuiAccordionDetails from '@material-ui/core/AccordionDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import sortBy from 'lodash/sortBy'
import find from 'lodash/find'
import uniqBy from 'lodash/uniqBy'
import isEmpty from 'lodash/isEmpty'

import StreamCheckboxTree from '../StreamCheckboxTree'
import {
  selectSite,
  selectThreat,
  getAllThreatSignaturesBySiteRequested,
  getStreamsWithThreatSignatureRequested,
  createThreatSignaturePausePeriodRequested,
  toggleModal,
} from '../../securityPosturePanelSlice'

import useStyles from './styles'

const SecurityPostureModalLayout = () => {
  const { palette } = useTheme()
  const { account } = useParams()
  const dispatch = useDispatch()
  const sites = useSelector(state => state.operatorPage.sites)
  const selectedSite = useSelector(
    state => state.securityPosturePanel.selectedSite,
  )
  const darkMode = useSelector(state => state.settings.darkMode)
  const loading = useSelector(state => state.securityPosturePanel.loading)
  const classes = useStyles({ darkMode })
  const siteThreatSignatures = useSelector(
    state => state.securityPosturePanel.siteThreatSignatures,
  )
  const selectedThreatSignature = useSelector(
    state => state.securityPosturePanel.selectedThreatSignature,
  )
  const streamsWithThreatSignature = useSelector(
    state => state.securityPosturePanel.streamsWithThreatSignature,
  )
  const isLoading = useSelector(state => state.securityPosturePanel.loading)
  const [checkedStreams, setCheckedStreams] = useState([])
  const [duration, setDuration] = useState(0)
  const [expanded, setExpanded] = useState('panel1')
  const [description, setDescription] = useState(null)
  const modalOpened = useSelector(
    state => state.securityPosturePanel.modalOpened,
  )
  const [menuTarget, setMenuTarget] = useState(
    document.querySelectorAll('[role="presentation"]')[0],
  )

  const handleChange = panel => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false)
  }

  useEffect(() => {
    setMenuTarget(document.querySelectorAll('[role="presentation"]')[0])
  }, [modalOpened, setMenuTarget])

  const Accordion = useMemo(() => {
    if (darkMode) {
      return withStyles({
        root: {
          borderBottom: '1px solid',
          borderColor: palette.grey[800],
          boxShadow: 'none',
          '&:last-child': {
            borderBottom: 0,
          },
          '&:before': {
            display: 'none',
          },
          '&$expanded': {
            margin: 'auto',
          },
          color: palette.grey[800],
          backgroundColor: palette.grey[900],
        },
        expanded: {},
      })(MuiAccordion)
    }
    return withStyles({
      root: {
        borderBottom: '1px solid rgba(0, 0, 0, .125)',
        boxShadow: 'none',
        '&:last-child': {
          borderBottom: 0,
        },
        '&:before': {
          display: 'none',
        },
        '&$expanded': {
          margin: 'auto',
        },
      },
      expanded: {},
    })(MuiAccordion)
  }, [darkMode])

  const AccordionSummary = useMemo(() => {
    if (darkMode) {
      return withStyles({
        root: {
          backgroundColor: palette.grey[900],
          color: darkMode ? palette.common.white : palette.common.black,
          minHeight: 56,
          '&$expanded': {
            minHeight: 56,
          },
        },
        content: {
          '&$expanded': {
            margin: '12px 0',
          },
        },
        expanded: {},
      })(MuiAccordionSummary)
    }
    return withStyles({
      root: {
        backgroundColor: 'rgba(0, 0, 0, .03)',
        minHeight: 56,
        '&$expanded': {
          minHeight: 56,
        },
      },
      content: {
        '&$expanded': {
          margin: '12px 0',
        },
      },
      expanded: {},
    })(MuiAccordionSummary)
  }, [darkMode])

  const AccordionDetails = useMemo(() => {
    return withStyles(theme => ({
      root: {
        padding: '0px, 16px, 16px, 16px',
      },
    }))(MuiAccordionDetails)
  }, [])

  const siteOptions = useMemo(
    () =>
      sites
        ? sortBy(
            sites.map(site => ({
              value: site.slug,
              label: site.name,
            })),
            o => o.label.toLowerCase(),
          )
        : [],
    [sites],
  )

  const threatOptions = useMemo(
    () =>
      siteThreatSignatures
        ? sortBy(
            siteThreatSignatures.map(threat => ({
              value: threat.id,
              label: threat.name,
            })),
            o => o.label.toLowerCase(),
          )
        : [],
    [siteThreatSignatures],
  )

  const handleSiteSelect = useCallback(
    option => {
      dispatch(selectSite({ site: option.value }))
      dispatch(
        getAllThreatSignaturesBySiteRequested({
          accountSlug: account,
          siteSlug: option.value,
        }),
      )
      setCheckedStreams([])
    },
    [dispatch, account],
  )

  const siteSelected = option => {
    handleSiteSelect(option)
    setExpanded('panel2')
  }

  const durationOptions = [
    {
      value: 15,
      label: `15 minutes`,
    },
    {
      value: 30,
      label: `30 minutes`,
    },
    {
      value: 60,
      label: `1 hour`,
    },
    {
      value: 120,
      label: `2 hours`,
    },
  ]

  const handleDurationSelect = value => {
    setDuration(value)
    setExpanded('panel4')
  }

  const durationSelected = option => {
    handleDurationSelect(option.value)
  }

  const handleThreatSelect = useCallback(
    option => {
      dispatch(selectThreat({ threat: option.value }))
      dispatch(
        getStreamsWithThreatSignatureRequested({
          accountSlug: account,
          threatSignatureId: option.value,
          siteSlugs: [selectedSite],
        }),
      )
      setCheckedStreams([])
    },
    [dispatch, account, selectedSite],
  )

  const threatSignatureSelected = option => {
    handleThreatSelect(option)
    setExpanded('panel3')
  }

  const handleClose = () => {
    dispatch(toggleModal())
  }

  const onClickCancel = () => {
    handleClose()
  }

  const handleCreatePause = useCallback(
    input => {
      dispatch(createThreatSignaturePausePeriodRequested(input))
    },
    [dispatch],
  )

  const onYesClick = () => {
    // const today = new Date()
    // const startTime = getUnixTime(today)
    // const endTime = getUnixTime(addMinutes(today, duration))
    setExpanded(null)
    const streams = checkedStreams.map(item => {
      return parseInt(item.replace('stream_', ''), 10)
    })
    const input = {
      threatSignatureId: selectedThreatSignature,
      streamIds: isEmpty(streams) ? null : streams,
      accountSlug: account,
      siteSlug: selectedSite,
      duration: duration * 60,
      description,
    }
    handleCreatePause(input)
  }

  const isChecked = checked => {
    setCheckedStreams(checked)
  }

  const displayDuration = () => {
    const hours = Math.floor(duration / 60)
    if (hours > 0) {
      if (hours > 1) {
        return `${hours} hours`
      }
      return `${hours} hour`
    }
    return `${duration} minutes`
  }

  const streamsLabel = useMemo(() => {
    if (!isEmpty(checkedStreams)) {
      if (checkedStreams.length > 1) {
        return `${checkedStreams.length} Streams Selected`
      }
      return `${checkedStreams.length} Stream Selected`
    }
    return 'Select Streams:'
  }, [checkedStreams])

  const isNotOperator = () => (element, index, array) => {
    return !element.isOperator
  }

  const videoWalls = useMemo(() => {
    if (!isEmpty(streamsWithThreatSignature)) {
      return uniqBy(
        [].concat(
          [],
          ...streamsWithThreatSignature.map(({ streamFeeds }) => {
            return streamFeeds
              ? streamFeeds.map(streamFeed => {
                  return streamFeed.videoWall
                })
              : []
          }),
        ),
        e => {
          return e.id
        },
      ).filter(isNotOperator())
    }
    return []
  }, [streamsWithThreatSignature])

  const regions = useMemo(() => {
    if (!isEmpty(streamsWithThreatSignature)) {
      return uniqBy(
        []
          .concat(
            [],
            ...streamsWithThreatSignature.map(({ region }) => {
              return region
            }),
          )
          .filter(item => {
            return item != null
          }),
        e => {
          return e.id
        },
      )
    }
    return []
  }, [streamsWithThreatSignature])

  const containsId = (id, path) => (element, index, array) => {
    const found = find(element.streamFeeds, [path, id])
    return !!found
  }

  const regionFindId = id => (element, index, array) => {
    if (element.region) {
      return element.region.id === id
    }
    return false
  }

  const regionStreams = useMemo(() => {
    if (!isEmpty(streamsWithThreatSignature) && !isEmpty(regions)) {
      return regions.map(({ name, id }) => {
        const children = streamsWithThreatSignature
          .filter(regionFindId(id))
          .map(stream => {
            return {
              value: `stream_${stream.id}`,
              label: stream.name,
            }
          })
        return {
          value: `region_${id}`,
          label: name,
          children,
        }
      })
    }
    return []
  }, [streamsWithThreatSignature, regions])

  const videoWallStreams = useMemo(() => {
    if (!isEmpty(streamsWithThreatSignature) && !isEmpty(videoWalls)) {
      return videoWalls.map(({ name, id }) => {
        const children = streamsWithThreatSignature
          .filter(containsId(id, 'videoWall.id'))
          .map(stream => {
            return {
              value: `stream_${stream.id}`,
              label: stream.name,
            }
          })
        return {
          value: `videoWall_${id}`,
          label: name,
          children,
        }
      })
    }
    return []
  }, [streamsWithThreatSignature, videoWalls])

  const onDescriptionChange = e => {
    if (e.target.value === '') {
      setDescription(null)
    } else {
      setDescription(e.target.value)
    }
  }

  // const onDurationChange = e => {
  //   if (e.target.value === '') {
  //     setDuration(0)
  //   } else {
  //     setDuration(e.target.value)
  //   }
  // }

  return (
    <div className={classes.root}>
      <Typography className={classes.title} variant='h4'>
        Pause Threat Signature
      </Typography>
      <Grid container>
        <div className={classes.accordian}>
          <Accordion
            square
            expanded={expanded === 'panel1'}
            onChange={handleChange('panel1')}
          >
            <AccordionSummary
              aria-controls='panel1d-content'
              id='panel1d-header'
              expandIcon={<ExpandMoreIcon />}
            >
              <Typography>
                {selectedSite
                  ? `Selected Site: ${
                      siteOptions.find(item => item.value === selectedSite)
                        .label
                    }`
                  : 'Select Site:'}
              </Typography>
              <div className={classes.checkIcon}>
                {selectedSite ? (
                  <Check stroke={palette.primary.main} width={24} height={24} />
                ) : (
                  <></>
                )}
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <div className={classes.accordianDetails}>
                <SearchableSelectDropdown
                  menuPortalTarget={
                    document.querySelectorAll('[role="presentation"]')[0]
                  }
                  options={siteOptions}
                  onChange={siteSelected}
                  value={
                    selectedSite
                      ? siteOptions.find(item => item.value === selectedSite)
                          .label
                      : null
                  }
                />
              </div>
            </AccordionDetails>
          </Accordion>
          <Accordion
            square
            expanded={expanded === 'panel2'}
            onChange={handleChange('panel2')}
            disabled={!selectedSite}
          >
            <AccordionSummary
              aria-controls='panel2d-content'
              id='panel2d-header'
              expandIcon={<ExpandMoreIcon />}
            >
              <Typography>
                {selectedThreatSignature
                  ? `Threat Signature: ${
                      threatOptions.find(
                        item => item.value === selectedThreatSignature,
                      ).label
                    }`
                  : 'Select Threat Signature:'}
              </Typography>
              <div className={classes.checkIcon}>
                {selectedThreatSignature ? (
                  <Check stroke={palette.primary.main} width={24} height={24} />
                ) : (
                  <></>
                )}
              </div>
            </AccordionSummary>
            <AccordionDetails>
              {loading && (
                <div className={classes.progress}>
                  <CircularProgress size={30} />
                </div>
              )}
              {!loading && !isEmpty(threatOptions) && (
                <div className={classes.accordianDetails}>
                  <SearchableSelectDropdown
                    menuPortalTarget={menuTarget}
                    options={threatOptions}
                    onChange={threatSignatureSelected}
                    value={
                      selectedThreatSignature
                        ? threatOptions.find(
                            item => item.value === selectedThreatSignature,
                          ).label
                        : null
                    }
                  />
                </div>
              )}
              {!loading && isEmpty(threatOptions) && (
                <Typography>No Threat Signatures In Selected Site</Typography>
              )}
            </AccordionDetails>
          </Accordion>
          <Accordion
            square
            expanded={expanded === 'panel3'}
            onChange={handleChange('panel3')}
            disabled={!selectedThreatSignature}
          >
            <AccordionSummary
              aria-controls='panel3d-content'
              id='panel3d-header'
              expandIcon={<ExpandMoreIcon />}
            >
              <Typography>
                {duration >= 15
                  ? `Snooze for ${displayDuration()}`
                  : 'Input Duration:'}
              </Typography>
              <div className={classes.checkIcon}>
                {duration >= 15 ? (
                  <Check stroke={palette.primary.main} width={24} height={24} />
                ) : (
                  <></>
                )}
              </div>
            </AccordionSummary>
            <AccordionDetails>
              {/* <Grid item className={classes.input}>
                {/* 
                <TextInput
                  placeholder='Input Minutes'
                  type='number'
                  onChange={onDurationChange}
                /> 
                */}
              {/* <Input
                  classes={{
                    root: classes.input,
                    inputProps: classes.input,
                    InputProps: classes.input,
                  }}
                  placeholder='Input Minutes'
                  type='number'
                  onChange={onDurationChange}
                /> */}
              {/* </Grid> */}
              <div className={classes.accordianDetails}>
                <SearchableSelectDropdown
                  menuPortalTarget={
                    document.querySelectorAll('[role="presentation"]')[0]
                  }
                  options={durationOptions}
                  onChange={durationSelected}
                  value={
                    duration
                      ? durationOptions.find(item => item.value === duration)
                          .label
                      : null
                  }
                />
              </div>
              {/* <Grid item>
                <Typography className={classes.title} variant='h5'>
                  mins
                </Typography>
              </Grid> */}
            </AccordionDetails>
          </Accordion>
          <Accordion
            square
            expanded={expanded === 'panel4'}
            onChange={handleChange('panel4')}
            disabled={!selectedThreatSignature || duration === 0}
          >
            <AccordionSummary
              aria-controls='panel3d-content'
              id='panel3d-header'
              expandIcon={<ExpandMoreIcon />}
            >
              <Typography>Description:</Typography>
              <div className={classes.checkIcon}>
                {description ? (
                  <Check stroke={palette.primary.main} width={24} height={24} />
                ) : (
                  <></>
                )}
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <Grid item className={classes.textFieldGrid}>
                <TextField
                  placeholder='Description'
                  type='string'
                  onChange={onDescriptionChange}
                  className={classes.textField}
                  inputProps={{
                    className: classes.textFieldInput,
                  }}
                  InputProps={{
                    className: classes.textFieldInput,
                  }}
                  variant='outlined'
                />
              </Grid>
            </AccordionDetails>
          </Accordion>
          {streamsWithThreatSignature &&
            (!isEmpty(videoWallStreams) || !isEmpty(regionStreams)) && (
              <Accordion
                square
                expanded={expanded === 'panel5'}
                onChange={handleChange('panel5')}
                disabled={!selectedThreatSignature || duration === 0}
              >
                <AccordionSummary
                  aria-controls='panel3d-content'
                  id='panel3d-header'
                  expandIcon={<ExpandMoreIcon />}
                >
                  <Typography>{streamsLabel}</Typography>
                  <div className={classes.checkIcon}>
                    {!isEmpty(checkedStreams) ? (
                      <Check
                        stroke={palette.primary.main}
                        width={24}
                        height={24}
                      />
                    ) : (
                      <></>
                    )}
                  </div>
                </AccordionSummary>
                <AccordionDetails>
                  {loading && (
                    <div className={classes.progress}>
                      <CircularProgress size={30} />
                    </div>
                  )}
                  {streamsWithThreatSignature &&
                    (!isEmpty(videoWallStreams) || !isEmpty(regionStreams)) &&
                    !loading && (
                      <div className={classes.tree}>
                        <StreamCheckboxTree
                          videoWallStreams={videoWallStreams}
                          regionStreams={regionStreams}
                          isChecked={isChecked}
                          darkMode={darkMode}
                          checkedStreams={checkedStreams}
                        />
                      </div>
                    )}
                  {isEmpty(videoWallStreams) &&
                    isEmpty(regionStreams) &&
                    !loading && (
                      <Typography>
                        No Streams In Selected Threat Signature
                      </Typography>
                    )}
                </AccordionDetails>
              </Accordion>
            )}
        </div>
      </Grid>
      <Grid className={classes.btnContainer}>
        {duration !== 0 && duration < 15 && (
          <div className={classes.error}>
            Duration must be at least 15 minutes
          </div>
        )}
        <Button
          onClick={onClickCancel}
          variant='outlined'
          style={{ marginRight: 8 }}
        >
          Cancel
        </Button>
        <Button
          onClick={onYesClick}
          disabled={
            selectedThreatSignature === null ||
            selectedSite === null ||
            duration < 15 ||
            (streamsWithThreatSignature &&
              (!isEmpty(videoWallStreams) || !isEmpty(regionStreams)) &&
              isEmpty(checkedStreams)) ||
            isEmpty(description) ||
            loading
          }
          loading={isLoading}
        >
          Confirm
        </Button>
      </Grid>
    </div>
  )
}

export default SecurityPostureModalLayout
