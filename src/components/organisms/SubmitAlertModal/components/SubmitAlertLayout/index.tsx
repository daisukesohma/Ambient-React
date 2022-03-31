import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Button, FormControl, RadioGroup, TextField } from '@material-ui/core'
import { isEmpty } from 'lodash'
// src
import { SettingsSliceProps } from 'redux/slices/settings'
import { CircularProgress } from 'ambient_ui'
import RadioButton from 'components/atoms/RadioButton'

import {
  PEOPLE_NOT_SUSPICIOUS,
  EVENT_NOT_TAKEN_PLACE,
} from '../radioButtonOptionValues'

import useStyles from './styles'

interface SubmitAlertModalProps {
  handleSubmit: (feedback: string | null, radioOptionValue: string) => void
  handleModalClose: () => void
  loading: boolean
}

// TODO(AMB-2277|@rys) think of ways to refactor this into atoms, molecules, and organisms.
export default function SubmitAlertLayout({
  handleSubmit,
  handleModalClose,
  loading,
}: SubmitAlertModalProps): JSX.Element {
  const darkMode = useSelector(
    (state: SettingsSliceProps) => state.settings.darkMode,
  )
  const classes = useStyles({ darkMode })

  const [feedback, setFeedback] = useState<string | null>(null)
  const [radioOptionValue, setRadioOptionValue] = useState<string>('')

  const handleSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRadioOptionValue(e.target.value)
  }
  const onChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    const { value } = e.target
    setFeedback(isEmpty(value) ? null : value)
  }

  const radioTitle = 'Let us know what is going on'
  const label1 = 'The described event took place but it is not suspicious.'
  const label2 = 'The described event did not take place.'

  const shouldDisableSubmitButton =
    !feedback || isEmpty(radioOptionValue) || loading
  return (
    <>
      {/* TODO: AMB-2277 Refactor to be atom */}
      <div className={classes.radioLabel}>{radioTitle}</div>
      <div className={classes.description}>
        <FormControl component='fieldset'>
          <RadioGroup
            aria-label='selection'
            name='selection'
            value={radioOptionValue}
            onChange={handleSelection}
          >
            <RadioButton value={PEOPLE_NOT_SUSPICIOUS} label={label1} />
            <RadioButton value={EVENT_NOT_TAKEN_PLACE} label={label2} />
          </RadioGroup>
        </FormControl>
      </div>
      <div className={classes.requiredLine}>
        <div className={classes.required}>*</div>
        Description
      </div>
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
        onChange={onChange}
      />
      {/* TODO: AMB-2277 Refactor to be atom */}
      <div className={classes.buttons}>
        {loading && (
          <CircularProgress color='primary' variant='indeterminate' size={18} />
        )}

        <Button
          variant='text'
          className={classes.cancel}
          onClick={handleModalClose}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          variant='contained'
          className={classes.submit}
          disabled={shouldDisableSubmitButton}
          onClick={() => {
            handleSubmit(feedback, radioOptionValue)
          }}
        >
          Submit
        </Button>
      </div>
    </>
  )
}
