import React, { useState, useEffect } from 'react'
import { useTheme } from '@material-ui/core/styles'
import { Button, DropdownMenu } from 'ambient_ui'
import get from 'lodash/get'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'
import clsx from 'clsx'
import map from 'lodash/map'

import Divider from 'components/Divider'
import AnimatedValue from 'components/Animated/Value'
import MenuItemLabel from 'components/Menus/MenuItemLabel'
import SimpleLabel from 'components/Label/SimpleLabel'
import ConfirmDialog from 'components/ConfirmDialog'
import {
  selectedNodeChanged,
  createStreamsRequested,
  toggleConfirmModal,
} from 'redux/streamDiscovery/actions'
import { useFlexStyles } from 'common/styles/commonStyles'
import ipGroupedStreamRequests from 'selectors/streamDiscovery/ipGroupedStreamRequests'

import useStyles from './styles'

function StreamDiscoverySelectorToolbar() {
  const theme = useTheme()
  const {
    nodes,
    nodeRequest,
    streamsToCreate,
    selectedNode,
    showModal,
  } = useSelector(state => state.streamDiscovery)
  const groupedStreams = useSelector(ipGroupedStreamRequests)
  const classes = useStyles()
  const flexClasses = useFlexStyles()
  const [nodeOptions, setNodeOptions] = useState([])
  const dispatch = useDispatch()
  const history = useHistory()
  const { account } = useParams()

  // selectedNode can be none
  // if so, get the only node
  useEffect(() => {
    if (get(nodes, '[0]')) {
      // mock a node option with the data key
      dispatch(selectedNodeChanged({ data: nodes[0] }))
    }
  }, [nodes, dispatch])

  // const selectedNode = get(nodes, '[0]')
  useEffect(() => {
    if (nodes.length > 0) {
      setNodeOptions(
        nodes.map((node, i) => {
          return {
            label: <MenuItemLabel name={node.name} type='node' />,
            index: i,
            data: node,
          }
        }),
      )
    }
  }, [nodes])

  const changeNodeSelection = selection => {
    if (selection) {
      dispatch(selectedNodeChanged(selection))
    }
  }

  const cancelConfirmModal = () => {
    dispatch(toggleConfirmModal())
  }

  const executeSave = () => {
    const streamsData = streamsToCreate.map(streamToCreate => ({
      regionId: get(streamToCreate, 'regionId'),
      nodeId: get(selectedNode, 'identifier'),
      name: get(streamToCreate, 'streamName'),
      identifier: get(streamToCreate, 'streamUrl'),
      siteId: get(streamToCreate, 'siteId'),
    }))
    dispatch(createStreamsRequested({ data: streamsData }))
    dispatch(toggleConfirmModal())
    history.push(`/accounts/${account}/infrastructure/jobs`)
  }

  const handleSaveButton = () => {
    dispatch(toggleConfirmModal())
  }

  function ConfirmRestartContent() {
    return (
      <div>
        <div>Adding new streams requires an appliance restart.</div>
        <div style={{ marginTop: 16, color: theme.palette.grey[500] }}>
          This will cause momentary appliance downtime, which will prevent
          viewing streams and receiving alerts.
        </div>
        <div style={{ marginTop: 16 }}>Do you want to continue?</div>
      </div>
    )
  }

  const totalStreamsFound = [].concat(
    [],
    ...map(groupedStreams, group => group.streamRequests),
  ).length

  return (
    <>
      <ConfirmDialog
        open={showModal}
        onClose={cancelConfirmModal}
        onConfirm={executeSave}
        loading={false}
        content={<ConfirmRestartContent />}
      />
      <div className={clsx(flexClasses.row, flexClasses.centerBetween)}>
        <div className={clsx(flexClasses.row, flexClasses.centerStart)}>
          {nodeRequest && (
            <>
              {nodeOptions.length >= 1 && (
                <>
                  <div
                    style={{
                      display: nodeOptions.length === 1 ? 'none' : 'block',
                    }}
                  >
                    <DropdownMenu
                      menuItems={nodeOptions}
                      selectedItem={nodeOptions.find(
                        item => item.value === selectedNode,
                      )}
                      handleSelection={changeNodeSelection}
                    />
                  </div>
                </>
              )}
              {nodeOptions.length === 1 && (
                <div
                  className={clsx(
                    'am-overline',
                    classes.text,
                    classes.textSpacing,
                  )}
                >
                  <span>{get(nodes, '[0].name')}</span>
                  <span>
                    <SimpleLabel>Node</SimpleLabel>
                  </span>
                </div>
              )}
              <Divider />
              <div className={flexClasses.column}>
                <div
                  className={clsx(
                    'am-overline',
                    classes.text,
                    classes.textSpacing,
                  )}
                >
                  <span>
                    <AnimatedValue value={streamsToCreate.length} /> streams
                    selected
                  </span>
                </div>
                <div
                  className={clsx(
                    'am-overline',
                    classes.text,
                    classes.textSpacing,
                    classes.subTextColor,
                  )}
                >
                  <span>
                    {totalStreamsFound} streams on{' '}
                    {Object.keys(groupedStreams).length} Cameras Discovered
                  </span>
                </div>
              </div>
              {get(selectedNode, 'activeStreamCount') && (
                <>
                  <Divider />
                  <div className={flexClasses.column}>
                    <div
                      className={clsx(
                        'am-overline',
                        classes.text,
                        classes.textSpacing,
                      )}
                    >
                      {`${200 -
                        selectedNode.activeStreamCount} Streams available on ${get(
                        nodes,
                        '[0].name',
                      )}`}
                    </div>
                    <div
                      className={clsx(
                        'am-overline',
                        classes.text,
                        classes.textSpacing,
                        classes.subTextColor,
                      )}
                    >
                      {selectedNode.activeStreamCount} Streams Used on{' '}
                      <span>{get(nodes, '[0].name')}</span>
                    </div>
                  </div>
                  <Divider />
                </>
              )}
            </>
          )}
        </div>
        <div className={clsx(flexClasses.row, flexClasses.centerEnd)}>
          <Button
            variant='text'
            color='primary'
            onClick={() =>
              history.push(`/accounts/${account}/infrastructure/jobs`)
            }
          >
            Cancel
          </Button>
          <div className={classes.saveButton}>
            <Button onClick={handleSaveButton}>Save</Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default StreamDiscoverySelectorToolbar
