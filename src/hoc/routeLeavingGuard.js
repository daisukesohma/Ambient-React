import React from 'react'
import PropTypes from 'prop-types'
import isFunction from 'lodash/isFunction'
import { Prompt } from 'react-router-dom'

import ConfirmDialog from 'components/ConfirmDialog'

class RouteLeavingGuard extends React.Component {
  state = {
    modalVisible: false,
    lastLocation: null,
    confirmedNavigation: false,
  }

  showModal = location => {
    this.setState({
      modalVisible: true,
      lastLocation: location,
    })
  }

  closeModal = callback => {
    this.setState(
      {
        modalVisible: false,
      },
      () => {
        if (isFunction(callback)) callback()
      },
    )
  }

  handleBlockedNavigation = nextLocation => {
    const { confirmedNavigation } = this.state
    const { shouldBlockNavigation } = this.props
    if (!confirmedNavigation && shouldBlockNavigation(nextLocation)) {
      this.showModal(nextLocation)
      return false
    }
    return true
  }

  handleConfirmNavigationClick = () => {
    this.closeModal(() => {
      const { onNavigate } = this.props
      const { lastLocation } = this.state
      if (lastLocation) {
        this.setState(
          {
            confirmedNavigation: true,
          },
          () => {
            // onNavigate to the previous blocked location with your onNavigate function
            onNavigate(lastLocation.pathname)
          },
        )
      }
    })
  }

  render() {
    const { when } = this.props
    const { modalVisible } = this.state
    return (
      <>
        <Prompt when={when} message={this.handleBlockedNavigation} />
        <ConfirmDialog
          open={modalVisible}
          onClose={this.closeModal}
          onConfirm={this.handleConfirmNavigationClick}
          content='You have unsaved changes. Are you sure you want to leave this page?'
        />
      </>
    )
  }
}

RouteLeavingGuard.propTypes = {
  when: PropTypes.bool.isRequired,
  shouldBlockNavigation: PropTypes.func.isRequired,
  onNavigate: PropTypes.func.isRequired,
}

RouteLeavingGuard.defaultTypes = {
  when: false,
  shouldBlockNavigation: () => {},
  onNavigate: () => {},
}

export default RouteLeavingGuard
