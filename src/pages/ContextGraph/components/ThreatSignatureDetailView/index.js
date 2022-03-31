import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import { useSelector, useDispatch } from 'react-redux'
import clsx from 'clsx'
import get from 'lodash/get'
import map from 'lodash/map'
import Input from '@material-ui/core/Input'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import InputAdornment from '@material-ui/core/InputAdornment'
import FormControl from '@material-ui/core/FormControl'
import Divider from '@material-ui/core/Divider'
// src
import {
  deleteAlertRequested,
  updateAlertSnoozeRequest,
} from 'redux/contextGraph/actions'
import ConfirmDialog from 'components/ConfirmDialog'
import { Can } from 'rbac'

import TitleBar from './components/TitleBar'
import CamerasCard from './components/CamerasCard'
import useStyles from './styles'

const ThreatSignatureDetailView = ({ onCancel }) => {
  const darkMode = useSelector(state => state.settings.darkMode)
  const detailedAlert = useSelector(state => state.contextGraph.detailed)
  const [autoSnoozeSecs, setAutoSnoozeSecs] = useState(
    detailedAlert.autoSnoozeSecs,
  )
  const [deleteModalOpened, setDeleteModalOpened] = useState(false)

  const selectedRegions = get(detailedAlert, 'defaultAlert.regions', [])

  const deleteLoading = useSelector(state => state.contextGraph.deleteLoading)

  const classes = useStyles({ darkMode })
  const dispatch = useDispatch()

  if (!detailedAlert) {
    return null
  }

  const closeDetailedView = () => {
    if (onCancel) {
      onCancel()
    }
  }

  return (
    <Box
      className={classes.root}
      classes={{ root: classes.boxRoot }}
      style={{ maxWidth: 512 }}
      id='threat-signature-detail-view'
    >
      <ConfirmDialog
        open={deleteModalOpened}
        onClose={() => {
          setDeleteModalOpened(false)
        }}
        onConfirm={() => {
          dispatch(deleteAlertRequested({ id: detailedAlert.id }))
          setDeleteModalOpened(false)
          closeDetailedView()
        }}
        loading={deleteLoading}
        content={
          <div>
            Are you sure you want to delete this alert? This cannot be undone.
          </div>
        }
      />
      <Grid container style={{ padding: 16 }}>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <TitleBar />
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <Box mt={0.5} mb={2}>
            <Divider variant='fullWidth' light />
          </Box>
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          {map(selectedRegions, region => (
            <CamerasCard key={`selected-region-${region.id}`} region={region} />
          ))}
        </Grid>
      </Grid>
      <Can I='update' on='ContextGraph'>
        <div className={classes.regionsWrapper}>
          <div className={clsx('am-overline', classes.sectionTitle)}>
            Configuration
          </div>
          <div className={classes.paramWrapper}>
            <p>Snooze Time</p>
            <FormControl className={classes.textField}>
              <Input
                id='standard-adornment-weight'
                className={classes.textInput}
                value={autoSnoozeSecs}
                disableUnderline
                type='number'
                onChange={e => {
                  setAutoSnoozeSecs(e.currentTarget.value)
                  dispatch(
                    updateAlertSnoozeRequest({
                      alertId: detailedAlert.id,
                      autoSnoozeSecs: e.currentTarget.value,
                    }),
                  )
                }}
                endAdornment={
                  <InputAdornment
                    disableTypography
                    position='end'
                    className={classes.textInput}
                  >
                    secs
                  </InputAdornment>
                }
                aria-describedby='standard-weight-helper-text'
                inputProps={{
                  'aria-label': 'Snooze Time',
                }}
              />
            </FormControl>
          </div>
        </div>

        <Grid
          container
          direction='row'
          justify='space-between'
          alignItems='center'
          className={classes.footerWrapper}
        >
          <Grid item>
            <Button
              onClick={() => {
                setDeleteModalOpened(true)
              }}
              className={classes.deleteButton}
            >
              Delete
            </Button>
          </Grid>
        </Grid>
      </Can>
    </Box>
  )
}

ThreatSignatureDetailView.propTypes = {
  onCancel: PropTypes.func,
}

export default ThreatSignatureDetailView
