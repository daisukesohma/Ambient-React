import React from 'react'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import { DataTable } from 'ambient_ui'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'

import useStyles from '../../styles'

const AccessNodeTable = ({
  accessNodes,
  isLoading,
  onCreateAccessNode,
  onDeleteAccessNode,
}) => {
  const classes = useStyles()
  const tableColumns = [
    { title: 'Identifier', field: 'identifier' },
    { title: 'Name', field: 'name' },
    {
      title: 'Token',
      field: 'token',
      render: row => {
        return '******'
      },
    },
  ]

  const tableOptions = {
    search: false,
    paging: false,
    sorting: true,
    actionsColumnIndex: -1,
    padding: 'dense',
    addRowPosition: 'first',
  }

  const Title = () => {
    return (
      <Box>
        <Typography variant='h5'>Nodes</Typography>
        <Typography variant='caption' className={classes.subtext}>
          All Ambient edge readers
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
        onRowAdd: data =>
          new Promise((resolve, reject) => {
            onCreateAccessNode(data)
            resolve()
          }),
        onRowDelete: data =>
          new Promise((resolve, reject) => {
            onDeleteAccessNode(data.id)
            resolve()
          }),
      }}
      data={accessNodes}
      columns={tableColumns}
      options={{
        ...tableOptions,
      }}
      actions={[
        {
          icon: FileCopyIcon,
          tooltip: 'Copy Token',
          onClick: (event, row) => {
            navigator.clipboard.writeText(row.token)
          },
        },
      ]}
    />
  )
}

export default AccessNodeTable
