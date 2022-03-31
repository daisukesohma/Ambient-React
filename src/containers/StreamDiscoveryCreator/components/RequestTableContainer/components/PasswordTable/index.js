import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'ambient_ui'
import clsx from 'clsx'

import DataTable from 'components/organisms/DataTable'
import useStyles from './styles'

// Most code from docs
// https://react-table.js.org/examples/complex

function PasswordTable({ setCredentialData, setSelectedCredentialRowIds }) {
  const classes = useStyles()
  const columns = React.useMemo(
    () => [
      {
        Header: 'Username',
        accessor: 'username',
      },
      {
        Header: 'Password',
        accessor: 'password',
      },
    ],
    [],
  )

  const emptyRow = [
    {
      username: '',
      password: '',
    },
  ]

  const [data, setData] = useState([])

  // We need to keep the table from resetting the pageIndex when we
  // Update data. So we can keep track of that flag with a ref.

  const [originalData] = useState(data)
  const [skipPageReset, setSkipPageReset] = useState(false)

  // We need to keep the table from resetting the pageIndex when we
  // Update data. So we can keep track of that flag with a ref.

  // When our cell renderer calls updateMyData, we'll use
  // the rowIndex, columnId and new value to update the
  // original data
  const updateMyData = (rowIndex, columnId, value) => {
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

  // After data chagnes, we turn the flag back off
  // so that if data actually changes when we're not
  // editing it, the page is reset
  React.useEffect(() => {
    setSkipPageReset(false)
    setCredentialData(data)
  }, [data, setCredentialData])

  // Let's add a data resetter/randomizer to help
  // illustrate that flow...
  const resetData = () => {
    // Don't reset the page when we do this
    setData(originalData)
  }

  const handleAddRow = () => {
    setData([...emptyRow, ...data])
  }

  const setSelected = dataInput => {
    setSelectedCredentialRowIds(dataInput)
  }

  return (
    <div>
      <div className={classes.statusContainer}>
        <div className={clsx('am-overline', classes.statusText)} />
        <div className={classes.row}>
          <Button variant='text' color='primary' onClick={resetData}>
            Clear All
          </Button>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={data}
        handleAddRow={handleAddRow}
        setSelectedRowIds={setSelected}
        updateMyData={updateMyData}
        skipPageReset={skipPageReset}
      />
    </div>
  )
}

PasswordTable.propTypes = {
  setCredentialData: PropTypes.func,
  setSelectedCredentialRowIds: PropTypes.func,
}

PasswordTable.defaultProps = {
  setCredentialData: () => {},
  setSelectedCredentialRowIds: () => {},
}

export default PasswordTable
