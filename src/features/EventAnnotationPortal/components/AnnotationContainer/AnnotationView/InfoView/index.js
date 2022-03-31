import React from 'react'
import { Typography } from '@material-ui/core'
import Select from '@material-ui/core/Select'
import Chip from '@material-ui/core/Chip'
import Input from '@material-ui/core/Input'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import clsx from 'clsx'
import { LabelledSliderSwitch } from 'ambient_ui'
import { useSelector, useDispatch, batch } from 'react-redux'
import { useTheme } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'

import {
  setCurrentEventAnnotationFailureModes,
  setCurrentEventAnnotationLabel,
  setCurrentEventAnnotationOther,
  setIsNormalView,
} from '../../../../redux/eventAnnotationPortalSlice'

import { stringToFailureMode, failureModeToString } from '../../../utils/index'

import useStyles from './styles'

function getStyles(id, failureModes, theme) {
  const failureModesIds = failureModes.map(failureMode => failureMode.id)
  return {
    fontWeight:
      failureModesIds.indexOf(id) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  }
}

function InfoView() {
  const dispatch = useDispatch()
  const theme = useTheme()
  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({ darkMode })

  const ITEM_HEIGHT = 48
  const ITEM_PADDING_TOP = 8
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  }

  const isNormalView = useSelector(
    state => state.eventAnnotationPortal.isNormalView,
  )
  const currentEventAnnotationLabel = useSelector(
    state => state.eventAnnotationPortal.currentEventAnnotationLabel,
  )
  const currentEventAnnotationValidFailureModes = useSelector(
    state =>
      state.eventAnnotationPortal.currentEventAnnotationValidFailureModes,
  )
  const currentEventAnnotationFailureModes = useSelector(
    state => state.eventAnnotationPortal.currentEventAnnotationFailureModes,
  )
  const currentEventAnnotationThreatSignature = useSelector(
    state => state.eventAnnotationPortal.currentEventAnnotationThreatSignature,
  )
  const currentEventAnnotationOther = useSelector(
    state => state.eventAnnotationPortal.currentEventAnnotationOther,
  )

  const handleFailureModesChange = event => {
    dispatch(
      setCurrentEventAnnotationFailureModes({
        currentEventAnnotationFailureModes: event.target.value,
      }),
    )
  }

  const handleOtherChange = event => {
    dispatch(
      setCurrentEventAnnotationOther({
        currentEventAnnotationOther: event.target.value,
      }),
    )
  }

  const handleViewChange = newView => {
    dispatch(setIsNormalView({ isNormalView: newView }))
  }

  const handleLabelChange = newLabel => {
    batch(() => {
      if (newLabel === true) {
        dispatch(
          setCurrentEventAnnotationOther({
            currentEventAnnotationOther: '',
          }),
        )
        dispatch(
          setCurrentEventAnnotationFailureModes({
            currentEventAnnotationFailureModes: [],
          }),
        )
      }
      dispatch(setCurrentEventAnnotationLabel({ label: newLabel }))
    })
  }

  return (
    <div style={{ flex: 1, boxSizing: 'border-box' }}>
      <div className={classes.eventContainer}>
        <Typography className={clsx('am-subtitle3', classes.label)}>
          Event
        </Typography>
      </div>
      <div className={classes.threatSignatureName}>
        <Typography className={clsx('am-h4', classes.id)}>
          {currentEventAnnotationThreatSignature.name}
        </Typography>
      </div>
      <div className={classes.labelContainer}>
        <Typography className={clsx('am-subtitle3', classes.label)}>
          View
        </Typography>
        <LabelledSliderSwitch
          checked={isNormalView}
          onClick={() => handleViewChange(!isNormalView)}
          darkIconContent={'Normal'}
          lightIconContent={'SPE'}
        />
      </div>
      <div className={classes.labelContainer}>
        <Typography className={clsx('am-subtitle3', classes.label)}>
          Label
        </Typography>
        <LabelledSliderSwitch
          checked={!currentEventAnnotationLabel}
          onClick={() => handleLabelChange(!currentEventAnnotationLabel)}
          darkIconContent={'Negative'}
          lightIconContent={'Positive'}
        />
      </div>
      <div className={classes.labelContainer}>
        <Typography className={clsx('am-subtitle3', classes.label)}>
          Failure Reasons
        </Typography>
      </div>
      <div className={classes.failureReasons}>
        <FormControl
          className={classes.formControl}
          noValidate
          autoComplete='off'
          disabled={currentEventAnnotationLabel === true}
        >
          <InputLabel
            id='demo-mutiple-chip-label'
            classes={{ root: classes.value }}
          >
            Select Failure Reasons
          </InputLabel>
          <Select
            labelId='demo-mutiple-chip-label'
            id='demo-mutiple-chip'
            multiple
            variant={'filled'}
            value={currentEventAnnotationFailureModes}
            onChange={handleFailureModesChange}
            input={
              <Input
                id='select-multiple-chip'
                classes={{
                  underline: classes.underline,
                }}
              />
            }
            renderValue={selected => (
              <div className={classes.chips}>
                {selected.map(failureModeString => (
                  <Chip
                    key={stringToFailureMode(failureModeString)[0]}
                    label={stringToFailureMode(failureModeString)[1]}
                    className={classes.chip}
                  />
                ))}
              </div>
            )}
            MenuProps={MenuProps}
          >
            {currentEventAnnotationValidFailureModes.map(failureMode => (
              <MenuItem
                key={failureMode.id}
                value={failureModeToString(failureMode)}
                style={getStyles(
                  failureMode.id,
                  currentEventAnnotationFailureModes,
                  theme,
                )}
              >
                {failureMode.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div className={classes.labelContainer}>
        <Typography className={clsx('am-subtitle3', classes.label)}>
          Other Reason
        </Typography>
      </div>
      <div className={classes.other}>
        <FormControl
          className={classes.formControl}
          disabled={currentEventAnnotationLabel === true}
        >
          <TextField
            id='standard-name'
            label='Fill in if no failure reasons apply'
            value={currentEventAnnotationOther}
            onChange={handleOtherChange}
            InputProps={{
              classes: {
                underline: classes.underline,
                root: classes.value,
              },
            }}
            InputLabelProps={{
              classes: {
                input: classes.inputField,
                root: classes.label,
              },
            }}
            classes={{
              root: classes.value,
            }}
            disabled={currentEventAnnotationLabel === true}
          />
        </FormControl>
      </div>
    </div>
  )
}

export default InfoView
