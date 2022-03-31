import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Checkbox,
  Box,
  FormControlLabel,
  FormGroup,
  Modal,
  Button,
  TextField,
} from '@material-ui/core'
import { get } from 'lodash'

// src
import BaseModalWrapper from 'components/Modals/Wrappers/BaseModalWrapper'
import BaseModalTitle from 'components/Modals/Wrappers/BaseModalTitle'
import {
  createStreamNoteRequested,
  updateStreamProblematicStatusRequested,
} from 'features/StreamConfiguration/streamConfigurationSlice'

import useStyles from './styles'

function AddNoteModal({ open, handleClose, showProblematic }) {
  const dispatch = useDispatch()
  const classes = useStyles()

  const handleCloseAndClear = () => {
    handleClose()
  }
  const streamId = useSelector(state =>
    get(state, 'streamConfiguration.activeStream.id'),
  )
  const isProblematic = useSelector(state =>
    get(state, 'streamConfiguration.activeStream.isProblematic'),
  )
  const streamNoteLoading = useSelector(state =>
    get(state, 'streamConfiguration.streamNoteLoading'),
  )

  const [note, setNote] = useState('')
  const handleValueChange = e => setNote(e.target.value)

  const [problematic, setProblematic] = useState(isProblematic)

  const send = () => {
    if (problematic !== isProblematic) {
      dispatch(
        updateStreamProblematicStatusRequested({
          streamId,
          content: note,
          isProblematic: problematic,
        }),
      )
      handleClose()
    } else {
      dispatch(
        createStreamNoteRequested({
          streamId,
          content: note,
        }),
      )
      handleClose()
    }
  }

  return (
    <Modal open={open}>
      <BaseModalWrapper width='fit-content' height={350}>
        <BaseModalTitle title='Add Note' handleClose={handleCloseAndClear} />
        <Box mt={1} width={500} pl={2} pr={2}>
          <Box mt={3}>
            <div className={classes.optionsContainer}>
              <FormGroup>
                <TextField
                  id='note'
                  label='Note'
                  value={note}
                  onChange={handleValueChange}
                />
              </FormGroup>

              {showProblematic && (
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={problematic}
                        onChange={event =>
                          setProblematic(problematic => !problematic)
                        }
                      />
                    }
                    label='Problematic'
                    key='problematic'
                  />
                </FormGroup>
              )}
            </div>

            <div className={classes.controllerContainer}>
              <div className={classes.button}>
                <Button
                  variant='outlined'
                  color='primary'
                  onClick={handleCloseAndClear}
                  disabled={streamNoteLoading}
                >
                  Cancel
                </Button>
              </div>
              <div className={classes.button}>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={send}
                  disabled={streamNoteLoading}
                >
                  Send
                </Button>
              </div>
            </div>
          </Box>
        </Box>
      </BaseModalWrapper>
    </Modal>
  )
}

export default AddNoteModal
