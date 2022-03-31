import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box } from '@material-ui/core'
import { get, map, find } from 'lodash'
import { Icon as IconKit } from 'react-icons-kit'
import { chevronLeft } from 'react-icons-kit/feather/chevronLeft'
import Tooltip from 'components/Tooltip'
import TooltipText from 'components/Tooltip/TooltipText'
import { Button, Icon } from 'ambient_ui'

import {
  selectAccessReader,
  updateAccessReaderRequested,
} from 'features/StreamConfiguration/streamConfigurationSlice'

function EditSelectedAccessReader() {
  const dispatch = useDispatch()

  const accessReadersForActiveSite = useSelector(
    state => state.streamConfiguration.accessReadersForActiveSite,
  )

  const activeStream = useSelector(
    state => state.streamConfiguration.activeStream,
  )
  const selectedAccessReaderId = useSelector(
    state => state.streamConfiguration.selectedAccessReaderId,
  )
  const activeStreamEntities = get(activeStream, 'entities')
  const selectedAccessReader = find(accessReadersForActiveSite, {
    id: selectedAccessReaderId,
  })

  const handleSelection = id => dispatch(selectAccessReader({ id }))
  const currentAccessReaderOnStream =
    get(activeStream, 'id') === get(selectedAccessReader, 'stream.id')

  return (
    <Box>
      <Box display='flex' flexDirection='row' alignItems='center'>
        <Button
          size='small'
          variant='text'
          onClick={() => handleSelection(null)}
        >
          <IconKit icon={chevronLeft} />
        </Button>
        {selectedAccessReader.deviceId} {selectedAccessReader.active}
      </Box>
      <Box
        display='flex'
        flexDirection='row'
        alignItems='center'
        justifyContent='space-between'
        mt={3}
      >
        {get(selectedAccessReader, 'stream.id') ? (
          <>
            {get(selectedAccessReader, 'stream.id') === activeStream.id ? (
              <Box display='flex' flexDirection='row'>
                <span className='am-caption'>Current Stream</span>
                <Box ml={2} className='am-overline'>
                  Access Reader attached
                </Box>
              </Box>
            ) : (
              <Box
                display='flex'
                flexDirection='row'
                alignItems='center'
                justifyContent='space-between'
                width='100%'
              >
                <div className='am-caption'>
                  <span className='am-overline'>
                    Attached to another stream
                  </span>
                  <Tooltip
                    content={
                      <TooltipText text='Access Readers can only be attached to one stream at a time. Clicking replace will remove the access reader from the previous stream to the current stream' />
                    }
                  >
                    <Icon icon='help' size={16} />
                  </Tooltip>
                </div>
                <Button
                  size='small'
                  variant='text'
                  onClick={() =>
                    dispatch(
                      updateAccessReaderRequested({
                        id: selectedAccessReaderId,
                        streamId: activeStream.id,
                        entityConfigId: null, // this doesn't work YET
                      }),
                    )
                  }
                >
                  Replace
                </Button>
              </Box>
            )}
          </>
        ) : (
          <Box
            display='flex'
            flexDirection='row'
            alignItems='center'
            justifyContent='space-between'
            width='100%'
          >
            <span className='am-caption'>Current Stream</span>
            <span>
              <Button
                size='small'
                variant='text'
                onClick={() =>
                  dispatch(
                    updateAccessReaderRequested({
                      id: selectedAccessReaderId,
                      streamId: activeStream.id,
                    }),
                  )
                }
              >
                Add
              </Button>
            </span>
          </Box>
        )}
        {currentAccessReaderOnStream && (
          <Button
            size='small'
            variant='text'
            onClick={() =>
              dispatch(
                updateAccessReaderRequested({
                  id: selectedAccessReaderId,
                }),
              )
            }
          >
            Remove
          </Button>
        )}
      </Box>
      {map(activeStreamEntities, e => {
        return (
          <Box
            display='flex'
            flexDirection='row'
            alignItems='center'
            justifyContent='space-between'
          >
            <Box display='flex' flexDirection='row' className='am-caption'>
              <span>Entity Id: {e.id}</span>
              {get(selectedAccessReader, 'entityConfig.id') === e.id && (
                <Box ml={2} className='am-overline'>
                  Access Reader Attached
                </Box>
              )}
            </Box>
            {get(selectedAccessReader, 'entityConfig.id') !== e.id ? (
              <Button
                variant='text'
                onClick={() =>
                  dispatch(
                    updateAccessReaderRequested({
                      id: selectedAccessReaderId,
                      entityConfigId: e.id,
                      streamId: activeStream.id,
                    }),
                  )
                }
              >
                {get(selectedAccessReader, 'entityConfig.id')
                  ? 'Replace'
                  : 'Add'}
              </Button>
            ) : (
              <Button
                variant='text'
                onClick={() =>
                  dispatch(
                    updateAccessReaderRequested({
                      id: selectedAccessReaderId,
                      streamId: activeStream.id,
                    }),
                  )
                }
              >
                Remove
              </Button>
            )}
          </Box>
        )
      })}
    </Box>
  )
}

export default EditSelectedAccessReader
