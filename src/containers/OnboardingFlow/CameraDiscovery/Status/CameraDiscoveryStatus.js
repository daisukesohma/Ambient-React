import React, { useEffect, useState } from 'react'
import { useTheme, makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import { Button, DataTable } from 'ambient_ui'
import CircularProgress from '@material-ui/core/CircularProgress'
import Chip from '@material-ui/core/Chip'
import DoneIcon from '@material-ui/icons/Done'
import DoneAllIcon from '@material-ui/icons/DoneAll'
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline'
import get from 'lodash/get'

import { getAccountSlug } from '../../../../utils'
import { NodeRequestStatusEnum } from '../../../../enums'

import { ALL_NODE_DISCOVERY_REQUESTS_BY_NODE_IDENTIFIER } from './gql'

const useStyles = makeStyles({
  label: {
    fontSize: 14,
  },
})

// FUTURE: @eric can rewrite to function createData(request) {}
function createData(nodeName, nodeId, status, request, requestId) {
  // requestId is not rendered, but used in the href link to the request status page
  return { nodeName, nodeId, status, request, requestId }
}

function renderDiscoveryRequest(requestObj) {
  const { ips, subnets, credentials } = requestObj
  const credentialCount = credentials && credentials.length

  return (
    <>
      {ips.length > 0 && (
        <div>
          IPs:{' '}
          {ips.map((ip, index) => (
            <span key={`${ip.ip}-${index}`}>{ip.ip}, </span>
          ))}
        </div>
      )}
      {subnets.length > 0 && (
        <div>
          Subnets:{' '}
          {subnets.map((ip, index) => (
            <span key={`${ip.ip}-${index}`}>{ip.ip}, </span>
          ))}
        </div>
      )}
      {credentialCount && (
        <div>
          {credentialCount}{' '}
          {credentialCount === 1 ? 'credential' : 'credentials'}
        </div>
      )}
    </>
  )
}

const CameraDiscoveryStatus = ({
  accountSlug,
  history,
  match: {
    params: { nodeId, site: siteSlug },
  },
}) => {
  const { palette } = useTheme()
  const classes = useStyles()
  const [rowsData, setRowData] = useState([])
  const { data: requestData } = useQuery(
    ALL_NODE_DISCOVERY_REQUESTS_BY_NODE_IDENTIFIER,
    {
      variables: {
        nodeIdentifier: nodeId,
      },
      pollInterval: 30000,
    },
  )

  useEffect(() => {
    if (get(requestData, 'allNodeDiscoveryRequestsByNodeIdentifier')) {
      setRowData(
        requestData.allNodeDiscoveryRequestsByNodeIdentifier.map(r => {
          return createData(
            r.node.name,
            nodeId,
            r.status || 'N/A',
            renderDiscoveryRequest(JSON.parse(r.request)),
            r.id,
          )
        }),
      )
    }
    // eslint-disable-next-line
  }, [requestData])

  // TODO: @Eric Reorganize how createData is storing data
  // with request and columns = [{ ... field: 'request.id'}]
  // refactor renderDiscoveryRequest to a render: function of column

  const columns = [
    { title: 'Appliance Name', field: 'nodeName' },
    { title: 'Appliance S/N', field: 'nodeId' },
    { title: 'Request', field: 'request' },
    { title: 'Status', field: 'status', render: renderStatus },
    { title: 'Actions', render: renderAction },
  ]

  /* eslint-disable react/prop-types */
  function renderStatus({ status }) {
    let icon
    let label = status.toUpperCase() // default
    if (status === NodeRequestStatusEnum.INCOMPLETE) {
      icon = <ErrorOutlineIcon />
      label = 'Camera Discovery To Begin'
    } else if (status === NodeRequestStatusEnum.INPROGRESS) {
      icon = <CircularProgress size={18} />
      label = 'Camera Discovery In-Progress'
    } else if (status === NodeRequestStatusEnum.COMPLETE) {
      icon = <DoneIcon />
      label = 'Camera Discovery Complete'
    } else if (status === NodeRequestStatusEnum.CAMERA_ACTIVATED) {
      icon = <DoneAllIcon />
      label = 'All Tasks Complete'
    }

    return (
      <Chip
        variant='outlined'
        label={label}
        icon={icon}
        classes={{ label: classes.label }}
      />
    )
  }

  function renderAction({ requestId, status }) {
    if (status === NodeRequestStatusEnum.CAMERA_ACTIVATED) {
      return <>Camera Discovery & Camera Selection complete. </>
    }
    if (status === NodeRequestStatusEnum.COMPLETE) {
      return (
        <Button
          variant='outlined'
          color='primary'
          onClick={() =>
            history.push(
              `/accounts/${accountSlug}/sites/${siteSlug}/appliances/${nodeId}/${requestId}/cameras/activate`,
            )
          }
        >
          Next
        </Button>
      )
    }
    if (status === NodeRequestStatusEnum.INPROGRESS) {
      return <>Awaiting Camera Discovery completion to continue.</>
    }
    if (status === NodeRequestStatusEnum.INCOMPLETE) {
      return (
        <>Awaiting appliance initialization to continue to Camera Discovery.</>
      )
    }
    return <div />
  }

  const VerticalDivider = () => {
    return <span style={{ marginLeft: 5, marginRight: 5 }}>|</span>
  }

  function renderStatusSummary() {
    const incompleteTotal = rowsData.filter(
      r => r.status === NodeRequestStatusEnum.INCOMPLETE,
    ).length
    const inprogressTotal = rowsData.filter(
      r => r.status === NodeRequestStatusEnum.INPROGRESS,
    ).length
    const completeTotal = rowsData.filter(
      r => r.status === NodeRequestStatusEnum.COMPLETE,
    ).length

    return (
      <>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            color: palette.grey[600],
          }}
        >
          <span>{incompleteTotal} Incomplete</span>
          <VerticalDivider />
          <span>{inprogressTotal} In-Progess</span>
          <VerticalDivider />
          <span>{completeTotal} Complete</span>
        </div>
      </>
    )
  }

  function renderTitle() {
    return (
      <div style={{ paddingTop: 20, paddingBottom: 20 }}>
        <div>Camera Discovery</div>
        <div>{renderStatusSummary()}</div>
      </div>
    )
  }
  /* eslint-enable react/prop-types */

  return (
    <>
      <div style={styles.table}>
        <DataTable
          title={renderTitle()}
          columns={columns}
          data={rowsData}
          options={{
            paging: false,
            search: false,
          }}
        />
      </div>
    </>
  )
}

CameraDiscoveryStatus.propTypes = {
  accountSlug: PropTypes.string,
  match: PropTypes.shape({
    params: PropTypes.shape({
      nodeId: PropTypes.string,
      site: PropTypes.string,
    }),
  }),
  history: PropTypes.func,
}

CameraDiscoveryStatus.defaultTypes = {
  accountSlug: '',
  match: {
    params: {
      nodeId: '',
      site: '',
    },
  },
  history: () => {},
}

const mapStateToProps = state => ({
  accountSlug: getAccountSlug(state),
})

export default connect(
  mapStateToProps,
  null,
)(withRouter(CameraDiscoveryStatus))

let styles = {
  table: {
    marginTop: 30,
  },
}
