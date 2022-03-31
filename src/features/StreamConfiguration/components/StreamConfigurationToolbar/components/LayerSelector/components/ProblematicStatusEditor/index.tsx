import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Button } from 'ambient_ui'
import { get } from 'lodash'

import AddNoteModal from '../AddNoteModal'

import useStyles from './styles'

function ProblematicStatusEditor(): JSX.Element {
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false)
  const classes = useStyles()
  const isProblematic = useSelector(state =>
    get(state, 'streamConfiguration.activeStream.isProblematic'),
  )

  return (
    <div className={classes.root}>
      <div>Status: {isProblematic ? 'Problematic' : 'Okay'}</div>
      <Button
        variant='text'
        onClick={() => setIsNoteModalOpen(true)}
        className={classes.editButton}
      >
        UPDATE
      </Button>
      <AddNoteModal
        open={isNoteModalOpen}
        handleClose={() => setIsNoteModalOpen(false)}
        showProblematic
      />
    </div>
  )
}

export default ProblematicStatusEditor
