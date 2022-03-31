/*
 * author: rodaan@ambient.ai
 * DispatchMenuComponent to allow users to create arbitrary AlertEvents when they want to
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, TextInput } from 'ambient_ui'

import formatUnixTimeToReadable from '../../utils/formatUnixTimeToReadable'
import './DispatchMenu.css'

class DispatchMenu extends Component {
  constructor(props) {
    super(props)

    this.state = {
      title: '',
    }
  }

  handleValueChange = e => {
    const newState = {}
    newState.title = e
    this.setState(newState, () => {})
  }

  handleDispatchRequest = () => {
    const { createDispatchRequest, videoStreamTS } = this.props
    createDispatchRequest(this.state.title, videoStreamTS * 1000, () => {
      this.setState(
        {
          title: '',
        },
        () => {},
      )
    })
  }

  render() {
    const { videoStreamTS, creatingDispatchRequest } = this.props

    const readableTS = formatUnixTimeToReadable(videoStreamTS, true, true)
    const buttonText = creatingDispatchRequest ? 'Creating' : 'Create'
    return (
      <div
        style={{ bottom: '7.7em', left: '0', position: 'absolute' }}
        className='dispatch_menu_component'
      >
        <strong className='dispatch_menu_component__title'>Create Alert</strong>
        <div className='dispatch_menu_component__row'>
          <span className='dispatch_menu_component__selected_ts'>
            Selected timestamp: {readableTS}
          </span>
        </div>
        <div className='dispatch_menu_component__row'>
          <TextInput
            id='title'
            label='Title'
            helperText='Name of Alert'
            value={this.state.title}
            onChange={this.handleValueChange}
          />
        </div>
        <div className='dispatch_menu_component__row__last'>
          <Button
            className='btn btn-primary'
            disabled={creatingDispatchRequest}
            onClick={this.handleDispatchRequest}
          >
            {buttonText}
          </Button>
        </div>
      </div>
    )
  }
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
