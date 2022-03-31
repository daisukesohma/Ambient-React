import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'ambient_ui'
import { useDispatch } from 'react-redux'
import { nodeCreateRequested } from 'redux/slices/appliances'

import useStyles from './styles'

const NodeUpgradeButton = ({ nodeIdentifier, refetch, metadata }) => {
  const dispatch = useDispatch()
  const classes = useStyles()

  // construct GQL data
  const upgradeData = {
    nodeIdentifier,
    request: metadata,
  }

  // Execute GQL Query
  const initializeUpgradeOnNode = (id, request) => {
    const nodeRequestInput = {
      request: JSON.stringify(request),
      requestType: 'UPGRADE',
      nodeIdentifier: id,
    }
    dispatch(nodeCreateRequested({ nodeRequestInput }))

    refetch() // https://www.apollographql.com/docs/react/data/queries/
  }

  // Click Handler
  const handleUpgradeClick = data => () => {
    initializeUpgradeOnNode(data.nodeIdentifier, data.request)
  }

  return (
    <Button
      variant='outlined'
      color='primary'
      onClick={handleUpgradeClick(upgradeData)}
      classes={{
        root: classes.buttonRoot,
        label: classes.buttonLabel,
      }}
    >
      Upgrade
    </Button>
  )
}

NodeUpgradeButton.defaultProps = {
  nodeIdentifier: '',
  refetch: () => {},
  metadata: '', // metadata is stringified json about the noderequest
}

NodeUpgradeButton.propTypes = {
  nodeIdentifier: PropTypes.string,
  refetch: PropTypes.func, // refetch is a callback function
  metadata: PropTypes.string, // metadata is stringified json about the noderequest
}

export default NodeUpgradeButton
