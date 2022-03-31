import React, { useState, useMemo, useCallback } from 'react'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import { useSelector, useDispatch } from 'react-redux'
import get from 'lodash/get'
import find from 'lodash/find'
import keys from 'lodash/keys'
import map from 'lodash/map'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
// src
import { AlertLevelLabel, DropdownMenu, Button } from 'ambient_ui'
import { createAnalyticsConditionRequested } from 'redux/slices/analytics'
import { AlertStatusEnum, SeverityToReadableTextEnum } from 'enums'
import propTypes from '../../propTypes/metric'

import useStyles from './styles'

const ConditionsForm = ({ metric, onClose }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [formThreshold, setFormThreshold] = useState(metric.threshold)
  const [formCondition, setFormCondition] = useState(metric.condition)
  const [formShouldAlert, setFormShouldAlert] = useState(
    metric.alert && get(metric, 'alert.status') !== AlertStatusEnum.DELETED,
  )
  // TODO: Support custom names
  // const [formAlertName, setFormAlertName] = useState(get(metric, 'alert.name'))
  const [formAlertSeverity, setFormAlertSeverity] = useState(
    get(metric, 'alert.severity'),
  )
  const [formAlertIsTest, setFormAlertIsTest] = useState(
    get(metric, 'alert.status') === AlertStatusEnum.TEST,
  )

  const conditionTypes = useSelector(state => state.analytics.conditionTypes)
  const conditionOptions = useMemo(() => {
    return conditionTypes.map(({ key, name }) => {
      return {
        label: name,
        value: key,
      }
    })
  }, [conditionTypes])

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose()
    }
  }, [onClose])

  return (
    <Box m={2} maxWidth={600}>
      <Grid container>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <Box display='flex' flexDirection='row' alignItems='center'>
            <Box>
              <Typography>
                Violation occurs when
                {metric.metricType}
              </Typography>
            </Box>
            <Box>
              <DropdownMenu
                menuItems={conditionOptions}
                handleSelection={({ value }) => setFormCondition(value)}
                selectedItem={find(conditionOptions, { value: formCondition })}
              />
            </Box>
            <Box>
              <TextField
                value={formThreshold}
                label='Threshold'
                type='number'
                onChange={e => {
                  setFormThreshold(e.target.value)
                }}
              />
            </Box>
          </Box>
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formShouldAlert}
                onChange={e => {
                  setFormShouldAlert(e.target.checked)
                }}
                color='primary'
              />
            }
            label='Raise alert on violation'
          />
        </Grid>
        {formShouldAlert && (
          <>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Box display='flex' flexDirection='row' alignItems='center'>
                <Box mr={1.0}>Severity</Box>
                {map(keys(SeverityToReadableTextEnum), sev => {
                  const label = SeverityToReadableTextEnum[sev]
                  return (
                    <Box
                      onClick={() => {
                        setFormAlertSeverity(sev)
                      }}
                      style={{
                        cursor: 'pointer',
                      }}
                      className={
                        formAlertSeverity !== sev && classes.unselectedSev
                      }
                      key={`sev-${sev}`}
                    >
                      <AlertLevelLabel label={label} level={label} />
                    </Box>
                  )
                })}
              </Box>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formAlertIsTest}
                    onChange={e => {
                      setFormAlertIsTest(e.target.checked)
                    }}
                    color='primary'
                  />
                }
                label={
                  <Typography variant='subtitle1'>
                    This is a test alert
                  </Typography>
                }
              />
            </Grid>
          </>
        )}
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <Box display='flex' flexDirection='row'>
            <Box mr={0.5}>
              <Button
                onClick={() => {
                  dispatch(
                    createAnalyticsConditionRequested({
                      metricId: metric.id,
                      threshold: formThreshold,
                      condition: formCondition,
                      raiseAlert: formShouldAlert,
                      alertSeverity: formAlertSeverity,
                      alertIsTest: formAlertIsTest,
                    }),
                  )
                  handleClose()
                }}
                color='primary'
              >
                Save
              </Button>
            </Box>
            <Box>
              <Button onClick={handleClose} variant='outlined' color='default'>
                Cancel
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

ConditionsForm.propTypes = propTypes

export default ConditionsForm
