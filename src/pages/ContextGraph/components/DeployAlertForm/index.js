import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Autocomplete from '@material-ui/lab/Autocomplete'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import { AlertLevelLabel, Button } from 'ambient_ui'

import map from 'lodash/map'
import join from 'lodash/join'

import {
  createAlertRequested,
  setCreateAlertOpen,
} from '../../../../redux/contextGraph/actions'

import { useStyles } from './styles'

const DeployAlertForm = () => {
  const classes = useStyles()
  const dispatch = useDispatch()

  const [selectedDefaultAlert, setSelectedDefaultAlert] = useState(null)

  const activeSecurityProfile = useSelector(
    state => state.contextGraph.activeProfile,
  )
  const defaultAlerts = useSelector(state => state.contextGraph.defaultAlerts)

  // NB: Autocomplete without multiple has issues
  // item.threatSignature.name}//
  return (
    <Paper className={classes.modal}>
      <Grid container>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <Autocomplete
            size='small'
            options={defaultAlerts}
            onChange={(e, defaultAlert, t) => {
              setSelectedDefaultAlert(defaultAlert)
            }}
            renderInput={params => (
              <TextField
                {...params}
                variant='standard'
                label='Threat Signature'
                fullWidth
              />
            )}
            getOptionLabel={option =>
              `#${option.id} (${option.severity}) ${option.threatSignature.name} on ${option.regions.length} semantic zones`
            }
          />
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          {selectedDefaultAlert && (
            <Box
              display='flex'
              flexDirection='row'
              alignItems='center'
              mt={2}
              mb={2}
            >
              <Box>
                <AlertLevelLabel
                  label={selectedDefaultAlert.severity}
                  level={
                    {
                      sev0: 'high',
                      sev1: 'medium',
                      sev2: 'low',
                    }[selectedDefaultAlert.severity]
                  }
                />
              </Box>
              <Box>
                {selectedDefaultAlert.threatSignature.name} on{' '}
                {join(map(selectedDefaultAlert.regions, 'name'), ', ')}
              </Box>
            </Box>
          )}
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <Box
            display='flex'
            flexDirection='row'
            alignItems='center'
            justifyContent='flex-end'
            mt={2}
          >
            <Box mr={1}>
              <Button
                variant='text'
                color='default'
                onClick={() => {
                  dispatch(setCreateAlertOpen(false))
                }}
              >
                Cancel
              </Button>
            </Box>
            <Box>
              <Button
                onClick={() => {
                  dispatch(
                    createAlertRequested({
                      defaultAlertId: selectedDefaultAlert.id,
                      securityProfileId: activeSecurityProfile.id,
                    }),
                  )
                }}
              >
                Deploy
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default DeployAlertForm
