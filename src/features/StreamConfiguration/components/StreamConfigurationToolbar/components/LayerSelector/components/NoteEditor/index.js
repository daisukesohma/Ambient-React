import React, { useState } from 'react'
import { Box } from '@material-ui/core'
import Button from '@material-ui/core/Button'
// src
import AddNoteModal from '../AddNoteModal'
import SavedNotes from './components/SavedNotes'

export default function NoteEditor() {
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false)

  return (
    <div>
      <Box
        p={2}
        pb={1}
        display='flex'
        flexDirection='row'
        justifyContent='space-between'
        alignItems='center'
      >
        <span>Saved</span>
        <Button
          variant='text'
          color='primary'
          onClick={() => setIsNoteModalOpen(true)}
        >
          Add
        </Button>
      </Box>

      <SavedNotes />

      <AddNoteModal
        open={isNoteModalOpen}
        handleClose={() => setIsNoteModalOpen(false)}
        showProblematic={false}
      />
    </div>
  )
}
