import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Button, TextField } from '@material-ui/core'
import { useTheme } from '@material-ui/core/styles'
import { filter, get, isEmpty } from 'lodash'
// src
import { SettingsSliceProps } from 'redux/slices/settings'
import { SearchableSelectDropdown } from 'ambient_ui'
import { SiteOption } from 'ambient_ui/components/menus/SearchableSelectDropdown/types'
import { ValueType } from 'react-select'

import useStyles from './styles'

interface PauseAlertLayoutProps {
  handleSubmit: (description: string | null, duration: number) => void
  handleCancel: () => void
  threatSignatureName: string | null
  streamName: string | null
  selectedDescription: string | null
  selectedDuration: number
}

const MINUTE_IN_SECONDS = 60

// TODO AMB-2276|@rys: refactor into ModalLayout.

export default function PauseAlertLayout({
  handleSubmit,
  handleCancel,
  threatSignatureName,
  streamName,
  selectedDescription,
  selectedDuration,
}: PauseAlertLayoutProps): JSX.Element {
  const { palette } = useTheme()
  const darkMode = useSelector(
    (state: SettingsSliceProps) => state.settings.darkMode,
  )
  const classes = useStyles({ darkMode })

  const [description, setDescription] = useState<string | null>(
    selectedDescription,
  )
  const [duration, setDuration] = useState<number>(selectedDuration)

  const onChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    if (isEmpty(e.target.value)) {
      setDescription('')
    } else {
      setDescription(e.target.value)
    }
  }

  const onDurationSelect = (
    selected: ValueType<SiteOption, boolean> | null,
  ) => {
    setDuration(get(selected, 'value', 0))
  }

  // TODO AMB-2277 pass body as a text
  const body =
    'Pausing an alert will turn off monitoring for this threat signature on this specific stream until the selected time frame expires. You may miss an important alert, please think twice before confirming.'
  const durationOptions: SiteOption[] = [
    {
      label: '30 Minutes',
      value: MINUTE_IN_SECONDS * 30,
    },
    {
      label: '60 Minutes',
      value: MINUTE_IN_SECONDS * 60,
    },
    {
      label: '90 Minutes',
      value: MINUTE_IN_SECONDS * 90,
    },
    {
      label: '2 Hours',
      value: MINUTE_IN_SECONDS * 120,
    },
  ]

  return (
    <div>
      {/* TODO AMB-2277 to make this as atom */}
      <div className={classes.body}>{body}</div>
      {/* TODO AMB-2277 to make this as atom */}
      <div className={classes.details}>
        <div className={classes.detailsTitle}>Alert Details</div>
      </div>
      {/* TODO AMB-2277 to make this as atom */}
      <div className={classes.detailLabel}>Threat signature</div>
      <div className={classes.detail}>{threatSignatureName}</div>
      {/* TODO AMB-2277 to make this as atom */}
      <div className={classes.detailLabel}>Stream</div>
      <div className={classes.detail}>{streamName}</div>
      <div className={classes.detailLabel}>Duration</div>
      <div className={classes.detail}>
        <SearchableSelectDropdown
          placeholder='Select Duration'
          options={durationOptions}
          onChange={onDurationSelect}
          value={filter(durationOptions, ['value', duration])[0]}
          darkMode={darkMode}
          isSearchable={false}
          customBackgroundColor={palette.common.inputGrey}
        />
      </div>
      <div className={classes.detailLabel}>Description</div>
      <TextField
        multiline
        rows={3}
        rowsMax={3}
        className={classes.textField}
        InputProps={{
          disableUnderline: true,
          inputProps: {
            notchedOutline: classes.textField,
            disableUnderline: true,
          },
        }}
        placeholder='Tell us in a few lines what you are experiencing'
        value={description}
        onChange={onChange}
      />
      {/* TODO AMB-2277 to make this as atom */}
      <div className={classes.buttons}>
        <Button
          variant='text'
          className={classes.cancel}
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button
          variant='contained'
          className={classes.submit}
          disabled={isEmpty(description) || duration === 0}
          onClick={() => {
            handleSubmit(description, duration)
          }}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
