// TODO ts ignore for Button. Button has errors without it. need to convert it to ts.

import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import clsx from 'clsx'
import isEmpty from 'lodash/isEmpty'
import find from 'lodash/find'
import filter from 'lodash/filter'
import map from 'lodash/map'
// src
import { Grid, TextField, Typography } from '@material-ui/core'
import { Button } from 'ambient_ui'
import DropdownMenu from 'ambient_ui/components/menus/DropdownMenu'

import Attachment from '../Attachment'
import ProcessedFile from '../ProcessedFile'
import { closeModal, createTicketRequested } from '../../redux/supportSlice'

import { useStyles } from './styles'

interface Placeholder {
  [key: string]: string
}

export default function CreateTicket(): JSX.Element {
  const dispatch = useDispatch()
  const darkMode = useSelector((state: any) => state.settings.darkMode)
  const classes = useStyles({ darkMode })

  const [subject, setSubject] = useState<string | null>(null)
  const [description, setDescription] = useState<string | null>(null)
  const [attachments, setAttachments] = useState<ProcessedFile[]>([])
  const [attachmentLoading, setAttachmentLoading] = useState<boolean>(false)
  const [type, setType] = useState<string | null>(null)
  const [steps, setSteps] = useState<string | null>(null)
  const createTicketLoading = useSelector(
    (state: any) => state.support.createTicketLoading,
  )

  const onConfirm = async () => {
    const typeDescription = `${type}\n\n Description: \n${description}`
    const comment =
      type === 'Bug'
        ? `${typeDescription}\n\n Steps To Reproduce: \n${steps}`
        : typeDescription
    const title = `[${type?.toUpperCase()}] - ${subject}`
    dispatch(
      createTicketRequested({
        input: {
          subject: title,
          comment,
          attachments: isEmpty(attachments) ? null : attachments,
        },
      }),
    )
  }

  const onCancel = () => {
    dispatch(closeModal())
  }

  const fileIsEqual = (file1: ProcessedFile, file2: ProcessedFile): boolean => {
    return file1.name === file2.name && file1.attachment === file2.attachment
  }

  const containsFile = (file: ProcessedFile, array: ProcessedFile[]) => {
    const result = find(array, f => {
      return fileIsEqual(f, file)
    })
    return result
  }

  const handleFileUpload = (event: any) => {
    const files = [...attachments]
    setAttachmentLoading(true)
    for (let i = 0; i < event.target.files.length; i++) {
      const file = event.target.files[i]

      const reader = new FileReader()
      reader.onload = e => {
        const processedFile: ProcessedFile = {
          name: file.name,
          attachment: e.target!.result!,
        }
        if (!containsFile(processedFile, files)) {
          files.push(processedFile)
        }
      }
      if (i === event.target.files.length - 1) {
        reader.onloadend = () => {
          setAttachmentLoading(false)
          setAttachments(files)
        }
        event.target.value = null // eslint-disable-line
      }
      reader.readAsDataURL(file)
    }
  }

  const onDelete = (file: ProcessedFile) => {
    const newArray = filter(attachments, f => {
      return !fileIsEqual(f, file)
    })
    setAttachments(newArray)
  }

  const handleFileUploadClick = () => {
    document.getElementById('attachment')!.click()
  }

  const types = [
    {
      label: 'Select Type',
      value: null,
    },
    {
      label: 'Bug',
      value: 'Bug',
    },
    {
      label: 'Feature Request',
      value: 'Feature Request',
    },
    {
      label: 'Technical Issue',
      value: 'Technical Issue',
    },
    {
      label: 'Other',
      value: 'Other',
    },
  ]

  const descriptionPlaceholder = (): string => {
    const placeholder: Placeholder = {
      Bug:
        'Example:\nEncountered a infinite loading screen on Live page. Had to hard refresh to get out. Etc.',
      'Feature Request': 'Example:\nIt would be nice if you could... Etc.',
      'Technical Issue':
        'Example:\nI want to add a new user, but it looks like their email is already in the system. Etc.',
    }
    if (type && placeholder[type]) {
      return placeholder[type]
    }
    return 'Description'
  }

  const stepsPlaceholder =
    'How did you get this bug? This will help us investigate the problem.\nExample:\nStep 1: On Forensics page, clicked button.\nStep 2: Loading icon appeared.\nEtc.'

  return (
    <div className={classes.root}>
      <Grid>
        <Typography className={clsx(classes.title)}>Create a Ticket</Typography>
      </Grid>
      <Grid
        container
        spacing={2}
        direction='column'
        justify='flex-start'
        alignItems='stretch'
        className={classes.content}
      >
        <Grid
          item
          container
          direction='row'
          justify='flex-start'
          alignItems='baseline'
        >
          <Typography>Type:</Typography>
          <Typography className={classes.required}>*</Typography>
        </Grid>
        <Grid item>
          <DropdownMenu
            classOverride={classes.dropdown}
            menuItems={types}
            handleSelection={e => {
              setType(e.value)
            }}
            selectedItem={types.find(t => type === t.value)}
          />
        </Grid>
        <Grid
          item
          container
          direction='row'
          justify='flex-start'
          alignItems='baseline'
        >
          <Typography>Subject:</Typography>
          <Typography className={classes.required}>*</Typography>
        </Grid>
        <Grid item>
          <TextField
            variant='outlined'
            placeholder='Subject'
            fullWidth
            value={subject}
            onChange={e => {
              if (isEmpty(e.target.value)) {
                setSubject(null)
              } else {
                setSubject(e.target.value)
              }
            }}
            InputProps={{
              classes: {
                root: classes.textField,
                notchedOutline: classes.notchedOutline,
                colorSecondary: classes.textField,
                focused: classes.focused,
              },
            }}
          />
        </Grid>
        <Grid
          item
          container
          direction='row'
          justify='flex-start'
          alignItems='baseline'
        >
          <Typography>Description:</Typography>
          <Typography className={classes.required}>*</Typography>
        </Grid>
        <Grid item>
          <TextField
            variant='outlined'
            placeholder={descriptionPlaceholder()}
            value={description}
            multiline
            fullWidth
            rows={10}
            onChange={e => {
              if (isEmpty(e.target.value)) {
                setDescription(null)
              } else {
                setDescription(e.target.value)
              }
            }}
            InputProps={{
              classes: {
                root: classes.textField,
                notchedOutline: classes.notchedOutline,
                colorSecondary: classes.textField,
                focused: classes.focused,
              },
            }}
          />
        </Grid>
        {type === 'Bug' && (
          <>
            <Grid
              item
              container
              direction='row'
              justify='flex-start'
              alignItems='baseline'
            >
              <Typography>Steps to Reproduce:</Typography>
            </Grid>
            <Grid item>
              <TextField
                variant='outlined'
                placeholder={stepsPlaceholder}
                value={steps}
                multiline
                fullWidth
                rows={8}
                onChange={e => {
                  if (isEmpty(e.target.value)) {
                    setSteps(null)
                  } else {
                    setSteps(e.target.value)
                  }
                }}
                InputProps={{
                  classes: {
                    root: classes.textField,
                    notchedOutline: classes.notchedOutline,
                    colorSecondary: classes.textField,
                    focused: classes.focused,
                  },
                }}
              />
            </Grid>
          </>
        )}

        {!isEmpty(attachments) && (
          <Grid item>
            <Typography>Attachments:</Typography>
          </Grid>
        )}
        <Grid
          item
          container
          direction='row'
          justify='flex-start'
          alignItems='baseline'
        >
          {!isEmpty(attachments) && (
            <Grid
              item
              container
              direction='row'
              justify='flex-start'
              alignItems='baseline'
              className={classes.attachments}
            >
              {map(attachments, (file: ProcessedFile) => {
                return (
                  <Attachment
                    file={file}
                    onDelete={onDelete}
                    darkMode={darkMode}
                    key={file.name}
                  />
                )
              })}
            </Grid>
          )}
          <Button variant='text' onClick={handleFileUploadClick}>
            Upload Attachments
          </Button>
          <input
            type='file'
            onChange={handleFileUpload}
            id='attachment'
            multiple
            style={{ display: 'none' }}
          />
        </Grid>
        <Grid
          item
          container
          direction='row'
          justify='space-between'
          alignItems='flex-start'
        >
          <Button
            variant='outlined'
            onClick={onCancel}
            disabled={createTicketLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={
              createTicketLoading ||
              !subject ||
              !description ||
              attachmentLoading ||
              !type
            }
            loading={createTicketLoading}
          >
            Confirm
          </Button>
        </Grid>
      </Grid>
    </div>
  )
}
