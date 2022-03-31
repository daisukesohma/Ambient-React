import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'
import {
  Card,
  CardContent,
  CardActions,
  CircularProgress,
} from '@material-ui/core'
import moment from 'moment'
import { get, map } from 'lodash'

// src
import {
  deleteStreamNoteRequested,
  setUpdatingStreamNoteId,
} from 'features/StreamConfiguration/streamConfigurationSlice'
import Tooltip from 'components/Tooltip'
import TooltipText from 'components/Tooltip/TooltipText'
import { Icon, Icons } from 'ambient_ui'
import EditNoteDisplay from '../EditNoteDisplay'

import useStyles from './styles'
import { useFlexStyles } from 'common/styles/commonStyles'

export default function SavedNotes() {
  const { palette } = useTheme()
  const classes = useStyles()
  const flexClasses = useFlexStyles()
  const dispatch = useDispatch()

  const streamNotes = useSelector(state =>
    get(state, 'streamConfiguration.activeStream.streamNotes', []),
  )

  const updatingStreamNoteLoading = useSelector(
    state => state.streamConfiguration.updatingStreamNoteLoading,
  )
  const deletingStreamNoteLoading = useSelector(
    state => state.streamConfiguration.deletingStreamNoteLoading,
  )
  const updatingStreamNoteId = useSelector(
    state => state.streamConfiguration.updatingStreamNoteId,
  )
  const deletingStreamNoteId = useSelector(
    state => state.streamConfiguration.deletingStreamNoteId,
  )
  const profileId = useSelector(state => get(state, 'auth.profile.id', null))

  const getReadableTimeWithFormat = (unixTs, format) => {
    return moment.unix(unixTs).format(format)
  }

  const handleDelete = id => {
    dispatch(
      deleteStreamNoteRequested({
        streamNoteId: id,
      }),
    )
  }

  const handleEditing = id => {
    dispatch(setUpdatingStreamNoteId({ id }))
  }

  return (
    <div id='saved-notes'>
      {!updatingStreamNoteLoading && updatingStreamNoteId && (
        <EditNoteDisplay streamNotes={streamNotes} />
      )}

      {get(streamNotes, 'length') === 0 && (
        <Card className={classes.root}>
          <CardContent>
            <span className={flexClasses.row}>
              <span className='am-caption' style={{ marginLeft: 8 }}>
                You have no saved stream note
              </span>
            </span>
          </CardContent>
        </Card>
      )}

      {map(streamNotes, note => {
        const { id } = note
        const isEditingNote = updatingStreamNoteId === id
        return (
          <Card key={id} className={classes.root}>
            <CardContent className={classes.cardContent}>
              <div style={{ cursor: 'pointer' }}>
                <div>
                  <div className='am-caption'>Content: {note.content}</div>
                  <div className='am-caption'>
                    Creator:{' '}
                    {`${note.creator.user.firstName} ${note.creator.user.lastName}`}
                  </div>
                  <div className='am-caption'>
                    Created:{' '}
                    {getReadableTimeWithFormat(
                      note.tsCreated,
                      'ddd MM/DD/YY HH:mm:ssA',
                    )}
                  </div>
                </div>
              </div>
            </CardContent>

            {get(note, 'creator.id') === profileId && (
              <CardActions className={classes.cardActions}>
                <Tooltip
                  placement='bottom'
                  content={<TooltipText>Edit</TooltipText>}
                >
                  {isEditingNote && updatingStreamNoteLoading ? (
                    <span className={flexClasses.row}>
                      <CircularProgress size={14} />
                      <span className='am-caption' style={{ marginLeft: 8 }}>
                        Updating...
                      </span>
                    </span>
                  ) : (
                    <span
                      onClick={() => handleEditing(id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <Icons.Edit width={16} height={16} />
                    </span>
                  )}
                </Tooltip>
                <Tooltip
                  placement='bottom'
                  content={<TooltipText>Delete</TooltipText>}
                >
                  {deletingStreamNoteId === id && deletingStreamNoteLoading ? (
                    <span className={flexClasses.row}>
                      <CircularProgress size={14} />
                      <span className='am-caption' style={{ marginLeft: 8 }}>
                        Deleting...
                      </span>
                    </span>
                  ) : (
                    <span
                      onClick={() => handleDelete(id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <Icon icon='trash' color={palette.error.main} size={16} />
                    </span>
                  )}
                </Tooltip>
              </CardActions>
            )}
          </Card>
        )
      })}
    </div>
  )
}
