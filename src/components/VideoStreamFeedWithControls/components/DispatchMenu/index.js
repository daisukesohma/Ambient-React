/*
 * author: rodaan@ambient.ai
 * DispatchMenuComponent to allow users to create arbitrary AlertEvents when they want to
 */
import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { Button, TextInput } from 'ambient_ui'

import formatUnixTimeToReadable from '../../utils/formatUnixTimeToReadable'

import useStyles from './styles'

const DispatchMenu = ({
  createDispatchRequest,
  creatingDispatchRequest,
  videoStreamTS,
}) => {
  const classes = useStyles()
  const [title, setTitle] = useState('')

  const handleValueChange = e => setTitle(e)

  const handleDispatchRequest = useCallback(() => {
    createDispatchRequest(title, videoStreamTS * 1000, () => setTitle(''))
  }, [createDispatchRequest, title, videoStreamTS])

  return (
    <div className={classes.dispatchMenuComponent}>
      <strong>Create Alert</strong>
      <div className={classes.dispatchMenuComponentRow}>
        <span className={classes.dispatchMenuComponentRowSelectedTs}>
          Selected timestamp:{' '}
          {formatUnixTimeToReadable(videoStreamTS, true, true)}
        </span>
      </div>
      <div className={classes.dispatchMenuComponentRow}>
        <TextInput
          id='title'
          label='Title'
          helperText='Name of Alert'
          value={title}
          onChange={handleValueChange}
        />
      </div>
      <div className={classes.dispatchMenuComponentRowLast}>
        <Button
          className='btn btn-primary'
          disabled={creatingDispatchRequest}
          onClick={handleDispatchRequest}
        >
          {creatingDispatchRequest ? 'Creating' : 'Create'}
        </Button>
      </div>
    </div>
  )
}

DispatchMenu.defaultProps = {
  videoStreamTS: null,
  createDispatchRequest: () => {},
  creatingDispatchRequest: false,
}

DispatchMenu.propTypes = {
  videoStreamTS: PropTypes.number,
  createDispatchRequest: PropTypes.func,
  creatingDispatchRequest: PropTypes.bool,
}

export default DispatchMenu
