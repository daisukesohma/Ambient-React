import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { isMobile } from 'react-device-detect'
import { useDispatch, useSelector } from 'react-redux'
import clsx from 'clsx'
import Box from '@material-ui/core/Box'
// src
import { Button } from 'ambient_ui'
import DataTable from 'components/organisms/DataTable'
import PageTitle from 'components/Page/Title'

import allSkus from './selectors/allSkus'
import {
  fetchSkusRequested,
  resetNodeProvisionData,
  SkuReducerProps,
} from './redux'
import AddModal from './components/AddModal'
import useTableData from './hooks/useTableData'
import useStyles from './styles'

function SkuManagement(): JSX.Element {
  const classes = useStyles()
  const dispatch = useDispatch()
  const history = useHistory()
  const darkMode = useSelector(state => state.settings.darkMode)
  const isProvisionNewModalOpen = useSelector(
    (state: SkuReducerProps) => state.skuManagement.provisionNewModal.isOpen,
  )
  const nodes = useSelector(allSkus)
  const createNodeProvisionSucceeded = useSelector(
    (state: SkuReducerProps) =>
      state.skuManagement.createNodeProvisionSucceeded,
  )

  useEffect(() => {
    dispatch(resetNodeProvisionData())
    dispatch(fetchSkusRequested())
  }, []) // eslint-disable-line

  const { columns, limit, setLimit } = useTableData()

  function createData(node) {
    return { node }
  }

  const rows = nodes ? nodes.map(node => createData(node)) : []

  // const additionalTools = <span style={{ marginRight: 16 }} />

  return (
    <div style={{ marginTop: 8 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: isMobile ? 'column' : 'row',
          marginBottom: 16,
        }}
      >
        <PageTitle title='Sku Management' darkMode={darkMode} />
      </div>
      <div>
        {rows && (
          <DataTable
            columns={columns}
            darkMode={darkMode}
            data={rows}
            defaultRowsPerPage={limit}
            rowsPerPage={limit}
            setRowsPerPage={setLimit}
            showAddNowButton={false}
          />
        )}
      </div>
      {createNodeProvisionSucceeded && (
        <Box
          className={clsx('am-caption', classes.toast)}
          display='flex'
          alignItems='center'
        >
          <span style={{ marginRight: 16 }}>
            <span role='img' aria-label='party'>
              🎉
            </span>
            New node provisioned!
          </span>
          <Button
            variant='text'
            onClick={() => {
              dispatch(resetNodeProvisionData())
              history.push('/internal/nodes/inventory')
            }}
          >
            View
          </Button>
        </Box>
      )}
      <AddModal open={isProvisionNewModalOpen} />
    </div>
  )
}

export default SkuManagement
