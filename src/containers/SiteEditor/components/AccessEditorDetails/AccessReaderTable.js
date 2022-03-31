import React from 'react'
import { DataTable } from 'ambient_ui'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'

import useStyles from '../../styles'

const AccessReaderTable = ({
  isLoading,
  accessReaders,
  onDeleteAccessReader,
}) => {
  const classes = useStyles()

  const tableColumns = [
    { title: 'Device ID', field: 'deviceId' },
    { title: 'Site', field: 'site' },
    { title: 'Stream', field: 'stream' },
    { title: 'Door', field: 'door' },
  ]

  const tableOptions = {
    search: true,
    paging: true,
    sorting: true,
    filtering: true,
    actionsColumnIndex: -1,
    padding: 'dense',
    addRowPosition: 'first',
  }

  const Title = () => {
    return (
      <Box>
        <Typography variant='h5'>Endpoints</Typography>
        <Typography variant='caption' className={classes.subtext}>
          Lenel / CCure Readers
        </Typography>
      </Box>
    )
  }

  return (
    <DataTable
      isLoading={isLoading}
      title={<Title />}
      editable={{
        isEditable: false,
        onRowDelete: data =>
          new Promise((resolve, reject) => {
            onDeleteAccessReader(data.id)
            resolve()
          }),
      }}
      data={accessReaders}
      columns={tableColumns}
      options={{
        ...tableOptions,
      }}
    />
  )
}

export default AccessReaderTable
