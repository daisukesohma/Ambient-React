import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'ambient_ui'
import { makeStyles } from '@material-ui/core/styles'
import { useMutation } from '@apollo/react-hooks'

import { CREATE_NODE_REQUEST } from '../common/gql/node'

// PROPS:
// refetch is a callback function
// metadata is stringified json about the noderequest
//

const useStyles = makeStyles(theme => ({
  buttonRoot: {
    borderRadius: '20px !important',
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: 600,
  },
  paper: {
    width: '100%',
    position: 'relative',
    border: 'unset',
  },
}))

const NodeUpgradeButton = ({ nodeIdentifier, refetch, metadata }) => {
  const classes = useStyles()
  const [createNodeRequest] = useMutation(CREATE_NODE_REQUEST)

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

    createNodeRequest({
      variables: {
        data: nodeRequestInput,
      },
    })

    refetch() // https://www.apollographql.com/docs/react/data/queries/
  }

  // Click Handler
  const handleUpgradeClick = data => () => {
    initializeUpgradeOnNode(data.nodeIdentifier, data.request)
  }

  return (
    <Button
      variant="outlined"
      color="primary"
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
  metadata: '',
}

NodeUpgradeButton.propTypes = {
  nodeIdentifier: PropTypes.string,
  refetch: PropTypes.func,
  metadata: PropTypes.string,
}

export default NodeUpgradeButton
