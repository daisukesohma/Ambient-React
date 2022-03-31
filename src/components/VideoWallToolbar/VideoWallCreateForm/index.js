/* eslint-disable camelcase */
import React, { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import TextField from '@material-ui/core/TextField'
import InputLabel from '@material-ui/core/InputLabel'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Box from '@material-ui/core/Box'
import isEmpty from 'lodash/isEmpty'
import map from 'lodash/map'
import clsx from 'clsx'

import { videoWallCreateRequested } from '../videoWallToolbarSlice'
import VideoWallTemplateList from '../../VideoWallTemplateList'
import getTemplateIcon from 'common/data/videoWallTemplateIcons/templates'
import Button from 'ambient_ui/components/buttons/Button'
import { videoWallTemplatesFetchRequested } from 'redux/slices/videoWall'

import useStyles from './styles'

const propTypes = {
  onCreated: PropTypes.func,
}

function VideoWallCreateForm({ onCreated }) {
  const { account } = useParams()
  const dispatch = useDispatch()
  const history = useHistory()
  const darkMode = useSelector(state => state.settings.darkMode)

  const [name, setName] = useState('')
  const [template, setTemplate] = useState(null)
  const [isPublic, setIsPublic] = useState(true)

  const videoWallTemplates = useSelector(
    state => state.videoWall.videoWallTemplates,
  )

  useEffect(() => {
    dispatch(videoWallTemplatesFetchRequested())
  }, [dispatch])

  const templates = useMemo(() => {
    return !isEmpty(videoWallTemplates)
      ? map(videoWallTemplates, templateItem => {
          return { ...templateItem, icon: getTemplateIcon(templateItem.name) }
        })
      : []
  }, [videoWallTemplates])

  const onSubmit = () => {
    dispatch(
      videoWallCreateRequested({
        account,
        name,
        isPublic,
        templateId: template.id,
        onRequestDone: id => {
          onCreated(id)
          history.push(`/accounts/${account}/video-walls/${id}/edit`)
        },
      }),
    )
  }

  const classes = useStyles({ darkMode })

  return (
    <div className={classes.root}>
      <TextField
        required
        InputProps={{
          classes: {
            root: classes.inputRoot,
            underline: classes.inputUnderline,
          },
        }}
        InputLabelProps={{
          classes: {
            root: classes.inputLabelRoot,
          },
        }}
        className={classes.textField}
        onKeyDown={e => {
          if (e.key === 'Enter') onSubmit()
        }}
        label='Video Wall Name'
        value={name}
        onChange={e => setName(e.currentTarget.value)}
      />
      <InputLabel
        className={clsx('am-subtitle1', classes.inputLabelRoot)}
        required
      >
        Select the layout for
      </InputLabel>
      <VideoWallTemplateList
        onSelect={(_, newTemplate) => setTemplate(newTemplate)}
        templates={templates}
        selectedTemplate={template}
        width={350}
      />

      <Box>
        <FormControlLabel
          classes={{
            label: classes.formControlLabel,
          }}
          control={
            <Checkbox
              checked={!isPublic}
              onChange={event => setIsPublic(prevState => !prevState)}
              classes={{ root: classes.checkboxRoot }}
            />
          }
          label='Private'
        />
      </Box>
      <Button
        onClick={onSubmit}
        disabled={isEmpty(name) || isEmpty(template)}
        customStyle={{ float: 'right' }}
      >
        Save
      </Button>
    </div>
  )
}

VideoWallCreateForm.propTypes = propTypes

export default VideoWallCreateForm
