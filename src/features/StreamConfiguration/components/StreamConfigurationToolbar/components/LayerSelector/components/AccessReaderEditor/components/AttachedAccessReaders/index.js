import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box } from '@material-ui/core'
import { some } from 'lodash'
import { Alert } from '@material-ui/lab'
// src
import { Button } from 'ambient_ui'
import { setIsAccessReaderModalOpen } from 'features/StreamConfiguration/streamConfigurationSlice'

export default function AttachedAccessReaders() {
  const dispatch = useDispatch()
  const accessReadersOnStream = useSelector(
    state => state.streamConfiguration.accessReadersOnStream,
  )

  const hasNotConfiguredReaders = some(accessReadersOnStream, {
    entityConfig: null,
  })

  return (
    <>
      {hasNotConfiguredReaders && (
        <Box ml={2} mt={2} mr={2}>
          <Alert severity='warning'>Have several not configured readers!</Alert>
        </Box>
      )}
      <Box
        p={2}
        display='flex'
        flexDirection='row'
        alignItems='center'
        justifyContent='space-between'
      >
        <div>{accessReadersOnStream.length} Access Readers attached</div>
        <div>
          <Button
            variant='text'
            onClick={() => dispatch(setIsAccessReaderModalOpen(true))}
          >
            Edit
          </Button>
        </div>
      </Box>
    </>
  )
}
