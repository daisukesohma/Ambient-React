import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, Box, Grid, TextField } from '@material-ui/core'
import { find, get } from 'lodash'

// src
import {
  setUpdatingStreamNoteId,
  updateStreamNoteRequested,
} from 'features/StreamConfiguration/streamConfigurationSlice'
import { Button } from 'ambient_ui'

import useStyles from './styles'

export default function EditNoteDisplay({ streamNotes }) {
  const classes = useStyles()
  const dispatch = useDispatch()

  const updatingStreamNoteId = useSelector(
    state => state.streamConfiguration.updatingStreamNoteId,
  )
  const content = get(find(streamNotes, {id: updatingStreamNoteId}), 'content')

  const [noteContent, setNoteContent] = useState()

  useEffect(() => {
    setNoteContent(content)
  }, [content])

  const savePoints = () => {
    dispatch(
      updateStreamNoteRequested({
        streamNoteId: updatingStreamNoteId,
        content: noteContent,
      }),
    )
  }

  return (
    <Box p={2} className={classes.root}>
      <div className='am-subtitle2' style={{ padding: 8 }}>
        Editing
        <span className='am-overline' style={{ marginLeft: 8 }}>
          Id: {updatingStreamNoteId}
        </span>
      </div>
      <Card className={classes.cardRoot}>
        <Grid container justify='flex-start' alignContent='center'>
          <Grid item xs={12}>
            <Box m={2}>
              <TextField
                required
                InputProps={{
                  classes: {
                    underline: classes.inputUnderline,
                  },
                }}
                className={classes.textField}
                label='Content'
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                fullWidth
              />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box
              mt={2}
              mr={2}
              display='flex'
              flexDirection='row'
              alignItems='center'
              justifyContent='flex-end'
            >
              <Button
                variant='text'
                color='secondary'
                onClick={() => {
                  dispatch(setUpdatingStreamNoteId({ id: null }))
                }}
              >
                Cancel
              </Button>
              <Button onClick={savePoints}>Update</Button>
            </Box>
          </Grid>
        </Grid>
      </Card>
    </Box>
  )
}
