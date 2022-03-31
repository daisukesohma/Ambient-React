import React, { memo } from 'react'
import { useSelector, useDispatch, batch } from 'react-redux'
import { LabelledSliderSwitch } from 'ambient_ui'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import Checkbox from '@material-ui/core/Checkbox'
import ListItemText from '@material-ui/core/ListItemText'
import Input from '@material-ui/core/Input'
import MenuItem from '@material-ui/core/MenuItem'
import InputLabel from '@material-ui/core/InputLabel'

import {
  dataPointsFetchRequested,
  setFailureModeFilters,
  setFailureModeFilterAtLeastOne,
} from '../../../../redux/dataInfraSlice'
import {
  stringToFailureMode,
  failureModeToString,
  stringToFailureModeName,
  tabValueToEventAnnotationLabel,
} from '../../utils/index'

import useStyles from './styles'

function NegativeFilter() {
  const dispatch = useDispatch()
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

  const dataPointsActiveFilter = useSelector(
    state => state.dataInfra.dataPointsActiveFilter,
  )
  const failureModeFilters = useSelector(
    state => state.dataInfra.failureModeFilters,
  )
  const failureModeFilterAtLeastOne = useSelector(
    state => state.dataInfra.failureModeFilterAtLeastOne,
  )
  const selectedCampaign = useSelector(
    state => state.dataInfra.selectedCampaign,
  )
  const tabValue = useSelector(state => state.dataInfra.tabValue)

  const handleFailureModeFiltersChange = event => {
    const failureModeIds = event.target.value.map(
      failureModeString => stringToFailureMode(failureModeString)[0],
    )
    batch(() => {
      dispatch(
        setFailureModeFilters({
          failureModeFilters: event.target.value,
        }),
      )
      dispatch(
        dataPointsFetchRequested({
          dataCampaignId: selectedCampaign.id,
          page: 1,
          tsIdentifierStart: dataPointsActiveFilter.startTs,
          tsIdentifierEnd: dataPointsActiveFilter.endTs,
          eventAnnotationLabel: tabValueToEventAnnotationLabel(tabValue),
          failureModeIds,
          filterAtLeastOne: failureModeFilterAtLeastOne,
        }),
      )
    })
  }

  const handleFailureModeFilterAtLeastOneChange = () => {
    const failureModeIds = failureModeFilters.map(
      failureModeString => stringToFailureMode(failureModeString)[0],
    )
    batch(() => {
      dispatch(
        setFailureModeFilterAtLeastOne({
          failureModeFilterAtLeastOne: !failureModeFilterAtLeastOne,
        }),
      )
      dispatch(
        dataPointsFetchRequested({
          dataCampaignId: selectedCampaign.id,
          page: 1,
          tsIdentifierStart: dataPointsActiveFilter.startTs,
          tsIdentifierEnd: dataPointsActiveFilter.endTs,
          eventAnnotationLabel: tabValueToEventAnnotationLabel(tabValue),
          failureModeIds,
          filterAtLeastOne: !failureModeFilterAtLeastOne,
        }),
      )
    })
  }

  return (
    <>
      <FormControl variant='filled' className={classes.formControl}>
        <InputLabel id='demo-mutiple-chip-label' className={classes.InputLabel}>
          Filter By Failure Reasons
        </InputLabel>
        <Select
          labelId='demo-mutiple-checkbox-label'
          id='demo-mutiple-checkbox'
          multiple
          value={failureModeFilters}
          onChange={handleFailureModeFiltersChange}
          input={<Input />}
          renderValue={selected =>
            selected.map(s => stringToFailureModeName(s)).join(', ')
          }
          MenuProps={MenuProps}
          className={classes.select}
          inputProps={{
            classes: {
              icon: classes.icon,
            },
          }}
        >
          {selectedCampaign.validFailureModes.map(failureMode => (
            <MenuItem
              key={failureMode.id}
              value={failureModeToString(failureMode)}
            >
              <Checkbox
                checked={
                  failureModeFilters.indexOf(failureModeToString(failureMode)) >
                  -1
                }
              />
              <ListItemText primary={failureMode.name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <LabelledSliderSwitch
        checked={!failureModeFilterAtLeastOne}
        onClick={handleFailureModeFilterAtLeastOneChange}
        darkIconContent={'AND'}
        lightIconContent={'OR'}
      />
    </>
  )
}

export default memo(NegativeFilter)
