/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { TreeView, TreeItem } from '@material-ui/lab'
import { ExpandMore, ChevronRight } from '@material-ui/icons'
import {
  Modal,
  Paper,
  Typography,
  CircularProgress,
  Box,
} from '@material-ui/core'
import { useSpring, animated } from 'react-spring'
import { get, map, isEmpty } from 'lodash'
// src
import { createNotification } from 'redux/slices/notifications'
import { Icons } from 'ambient_ui'

import { GET_SPEAKERS, PLAY_SPEAKER } from './gql'
import useStyles from './styles'

interface FadeProps {
  children?: React.ReactElement
  in: boolean
  onEnter?: () => void
  onExited?: () => void
}

const Fade = React.forwardRef<HTMLDivElement, FadeProps>(function Fade(
  props,
  ref,
) {
  const { in: open, children, onEnter, onExited, ...other } = props
  const style = useSpring({
    from: { opacity: 0 },
    to: { opacity: open ? 1 : 0 },
    onStart: () => {
      if (open && onEnter) {
        onEnter()
      }
    },
    onRest: () => {
      if (!open && onExited) {
        onExited()
      }
    },
  })

  return (
    <animated.div ref={ref} style={style} {...other}>
      {children}
    </animated.div>
  )
})

interface Props {
  streamId: number
  control: (handleOpen: () => void) => JSX.Element
}

export default function SpeakersModal({
  streamId,
  control,
}: Props): JSX.Element | null {
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch()
  const classes = useStyles()

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const onCompleted = () => {
    dispatch(
      createNotification({ message: 'The file on the speaker was triggered' }),
    )
    setOpen(false)
  }

  const { loading, data } = useQuery(GET_SPEAKERS, { variables: { streamId } })
  const [dispatchPlay, { loading: creating }] = useMutation(PLAY_SPEAKER, {
    onCompleted,
  })

  const speakers = get(data, 'speakersForStream', [])
  const speakerIDs = map(speakers, 'id')

  const handleListItemClick = (speakerFileId: number): void => {
    dispatchPlay({ variables: { input: { speakerFileId } } })
  }

  if (isEmpty(speakers)) return null

  return (
    <div>
      {control(handleOpen)}
      <Modal className={classes.modal} open={open} onClose={handleClose}>
        <Fade in={open}>
          <Paper className={classes.paper}>
            <Box className={classes.modalCloseBtn} onClick={handleClose}>
              <Icons.Close width={25} height={25} />
            </Box>
            <Typography variant='h6' gutterBottom>
              Available Speakers
            </Typography>
            <Typography variant='body2' gutterBottom>
              Select speaker to play
            </Typography>
            {(loading || creating) && (
              <CircularProgress style={{ marginLeft: '35%' }} />
            )}
            {!loading && !creating && (
              <TreeView
                defaultExpanded={speakerIDs}
                defaultCollapseIcon={<ExpandMore />}
                defaultExpandIcon={<ChevronRight />}
              >
                {map(speakers, speaker => (
                  <TreeItem
                    key={speaker.id}
                    nodeId={speaker.id}
                    label={speaker.name}
                  >
                    {map(speaker.files, file => {
                      return (
                        <TreeItem
                          key={`${speaker.id}-${file.id}`}
                          nodeId={`${speaker.id}-${file.id}`}
                          label={file.name}
                          onClick={() => handleListItemClick(file.id)}
                        />
                      )
                    })}
                  </TreeItem>
                ))}
              </TreeView>
            )}
          </Paper>
        </Fade>
      </Modal>
    </div>
  )
}
