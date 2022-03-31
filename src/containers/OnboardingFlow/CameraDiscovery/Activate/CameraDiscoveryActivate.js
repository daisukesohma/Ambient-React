import React, { useEffect, useState } from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { Button, DataTable, DropdownMenu } from 'ambient_ui'
import TextField from '@material-ui/core/TextField'
import get from 'lodash/get'

import useRegions from '../../../../common/hooks/useRegions'
import { useStyles } from '../../common/styles'
import { arrayGroupBy, getAccountSlug } from '../../../../utils'

import {
  ALL_NODE_DISCOVERY_REQUESTS_BY_NODE_IDENTIFIER,
  ALL_STREAMS_DISCOVERED_BY_REQUEST,
  CREATE_STREAM,
  UPDATE_NODE_DISCOVERY_REQUEST_STATUS,
} from './gql'

const ONBOARDING_COMPLETE_STATUS = 'onboardingcomplete' // TODO @eric replace with enum

// TODO @eric Redo createData
// We store row data and selected values for the row. On Selection, all of this data will be passed
// We only render out fields in the columns variable, but other data is stored for use in submission and keeping track of index to help mutate data.
// Default data is useful mainly for metadata field from StreamDiscovered table (but AFAIK, we do not store metadata in Stream table rn.)
//
function createData(
  idx,
  ip,
  urls,
  name,
  thumbnails,
  selectedUrl,
  selectedThumbnail,
  selectedRegionId,
  defaultData,
) {
  return {
    idx,
    ip,
    urls,
    name,
    thumbnails, // mapped list of thumbnail urls
    selectedUrl,
    selectedThumbnail,
    selectedRegionId,
    defaultData,
    tableData: {
      // material-table default checked box
      checked: true,
    },
  }
}

// Column Render Helper
//

function renderSelectedThumbnail(rowData) {
  const { selectedThumbnail } = rowData
  const width = 366.75
  const height = 275.062
  const ratio = 0.3
  return (
    <>
      <img
        src={selectedThumbnail}
        alt=''
        style={{ height: height * ratio, width: width * ratio }}
      />
    </>
  )
}

const groupByIp = arrayGroupBy('cameraIp') // the key inside the StreamDiscoveredType object
function transformStreamDiscoveredData(data) {
  return groupByIp(data)
}

//
// This CameraDiscoveryActivate component uses material-table.
// RowData is each row's data, which holds rendered elements and state-like variables per row (input/select mutable data)
// ChangeData is how RowData changes.

// inputs array of urls
function createMenuItemData(label, value) {
  return { label, value }
}

