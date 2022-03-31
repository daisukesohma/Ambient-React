import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'ambient_ui'
import { useMutation } from '@apollo/react-hooks'

import { CREATE_NODE_REQUEST } from './gql'

function RestartNodeButton({ onRestart, id }) {
  const [createNodeRequest] = useMutation(CREATE_NODE_REQUEST)

  const initializeRestartOnNode = nodeIdentifier => {
    const nodeRequestInput = {
      request: JSON.stringify({}),
      requestType: 'RESTART',
      nodeIdentifier,
    }

    createNodeRequest({
      variables: {
        data: nodeRequestInput,
      },
    })
  }

  const handleRestartClick = () => {
    initializeRestartOnNode(id)
    onRestart()
  }

  return (
    <Button variant="contained" color="primary" onClick={handleRestartClick}>
      Restart
    </Button>
  )
}

RestartNodeButton.propTypes = {
  onRestart: PropTypes.func,
  id: PropTypes.string,
}

RestartNodeButton.defaultTypes = {
  onRestart: () => {},
  id: '',
}

export default RestartNodeButton
