import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'
import { Box } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { Icon } from 'ambient_ui'
import {
  selectAccessReader,
  setAccessReaderSearch,
} from 'features/StreamConfiguration/streamConfigurationSlice'
import getAccessReadersBySiteAndStream from 'features/StreamConfiguration/selectors/getAccessReadersBySiteAndStream'
import { useCursorStyles } from 'common/styles/commonStyles'
import { map, get, orderBy, some } from 'lodash'
import ToolbarSearch from 'components/ToolbarSearch'
import clsx from 'clsx'

import useStyles from './styles'

export default function AvailableAccessReaderList() {
  const classes = useStyles()
  const { palette } = useTheme()
  const cursorClasses = useCursorStyles()
  const dispatch = useDispatch()
  const accessReaderSearch = useSelector(
    state => state.streamConfiguration.accessReaderSearch,
  )

  const accessReadersForActiveSite = useSelector(
    getAccessReadersBySiteAndStream,
  )

  const hasNotConfiguredReaders = some(accessReadersForActiveSite, {
    entityConfig: null,
    isOnActiveStream: true,
  })

  const orderedReaders = orderBy(
    accessReadersForActiveSite,
    [
      'isOnActiveStream',
      'entityConfig',
      reader => get(reader, 'deviceId', '').toLowerCase(),
    ],
    ['desc', 'asc', 'asc'],
  )

  const handleSelection = id => dispatch(selectAccessReader({ id }))

  return (
    <>
      {hasNotConfiguredReaders && (
        <Box mb={2}>
          <Alert severity='warning'>Have several not configured readers!</Alert>
        </Box>
      )}
      <ToolbarSearch
        search={accessReaderSearch}
        setSearch={setAccessReaderSearch}
        placeholder={`Search ${get(
          accessReadersForActiveSite,
          'length',
          '',
        )} access readers`}
      />
      {map(orderedReaders, reader => {
        return (
          <div
            className={clsx(
              'am-subtitle1',
              classes.streamItem,
              cursorClasses.pointer,
            )}
            onClick={() => handleSelection(reader.id)}
          >
            <Box
              display='flex'
              flexDirection='row'
              alignItems='center'
              justifyContent='space-between'
              width='100%'
            >
              <span>{reader.deviceId}</span>
              {get(reader, 'stream.id') && (
                <Box
                  display='flex'
                  flexDirection='row'
                  alignItems='center'
                  className='am-caption'
                >
                  <div>
                    {reader.isOnActiveStream
                      ? `Attached to current stream`
                      : 'Attached on another stream'}
                  </div>
                  {reader.isOnActiveStream && (
                    <Box ml={1} mt={0.5}>
                      {reader.entityConfig && (
                        <Icon
                          icon='checkCircle'
                          color={palette.common.greenPastel}
                          size={16}
                        />
                      )}
                      {!reader.entityConfig && (
                        <Icon
                          icon='checkCircle'
                          color={palette.error.main}
                          size={16}
                        />
                      )}
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          </div>
        )
      })}
    </>
  )
}
