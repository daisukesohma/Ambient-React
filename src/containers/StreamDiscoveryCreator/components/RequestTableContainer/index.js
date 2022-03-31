import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, DropdownMenu, CircularProgress } from 'ambient_ui'
import { useParams, useHistory, useLocation } from 'react-router-dom'
import get from 'lodash/get'
import map from 'lodash/map'
import findIndex from 'lodash/findIndex'
import clsx from 'clsx'

import { useNodesByAccount } from 'common/hooks'
import { createDiscoveryRequested } from 'redux/slices/jobLog'
import {
  setIsCreatorDirty,
  saveCreatorData,
  saveCreatorSelectedRowIds,
} from 'redux/streamDiscovery/actions'
import { NodeRequestTypeEnum, StreamDiscoveryDataErrorEnum } from 'enums'
import ConfirmDialog from 'components/ConfirmDialog'
import { useCursorStyles, useFlexStyles } from 'common/styles/commonStyles'

import DiscoveryAutoSelection from './components/DiscoveryAutoSelection'
import useStyles from './styles'
import DiscoveryTable from './components/DiscoveryTable'
import PasswordTable from './components/PasswordTable'

const nodeSelectIndicator = { label: 'Select Node', value: null }

function RequestTableContainer() {
  const classes = useStyles()
  const cursorClasses = useCursorStyles()
  const flexClasses = useFlexStyles()
  const dispatch = useDispatch()
  const { account } = useParams()
  const { search } = useLocation()
  const currentSites = useSelector(state => state.auth.sites)
  const nodesData = useNodesByAccount(account)
  const history = useHistory()
  const [currentNodes, setCurrentNodes] = useState()
  const [nodeItems, setNodeItems] = useState([nodeSelectIndicator])
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false)
  const [isDiscoveryAutomatic, setIsDiscoveryAutomatic] = useState(false)
  const [isAutoSelectorVisible, setIsAutoSelectorVisible] = useState(true)

  const params = new URLSearchParams(search)
  const defaultNode = params.get('node')

  const getNodeOptions = () => {
    const nodeList = map(nodesData.data, node => ({
      label: node.name,
      value: node.identifier,
    }))
    setNodeItems([nodeSelectIndicator, ...nodeList])
  }

  const selectNode = node => {
    setSelectedNode(node)
    setDirty(true)
  }

  const handleDefaultSelection = () => {
    getNodeOptions()

    if (defaultNode) {
      selectNode(defaultNode)
    }
  }

  const selectManualDiscovery = () => {
    setIsDiscoveryAutomatic(true)
    setIsAutoSelectorVisible(false)
    handleDefaultSelection()
  }

  const selectAutoDiscovery = () => {
    setIsDiscoveryAutomatic(false)
    setIsAutoSelectorVisible(false)
    handleDefaultSelection()
  }

  const setDirty = isDirty => {
    dispatch(setIsCreatorDirty(isDirty))
  }

  // set currentNodes async
  useEffect(() => {
    if (currentSites && get(nodesData, 'data') && !currentNodes) {
      setCurrentNodes(nodesData.data)
    }
  }, [nodesData, currentNodes, currentSites])

  const [selectedNode, setSelectedNode] = useState(null)

  // to move from discovery table to credentials table
  const [isAddingPasswords, setIsAddingPasswords] = useState(false)

  const [discoveryData, setDiscoveryData] = useState()
  const [selectedDiscoveryRowIds, setSelectedDiscoveryRowIds] = useState()
  const [selectedDiscoveryData, setSelectedDiscoveryData] = useState()

  const [credentialData, setCredentialData] = useState()

  const [dataErrors, setDataErrors] = useState([])
  // currently selectedDiscoveryRowIds can be OFF if they added rows after selection

  // get completed discovery data anytime you move to password table
  useEffect(() => {
    if (discoveryData && selectedDiscoveryRowIds) {
      setSelectedDiscoveryData(
        discoveryData.filter((data, index) =>
          selectedDiscoveryRowIds.includes(index),
        ),
      )
    }
  }, [isAddingPasswords, discoveryData, selectedDiscoveryRowIds])

  // start click handlers
  const handleNodeSelection = node => {
    if (node && get(node, 'value')) {
      selectNode(node.value)
    }
  }

  // end click handlers

  const getEndpoints = () => {
    // example selected discovery data
    // [{name: "gee", ip: "2.3.4.5", port: "554"}
    // {name: "sadf", ip: "1.2.34.2", port: "554"}]
    //
    return selectedDiscoveryData
      ? selectedDiscoveryData.map(item => ({
          ip: item.ip,
          subnet: '', // FUTURE @Vikesh do you want an empty string or null
          name: item.name, // need to add Camera name here!
        }))
      : []
  }

  // returns Array[Number] of ports
  const getPorts = () => {
    return selectedDiscoveryData
      ? Array.from(
          new Set(selectedDiscoveryData.map(item => Number(item.port))),
        )
      : []
  }

  // Product spec
  // https://docs.google.com/document/d/13UVh2ax9auWldyryKiRzW-ittta0SUsfgaPcYLAIl14/edit#
  const handleComplete = () => {
    const requestJson = JSON.stringify({
      capture_frame: false,
      credentials: credentialData,
      endpoints: getEndpoints(),
      ports: getPorts(),
      resolution: '64x64',
      can_nmap: true,
      scan_onvif: true,
      scan_onvif_wsd: false,
    })

    // NOTE: @eric  this is jobLog reducer currently
    dispatch(
      createDiscoveryRequested({
        requestJson,
        nodeIdentifier: selectedNode,
        requestType: NodeRequestTypeEnum.DISCOVERY,
      }),
    )
    setDirty(false) // Note: this is streamDiscovery reducer. Should consolidate or have one entry point for the discovery request
    dispatch(saveCreatorData([]))
    dispatch(saveCreatorSelectedRowIds([]))
  }

  const currentNodeStreamCount = 10
  const isAddPasswordsEnabled =
    (isDiscoveryAutomatic &&
      selectedNode &&
      discoveryData &&
      selectedDiscoveryRowIds &&
      selectedDiscoveryRowIds.length > 0) ||
    (!isDiscoveryAutomatic && selectedNode)

  const uniqueValues = (array, value) => {
    const uniqueObjects = new Set()

    for (let i = 0; i < array.length; i++) {
      uniqueObjects.add(array[i][value])
    }
    return [...uniqueObjects]
  }

  useEffect(() => {
    if (selectedDiscoveryData) {
      const ipResult =
        uniqueValues(selectedDiscoveryData, 'ip').length ===
        selectedDiscoveryData.length
      const isValidData =
        findIndex(
          selectedDiscoveryData,
          selectedRow => !selectedRow.name || !selectedRow.ip,
        ) === -1
      const errors = []
      if (!ipResult) errors.push(StreamDiscoveryDataErrorEnum.NON_UNIQUE_IPS)
      if (!isValidData) errors.push(StreamDiscoveryDataErrorEnum.INVALID_DATA)
      setDataErrors(errors)
    }
  }, [selectedDiscoveryData, dataErrors.length])

  const handleCancel = () => {
    if (discoveryData && discoveryData.length > 0) {
      setIsConfirmationVisible(true)
    } else {
      goBackToJobs()
    }
  }

  const handleSetDiscoveryData = data => {
    setDiscoveryData(data)
    if (data && data.length > 0) {
      setDirty(true)
    }
  }

  const handleSetSelectedRowIds = data => {
    setSelectedDiscoveryRowIds(data)

    if (data && data.length > 0) {
      setDirty(true)
    }
  }

  const goBackToJobs = () => {
    history.push(`/accounts/${account}/infrastructure/jobs`)
  }

  const getInvalidData = () => {
    if (dataErrors.length > 0) {
      let sentence = 'Invalid Rows Selected: '
      for (let i = 0; i < dataErrors.length; i++) {
        if (i > 0) sentence += ', '
        sentence += dataErrors[i]
      }
      return (
        <div style={{ paddingRight: '5px', paddingTop: '5px' }}>
          <span style={{ color: 'red' }}>{sentence}</span>
        </div>
      )
    }
    return <div />
  }

  const getAssistanceText = () => {
    // Automatic Scan
    if (!isAutoSelectorVisible && !isAddingPasswords && !isDiscoveryAutomatic) {
      return (
        <div className={clsx(flexClasses.row, flexClasses.centerBetween)}>
          <span>
            Select a node above to run Ambient's Stream Discovery scan on.
          </span>
          <span
            onClick={() => selectManualDiscovery()}
            className={clsx(
              'am-overline',
              cursorClasses.clickableText,
              cursorClasses.pointer,
            )}
          >
            Switch to Manual Entry
          </span>
        </div>
      )
    }
    if (isDiscoveryAutomatic && !isAddingPasswords) {
      return (
        <div className={clsx(flexClasses.row, flexClasses.centerBetween)}>
          <span>
            Add a node above to run Discovery on. Then add cameras with a CSV
            file or individually and select the ones Ambient should discover.{' '}
          </span>
          <span
            onClick={() => {
              selectAutoDiscovery()
            }}
            className={clsx(
              'am-overline',
              cursorClasses.clickableText,
              cursorClasses.pointer,
            )}
          >
            Switch to Automatic Scan
          </span>
        </div>
      )
    }
    if (isAddingPasswords) {
      return 'Add all known passwords for your cameras so Discovery has the best chance of connecting to the cameras on your network.'
    }

    return null
  }

  const isFinishEnabled =
    !isDiscoveryAutomatic ||
    discoveryData ||
    (discoveryData && discoveryData.length >= 0)

  if (nodesData.loading) {
    return (
      <div className={classes.loading}>
        <CircularProgress />
      </div>
    )
  }

  return (
    <div>
      {isAutoSelectorVisible && (
        <DiscoveryAutoSelection
          handleClose={() => setIsAutoSelectorVisible(false)}
          handleOptionOne={selectManualDiscovery}
          handleOptionTwo={selectAutoDiscovery}
        />
      )}
      <ConfirmDialog
        open={isConfirmationVisible}
        onClose={() => {
          setIsConfirmationVisible(false)
          setDirty(false)
        }}
        onConfirm={() => {
          goBackToJobs()
          setDirty(false)
          setIsConfirmationVisible(false)
        }}
        content='Are you sure you want to delete your Stream Discovery data?'
      />
      {!isAutoSelectorVisible && (
        <>
          <div className={classes.actionBar}>
            {nodeItems && (
              <>
                <DropdownMenu
                  menuItems={nodeItems}
                  handleSelection={handleNodeSelection}
                  selectedItem={nodeItems.find(
                    item => item.value === (selectedNode || defaultNode),
                  )}
                />
              </>
            )}
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              width: '100%',
              marginBottom: 32,
            }}
          >
            <div
              className={clsx('am-body1', classes.selectText)}
              style={{ width: '100%', marginRight: 24 }}
            >
              {getAssistanceText()}
            </div>
          </div>
          <div className={classes.tableContainer}>
            {!isAddingPasswords && isDiscoveryAutomatic && (
              <DiscoveryTable
                nodeStreamCount={currentNodeStreamCount}
                setDiscoveryData={handleSetDiscoveryData}
                setSelectedDiscoveryRowIds={handleSetSelectedRowIds}
              />
            )}
            {isAddingPasswords && (
              <PasswordTable
                setCredentialData={data => setCredentialData(data)}
              />
            )}
          </div>
          {!isAutoSelectorVisible && (
            <div className={classes.bottomContainer}>
              {getInvalidData()}
              {!isAddingPasswords && (
                <>
                  <Button onClick={handleCancel} variant='text' color='primary'>
                    Cancel
                  </Button>
                  <Button
                    disabled={dataErrors.length > 0 || !isAddPasswordsEnabled}
                    color='primary'
                    onClick={() => {
                      // validateDiscoveryData() // ensure values are sane and not too many are added
                      setIsAddingPasswords(true)
                      dispatch(saveCreatorData(discoveryData))
                      dispatch(
                        saveCreatorSelectedRowIds(selectedDiscoveryRowIds),
                      )
                    }}
                  >
                    Continue
                  </Button>
                </>
              )}
              {isAddingPasswords && (
                <>
                  <Button
                    onClick={() => setIsAddingPasswords(false)}
                    variant='text'
                    color='primary'
                  >
                    Back
                  </Button>
                  <Button
                    disabled={!isFinishEnabled}
                    color='primary'
                    onClick={handleComplete}
                  >
                    Finish
                  </Button>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default RequestTableContainer