// Main Component
//
function CameraDiscoveryActivate({
  accountSlug,
  history,
  match: {
    params: { nodeId, requestId, site: siteSlug },
  },
}) {
  const { palette } = useTheme()
  const classes = useStyles()
  const [rowData, setRowData] = useState([]) // each row's data. Included rendered data (Select dropdowns), as well as state data (selectedUrl) per row.
  const regions = useRegions() // custom hook, grabs regions from db or provides default
  const [changeData, setChangeData] = useState(null) // when form data changes (ie. Select boxes or input fields), store state change here, then change rowData in useEffect
  const [createStream, { data: createStreamData }] = useMutation(CREATE_STREAM)
  const [updateRequestStatus] = useMutation(
    UPDATE_NODE_DISCOVERY_REQUEST_STATUS,
  )

  // for keeping track of custom name, which when finished, is written to rowData
  const [customName, setCustomName] = useState(undefined)
  const [isEditingName, setEditingName] = useState(false)
  const [nameIndex, setNameIndex] = useState(undefined)

  // Table's rendered columns and corresponding rowData fields
  const columns = [
    { title: 'IP', field: 'ip' }, // , defaultGroupOrder: 0},
    { title: 'Urls', render: renderUrls },
    { title: 'Name', render: renderName },
    { title: 'Thumbnail', render: renderSelectedThumbnail }, // FIXME: do we need to define field AND render, or just one
    { title: 'Zone', render: renderZones },
  ]

  // On selection change, gets data into changeData object
  const handleIndexSelection = (idx, field) => val => {
    setChangeData({
      idx,
      field,
      value: val.value,
    })
  }

  // each rowData has name, which is the "set" name for that row
  // if user clicks into name, it will write to "local state" of customName
  // when input is unfocused, customName is written to rowData's name key
  //
  // eslint-disable-next-line react/prop-types
  function renderName({ idx, name }) {
    const isEditingRow = isEditingName && nameIndex === idx

    function setInitial() {
      setNameIndex(idx)
      setEditingName(true)
      setCustomName(name)
    }

    function reset() {
      setEditingName(false)
      setNameIndex(null)
      setCustomName(null)
    }

    function setName() {
      // this sets the "customName" to the row's name property.
      setChangeData({
        idx,
        field: 'name',
        value: customName,
      })
      reset()
    }

    // handles Enter within input box
    function handleEnter(e) {
      if (e.key === 'Enter') {
        setName()
      }
    }
    return (
      <>
        {!isEditingRow && <div onClick={setInitial}>{name}</div>}
        {isEditingRow && (
          <TextField
            required
            label='Name'
            name='name'
            className={classes.textFieldSize}
            value={customName}
            onChange={e => setCustomName(e.target.value)}
            onBlur={setName}
            onKeyDown={handleEnter}
            onFocus={e => e.target.select()} // on focus, selects all text
            margin='normal'
            variant='outlined'
            InputProps={{
              style: {
                padding: '18.5px 14px', // override for looking like themed text field
                minWidth: 125,
              },
            }}
          />
        )}
      </>
    )
  }

  // Render RTSP URLS
  // eslint-disable-next-line react/prop-types
  function renderUrls({ idx, urls }) {
    // eslint-disable-next-line react/prop-types
    const count = urls && urls.length

    if (count === 1) {
      // If one URL, just show it.
      return <span>{urls[0]}</span>
    }
    if (count > 1) {
      // Else, allow Select Dropdown of URL
      // eslint-disable-next-line react/prop-types
      const menuItems = urls.map(url => createMenuItemData(url, url))
      return (
        <>
          <DropdownMenu
            menuItems={menuItems}
            selectedItem={menuItems.find(
              item => item.value === get(changeData, 'value'),
            )}
            handleSelection={handleIndexSelection(idx, 'selectedUrl')}
          />
          <span>{count} streams found. Select one.</span>
        </>
      )
    }

    return <div />
  }

  // eslint-disable-next-line react/prop-types
  function renderZones({ idx }) {
    const menuItems = regions.map(r => createMenuItemData(r.name, r.id))
    return (
      <>
        <DropdownMenu
          menuItems={menuItems}
          selectedItem={menuItems.find(
            item => item.value === get(changeData, 'value'),
          )}
          handleSelection={handleIndexSelection(idx, 'selectedRegionId')}
        />
      </>
    )
  }

  // Change the rowData here when changeData state var is changed
  // We handle 'selectedUrl' differently from the base case only because we need to also
  // change selectedThumbnail on the row when url changes.
  //
  useEffect(() => {
    if (changeData) {
      let newRowData
      if (changeData.field === 'selectedUrl') {
        // if field is selectedUrl, we change two fields, selectedUrl and selectedThumbnail
        // FIXME: this is not ideal to have if/else branching to decide newRowData, but it works for now.
        newRowData = rowData.map(r => {
          // If changeData's index is original data's (rowData) index, then change it
          //

          if (r.idx === changeData.idx) {
            // A bit of a hack. Get index of selected Url value from urls array, and apply that to thumbnails array
            const selectedIndex = r.urls.findIndex(
              url => url === changeData.value,
            )

            const newRow = {
              ...r,
              selectedUrl: changeData.value,
              selectedThumbnail: r.thumbnails[selectedIndex], // set both url and thumbnail when url is selected.
            }
            return newRow
          }
          // else, don't change data if idx isn't in changeData state
          return r
        })
      } else {
        // handle the general case
        newRowData = rowData.map(r => {
          // If changeData's index is original data's (rowData) index, then change it
          //
          if (r.idx === changeData.idx) {
            // New data according to the Select box or input box (future! for the Camera Name)
            const newRow = {
              ...r,
              [changeData.field]: changeData.value, // overwrite either selectedUrl or selectedRegionId
            }

            return newRow
          }
          // else, don't change data if idx isn't in changeData state
          return r
        })
      }

      setRowData(newRowData) // set rowData to be changed data
      setChangeData(null)
    }
    // eslint-disable-next-line
  }, [changeData]) // and only run when lightgraychangeData changes

  // Get Stream Discovered Data from DB
  //
  const { data: discoveredData } = useQuery(ALL_STREAMS_DISCOVERED_BY_REQUEST, {
    variables: {
      nodeIdentifier: nodeId,
      requestId,
    },
  })

  // Set data into rowData if there is no data yet and we have received data from db
  // rowData is a combination of rendered React elements to display and data we will mutate later that store's each row's state (ie. selected urls, region, name)
  //
  useEffect(() => {
    if (get(discoveredData, 'allStreamsDiscoveredByRequest')) {
      const groupedByIpData = transformStreamDiscoveredData(
        discoveredData.allStreamsDiscoveredByRequest,
      ) // { ip1: [{ streamDisvered data }]}
      const uniqueIps = Object.keys(groupedByIpData)
      setRowData(
        uniqueIps.map((ip, idx) => {
          const urls = groupedByIpData[ip].map(x => x.url) // array of urls grouped by ip
          const thumbnails = groupedByIpData[ip].map(x => x.cameraThumbnail) // array of thumbnail images grouped by ip, corresponding to urls

          return createData(
            idx,
            ip,
            urls,
            `${ip} Cam`,
            thumbnails,
            groupedByIpData[ip][0].url, // first url as selected default
            groupedByIpData[ip][0].cameraThumbnail,
            regions[0].id, // default region,
            groupedByIpData[ip][0], // default all data
          )
        }),
      )
    }
    // eslint-disable-next-line
  }, [discoveredData])

  function successRedirect() {
    history.push(
      `/accounts/${accountSlug}/sites/${siteSlug}/appliances/${nodeId}/${requestId}/cameras/complete`,
    )
  }

  function setRequestStatus(status) {
    updateRequestStatus({
      variables: {
        id: requestId,
        status,
      },
      refetchQueries: [
        {
          query: ALL_NODE_DISCOVERY_REQUESTS_BY_NODE_IDENTIFIER,
          variables: {
            nodeIdentifier: nodeId,
          },
        },
      ],
    })
  }

  function completeRequestToStream() {
    setRequestStatus(ONBOARDING_COMPLETE_STATUS) // If createStream succeeds, update Request status to "onboardingcomplete"
    successRedirect()
  }

  useEffect(() => {
    if (get(createStreamData, 'createStream.ok')) {
      completeRequestToStream()
    }
    // eslint-disable-next-line
  }, [createStreamData])

  // Saves data from table to Streams Table in DB
  function saveData(data) {
    const submitData = data.map(d => ({
      name: d.name,
      identifier: d.selectedUrl,
      nodeId,
      regionId: d.selectedRegionId,
      // cameraIp: d.ip,
      // metadata: d.defaultData.metadata
    }))
    // Save Discovered Streams selected INTO Stream Table in DB
    createStream({
      variables: {
        data: submitData,
      },
    })
  }

  function emptyMessage() {
    const style = {
      messageContainer: {
        height: 250,
        fontSize: 18,
        backgroundColor: palette.grey[100],
        paddingTop: 40,
      },
      messageNoneFound: {
        color: palette.grey[600],
        marginBottom: 15,
      },
      divLink: {
        cursor: 'pointer',
        color: '#337ab7',
      },
    }
    return (
      <div style={style.messageContainer}>
        <div style={style.messageNoneFound}>
          Oops. No streams were discovered.
        </div>
        <div>
          <div>
            Check
            <Link
              to={`/accounts/${accountSlug}/sites/${siteSlug}/appliances/${nodeId}/cameras/discover`}
            >
              {' '}
              Camera Discovery Status
            </Link>
          </div>
          <div>or</div>
          <div>
            <Link
              to={`/accounts/${accountSlug}/sites/${siteSlug}/appliances/${nodeId}/cameras/config`}
            >
              Run Camera Discovery again?
            </Link>
          </div>
          <div>
            <div>or</div>
            <div style={style.divLink} onClick={completeRequestToStream}>
              Continue and complete
            </div>{' '}
            Camera Selection without adding any streams.
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <DataTable
        title={<div>Streams</div>}
        columns={columns}
        data={rowData}
        localization={{
          toolbar: {
            nRowsSelected: '{0} Streams To Be Monitored',
          },
          body: {
            emptyDataSourceMessage: emptyMessage(),
          },
        }}
        components={{
          // Basically recreate Toolbar by hand since <MTableToolbar /> does not show up properly
          // eslint-disable-next-line react/prop-types, react/display-name
          Toolbar: ({ selectedRows }) => {
            // eslint-disable-next-line react/prop-types
            const count = selectedRows.length
            if (count > 0) {
              return (
                <div
                  style={{
                    minHeight: 64,
                    paddingRight: 8,
                    paddingLeft: 24,
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: palette.secondary[50],
                    flexDirection: 'row',
                  }}
                >
                  <div>
                    <div
                      style={{
                        color: palette.primary[700],
                        fontWeight: 'bold',
                        fontSize: 15,
                      }}
                    >
                      {count} Streams Selected
                    </div>
                    <div>
                      Edit streams below, choosing Url and Threat Zone per
                      camera. When finished, click Next.
                    </div>
                  </div>
                  <div style={{ marginLeft: 50 }}>
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={() => saveData(selectedRows)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )
            }
            return (
              <div
                style={{
                  minHeight: 64,
                  paddingRight: 8,
                  paddingLeft: 24,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <h6>
                  <div>Streams</div>
                </h6>
              </div>
            )
          },
        }}
        options={{
          paging: false,
          search: false,
          selection: true,
          selectionProps: () => ({
            color: 'primary',
          }),
        }}
      />
    </>
  )
}

CameraDiscoveryActivate.propTypes = {
  accountSlug: '',
  history: {
    push: () => {},
  },
  match: {
    params: {
      site: '',
      nodeId: '',
      requestId: '',
    },
  },
}

CameraDiscoveryActivate.defaultTypes = {
  accountSlug: PropTypes.string,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  match: PropTypes.shape({
    params: PropTypes.shape({
      site: PropTypes.string,
      nodeId: PropTypes.string,
      requestId: PropTypes.string,
    }),
  }),
}

const mapStateToProps = state => ({
  accountSlug: getAccountSlug(state),
})

export default connect(
  mapStateToProps,
  null,
)(withRouter(CameraDiscoveryActivate))
