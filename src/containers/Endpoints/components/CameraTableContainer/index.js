import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import clsx from 'clsx'
// src
import DataTable from 'components/organisms/DataTable'
import { useFlexStyles } from 'common/styles/commonStyles'
import { setStreamSearchTerm } from 'redux/cameras/actions'

import EditStreamSiteTopHeader from './components/EditStreamSiteTopHeader'
import RefreshTableData from './components/RefreshTableData'
import useTableData from './hooks/useTableData'
import useStreamHealthHeartbeat from './hooks/useStreamHealthHeartbeat'
import useStyles from './styles'

export default function CameraTableContainer() {
  const darkMode = useSelector(state => state.settings.darkMode)
  const editable = useSelector(state => state.cameras.editable)
  const classes = useStyles({ darkMode })
  const flexClasses = useFlexStyles()
  const dispatch = useDispatch()
  const selectedSite = useSelector(state => state.cameras.selectedSite)
  const [selected, setSelected] = useState([])

  // reset selected on changing site
  useEffect(() => {
    setSelected([])
  }, [selectedSite, editable])

  const initLimit = 100

  const {
    columns,
    data,
    emptyComment,
    isLoading,
    limit,
    page,
    pages,
    setLimit,
    setPage,
    totalCountOverride,
  } = useTableData({ initLimit })

  const {
    refetchData,
    // status: heartbeatStatus,
    isLoading: heartbeatIsLoading,
  } = useStreamHealthHeartbeat() // eslint-disable-line

  // actions
  //
  const additionalTools = (
    <div className={clsx(flexClasses.row, flexClasses.centerStart)}>
      <span className={classes.additionalToolsContainer}>
        <RefreshTableData handleFetch={refetchData} />
      </span>
    </div>
  )

  // from https://material-ui.com/components/tables/#sorting-amp-selecting
  //
  const onSelectRow = id => {
    const selectedIndex = selected.indexOf(id)
    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      )
    }

    setSelected(newSelected)
  }

  return (
    <DataTable
      additionalTools={additionalTools}
      columns={columns}
      caption={
        editable ? <EditStreamSiteTopHeader selected={selected} /> : null
      }
      darkMode={darkMode}
      data={data}
      defaultRowsPerPage={limit}
      emptyComment={emptyComment}
      isLoading={isLoading || heartbeatIsLoading}
      isPaginated
      onSearch={value => dispatch(setStreamSearchTerm(value))}
      page={page}
      pages={pages}
      rowsPerPage={limit}
      selectable={editable}
      onSelectRow={row => onSelectRow(row.streamId)}
      validateSelectedRow={row => selected.indexOf(row.streamId) !== -1}
      serverSideProcessing
      setPage={setPage}
      setRowsPerPage={setLimit}
      showAddNowButton={false}
      totalCountOverride={totalCountOverride}
    />
  )
}
