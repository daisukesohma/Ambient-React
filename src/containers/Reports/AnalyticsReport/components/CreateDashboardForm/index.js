import React, { useState } from 'react'
import { useDispatch, batch } from 'react-redux'
import { useParams } from 'react-router-dom'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
// src
import { Button } from 'ambient_ui'
import {
  createAnalyticsDashboardRequested,
  setCreateDashboardOpen,
} from 'redux/slices/analytics'
import useStyles from './styles'

export default function CreateDashboardForm() {
  const classes = useStyles()
  const dispatch = useDispatch()
  const { account } = useParams()
  const [formName, setFormName] = useState(null)
  const [formDescription, setFormDescription] = useState(null)

  return (
    <Paper className={classes.modal}>
      <Grid container>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <TextField
            fullWidth
            required
            label='Name'
            onChange={e => {
              setFormName(e.target.value)
            }}
          />
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <TextField
            fullWidth
            multiline
            label='Description'
            onChange={e => {
              setFormDescription(e.target.value)
            }}
          />
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <Box
            display='flex'
            flexDirection='row'
            mt={1.5}
            justifyContent='flex-end'
          >
            <Box>
              <Button
                variant='contained'
                color='primary'
                onClick={() => {
                  batch(() => {
                    dispatch(
                      createAnalyticsDashboardRequested({
                        accountSlug: account,
                        name: formName,
                        description: formDescription,
                      }),
                    )
                    dispatch(
                      setCreateDashboardOpen({ createDashboardOpen: false }),
                    )
                  })
                }}
              >
                Save
              </Button>
            </Box>
            <Box ml={1.0}>
              <Button
                variant='contained'
                onClick={() => {
                  dispatch(
                    setCreateDashboardOpen({ createDashboardOpen: false }),
                  )
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  )
}
