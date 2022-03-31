import React from 'react'
import { useDispatch } from 'react-redux'
import Box from '@material-ui/core/Box'
import { Button } from 'ambient_ui'
import { setIsAccessReaderModalOpen } from 'features/StreamConfiguration/streamConfigurationSlice'

export default function EmptyAccessReader() {
  const dispatch = useDispatch()

  return (
    <Box
      p={2}
      display='flex'
      flexDirection='row'
      alignItems='center'
      justifyContent='space-between'
    >
      <div>No access readers on stream.</div>
      <Button
        variant='text'
        onClick={() => dispatch(setIsAccessReaderModalOpen(true))}
      >
        Add
      </Button>
    </Box>
  )
}
