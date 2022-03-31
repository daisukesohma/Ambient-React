import React, { useState, useEffect } from 'react'
// import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Typography, Grid, Input } from '@material-ui/core'
// import { Typography, Grid, Input } from '@material-ui/core'
import { Button, SearchableSelectDropdown } from 'ambient_ui'
// src

import {
  createCampaignRequested,
  createCampaignModalClose,
} from '../../../redux/dataInfraSlice'

import { modes } from './enums'
import useStyles from './styles'

const CreateCampaignModal = () => {
  // const { account } = useParams()
  const dispatch = useDispatch()
  const darkMode = useSelector(state => state.settings.darkMode)
  const modalOpened = useSelector(
    state => state.dataInfra.createCampaignModalOpened,
  )
  const classes = useStyles({ darkMode })

  const isLoading = useSelector(
    state => state.dataInfra.creatingCampaignLoading,
  )
  const threatSignatures = useSelector(
    state => state.dataInfra.threatSignatures,
  )
  const currentPage = useSelector(state => state.dataInfra.campaignCurrentPage)
  const limit = useSelector(state => state.dataInfra.campaignLimit)
  const campaignSwitch = useSelector(state => state.dataInfra.campaignSwitch)
  const [name, setName] = useState(null)
  const [mode, setMode] = useState(null)
  const [menuTarget, setMenuTarget] = useState(
    document.querySelectorAll('[role="presentation"]')[0],
  )

  const [modeOptions, setModeOptions] = useState([
    {
      value: null,
      label: 'Select Mode',
    },
  ])
  const [threatSignatureId, setThreatSignatureId] = useState(null)

  const [threatSignatureOptions, setThreatSignatureOptions] = useState([
    {
      value: null,
      label: 'Select Threat Signature',
    },
  ])

  useEffect(() => {
    setMenuTarget(document.querySelectorAll('[role="presentation"]')[0])
  }, [modalOpened, setMenuTarget])

  useEffect(() => {
    const formattedThreatSignatures = [
      ...threatSignatures.map(threat => {
        return {
          value: threat.id,
          label: threat.name,
        }
      }),
    ]
    setThreatSignatureOptions(formattedThreatSignatures)
  }, [threatSignatures, setThreatSignatureOptions])

  useEffect(() => {
    const options = [
      {
        value: modes.SOC_STRICT,
        label: modes.SOC_STRICT,
      },
      {
        value: modes.ALL,
        label: modes.ALL,
      },
    ]
    setModeOptions(options)
  }, [setModeOptions])

  const handleModeSelect = option => {
    setMode(option.value)
  }

  const handleNameChange = e => {
    setName(e.target.value)
  }

  const handleThreatSignatureSelect = option => {
    setThreatSignatureId(option.value)
  }

  const handleClose = () => {
    dispatch(createCampaignModalClose())
  }

  const onClickCancel = () => {
    handleClose()
  }

  const onYesClick = () => {
    dispatch(
      createCampaignRequested({
        name,
        threatSignatureId,
        mode,
        page: currentPage,
        limit,
        campaignSwitch,
      }),
    )
  }

  return (
    <div className={classes.root}>
      <Typography className={classes.title} variant='h4'>
        Create Campaign
      </Typography>
      <Grid container className={classes.rows}>
        <Grid className={classes.inputRow}>
          <Typography className={classes.label}>Name:</Typography>
          <div className={classes.fields}>
            <Input
              classes={{
                root: classes.input,
                inputProps: classes.input,
                InputProps: classes.input,
                underline: 'white',
              }}
              onChange={handleNameChange}
            />
          </div>
        </Grid>
        <Grid className={classes.inputRow}>
          <Typography className={classes.labelDropDown}>
            Threat Signature:
          </Typography>
          <div className={classes.fields}>
            <SearchableSelectDropdown
              menuPortalTarget={menuTarget}
              options={threatSignatureOptions}
              onChange={handleThreatSignatureSelect}
              value={threatSignatureOptions.filter(
                ({ value }) => value === threatSignatureId,
              )}
            />
          </div>
        </Grid>
        <Grid className={classes.inputRow}>
          <Typography className={classes.labelDropDown}>Mode:</Typography>
          <div className={classes.fields}>
            <SearchableSelectDropdown
              menuPortalTarget={menuTarget}
              options={modeOptions}
              onChange={handleModeSelect}
            />
          </div>
        </Grid>
      </Grid>
      <Grid className={classes.btnContainer}>
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
            !name ||
            name.length === 0 ||
            !mode ||
            !threatSignatureId ||
            isLoading
          }
          loading={isLoading}
        >
          Confirm
        </Button>
      </Grid>
    </div>
  )
}

export default React.forwardRef((props, ref) => (
  <CreateCampaignModal {...props} ref={ref} />
))
