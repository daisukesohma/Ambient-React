import React, { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { Button, MoreOptionMenu } from 'ambient_ui'
import clsx from 'clsx'
import get from 'lodash/get'

import {
  setIsCreatorDirty,
  saveCreatorData,
} from '../../../../../../redux/streamDiscovery/actions'
import AnimatedValue from '../../../../../../components/Animated/Value'

import useStyles from './styles'
import CsvUploadParseButtons from './components/CsvUpload/CsvUploadParseButtons'
import CsvDownloadTemplate from './components/CsvDownloadTemplate'
import DataTable from 'components/organisms/DataTable'

// Most code from docs
// https://react-table.js.org/examples/complex

function DiscoveryTable({
  nodeStreamCount,
  setDiscoveryData,
  setSelectedDiscoveryRowIds,
}) {
  const dispatch = useDispatch()
  const saved = useSelector(state => state.streamDiscovery.saved.creator)
  const { data: savedData, selectedRowIds: savedSelectedRowIds } = saved

  const classes = useStyles()
  const [csvData, setCsvData] = useState()
  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'IP',
        accessor: 'ip',
      },
      {
        Header: 'Port',
        accessor: 'port',
      },
    ],
    [],
  )

  const emptyRow = [
    {
      name: '',
      ip: '',
      port: '554',
    },
  ]

  const csvToDataRow = ({ data }) => ({
    name: get(data, 'name'),
    ip: get(data, 'ip'),
    port: get(data, 'port'),
  })

  const [data, setData] = useState(() => {
    // default if csvData exists
    if (csvData) {
      return csvData.map(csvToDataRow)
    }
    return []
  })

  // add uploaded csv data to existing data
  useEffect(() => {
    if (csvData) {
      setData([...data, ...csvData.map(csvToDataRow)])
    } else {
      setData([])
    }
    // eslint-disable-next-line
  }, [csvData])

  const [shouldRestoreData, setShouldRestoreData] = useState(true)
  const [originalData] = useState(data)
  const [skipPageReset, setSkipPageReset] = useState(false)
  const [selectedRowIds, setSelectedRowIds] = useState([])
  const [hideCsvUploader, setHideCsvUploader] = useState(false)
  // FUTURE @ERIC we need to implement a custom solution for setSelectedRowids
  // 2.5 Try, I think this is the answer
  // https://react-table.js.org/faq#how-can-i-manually-control-the-table-state
  // We need to keep the table from resetting the pageIndex when we
  // Update data. So we can keep track of that flag with a ref.
  //
  // Second try - i think this will work, but need to know how to trigger it
  // row.toggleRowSelected()
  // https://github.com/tannerlinsley/react-table/blob/master/docs/api/useRowSelect.md

  // First try... I thought this would work but it doesnt
  // increment selected row ids since we are adding to beginning of data, and thus need to increment each index.
  // selectedRowIds is an object of {id: true, ... ie. 1: true, 2: true}
  // thus we need to create {2: true, 3: true}
  // const newSelectedRowIds = Object.keys(selectedRowIds).map(id => ({[Number(id) + 1]: true}))
  // console.log('handleAddRow', newSelectedRowIds)
  // setSelectedRowIds(newSelectedRowIds)

  // When our cell renderer calls updateMyData, we'll use
  // the rowIndex, columnId and new value to update the
  // original data
  const updateMyData = (rowIndex, columnId, value) => {
    // We also turn on the flag to not reset the selected row ids
    // We also turn on the flag to not reset the page
    setSkipPageReset(true)
    setData(old =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          }
        }
        return row
      }),
    )
  }

  // restore data
  useEffect(() => {
    if (shouldRestoreData) {
      setData(savedData)
      setSelectedRowIds(savedSelectedRowIds)
      dispatch(saveCreatorData([]))
      setShouldRestoreData(false)
    }
  }, [savedData, savedSelectedRowIds, shouldRestoreData, dispatch])

  // After data chagnes, we turn the flag back off
  // so that if data actually changes when we're not
  // editing it, the page is reset
  useEffect(() => {
    setSkipPageReset(false)
    setDiscoveryData(data)
  }, [data, setDiscoveryData])

  // Let's add a data resetter/randomizer to help
  // illustrate that flow...
  const resetData = () => {
    setData(originalData)
    setHideCsvUploader(true)
    dispatch(setIsCreatorDirty(false))
  }

  useEffect(() => {
    setHideCsvUploader(false)
  }, [hideCsvUploader])

  const handleAddRow = () => {
    setData([...emptyRow, ...data])
  }

  const setSelected = selectedData => {
    setSelectedDiscoveryRowIds(selectedData)
    setSelectedRowIds(selectedData)
  }

  const menuItems = [
    {
      label: <CsvDownloadTemplate />,
    },
  ]

  return (
    <div>
      <div className={classes.statusContainer}>
        <div className={clsx('am-overline', classes.statusText)}>
          <>
            <span className={classes.statusTextItem}>
              <AnimatedValue value={selectedRowIds && selectedRowIds.length} />
              <span style={{ margin: '0 8px' }}>of</span>
              <AnimatedValue value={data && data.length} />
              <span style={{ margin: '0 8px' }}>Cameras Selected</span>
            </span>
          </>
          <Button variant='text' color='primary' onClick={resetData}>
            Clear Data
          </Button>
        </div>
        <div className={classes.row}>
          {!hideCsvUploader && <CsvUploadParseButtons setData={setCsvData} />}
          <span style={{ marginLeft: 8 }}>
            <MoreOptionMenu menuItems={menuItems} noBackground />
          </span>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={data}
        handleAddRow={handleAddRow}
        setSelectedRowIds={setSelected}
        updateMyData={updateMyData}
        skipPageReset={skipPageReset}
        setDiscoveryData={setDiscoveryData}
        preSelectedRowIds={savedSelectedRowIds}
      />
    </div>
  )
}

DiscoveryTable.defaultProps = {
  nodeStreamCount: 0,
  setDiscoveryData: () => {},
  setSelectedDiscoveryRowIds: () => {},
}

DiscoveryTable.propTypes = {
  nodeStreamCount: PropTypes.number,
  setDiscoveryData: PropTypes.func,
  setSelectedDiscoveryRowIds: PropTypes.func,
}

export default DiscoveryTable
