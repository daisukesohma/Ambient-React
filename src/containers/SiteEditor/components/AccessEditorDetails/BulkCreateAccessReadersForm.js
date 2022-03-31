import React, { useState, useEffect } from 'react'
import { useMutation } from '@apollo/react-hooks'
import Paper from '@material-ui/core/Paper'
import { Button, DataTable } from 'ambient_ui'
import Box from '@material-ui/core/Box'
import Modal from '@material-ui/core/Modal'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Papa from 'papaparse'
import get from 'lodash/get'
import PropTypes from 'prop-types'

import useStyles from '../../styles'
import { BULK_CREATE_ACCESS_READERS } from '../../data/gql'

const BulkCreateAccessReadersForm = ({ accountSlug, open, onCancel }) => {
  const [
    bulkCreateAccessReadersResponse,
    setBulkCreateAccessReadersResponse,
  ] = useState(null)
  const [uploaded, setUploaded] = useState(false)
  const classes = useStyles()

  const [
    bulkCreateAccessReaders,
    {
      loading: bulkCreateAccessReadersLoading,
      data: bulkCreateAccessReadersData,
    },
  ] = useMutation(BULK_CREATE_ACCESS_READERS)

  useEffect(() => {
    if (bulkCreateAccessReadersData) {
      setBulkCreateAccessReadersResponse(
        bulkCreateAccessReadersData.bulkCreateAccessReaders,
      )
    }
  }, [bulkCreateAccessReadersData])

  const tableColumns = [
    { title: 'Device ID', field: 'deviceId' },
    { title: 'Site', field: 'site' },
    { title: 'Stream', field: 'stream' },
    { title: 'Door', field: 'door' },
    {
      title: 'Message',
      field: 'message',
      render: row => {
        const className = row.ok ? classes.success : classes.error
        return (
          <Typography variant='body2' className={className}>
            {row.message}
          </Typography>
        )
      },
    },
  ]

  const tableOptions = {
    search: true,
    paging: true,
    sorting: true,
    actionsColumnIndex: -1,
    padding: 'dense',
  }

  const handleFile = file => {
    setUploaded(true)
    Papa.parse(
      file,
      {
        complete(results) {
          // Array
          const data = results.data
            .map(item => {
              return {
                deviceId: item[0],
                siteSlug: item[1],
                streamName: item[2],
              }
            })
            .filter(item => item.deviceId)

          // Call mutation
          bulkCreateAccessReaders({
            variables: {
              accountSlug,
              data,
            },
          })
        },
      },
      {
        skipEmptyLines: true,
      },
    )
  }

  const PreUpload = () => {
    return (
      <Grid container>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <Typography>
            Upload a CSV where every line is the following format:{' '}
            <span className={classes.highlight}>deviceId</span>,{' '}
            <span className={classes.highlight}>site identifier</span>,{' '}
            <span className={classes.highlight}>stream name</span>
          </Typography>
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <Box display='flex' flexDirection='row' alignItems='row' mt={1}>
            <Box>
              <input
                type='file'
                accept='.csv'
                id='file'
                style={{ display: 'none' }}
                onChange={e => handleFile(e.target.files[0])}
              />
              <label htmlFor='file'>
                <Button color='primary' component='span'>
                  Upload
                </Button>
              </label>
            </Box>
            <Box ml={1}>
              <Button color='secondary' onClick={() => onCancel()}>
                Cancel
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    )
  }

  const PostUpload = () => {
    return (
      <Grid container>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <DataTable
            isLoading={bulkCreateAccessReadersLoading}
            title='Bulk Create Access Readers'
            editable={{
              isEditable: false,
            }}
            data={
              bulkCreateAccessReadersResponse
                ? bulkCreateAccessReadersResponse.readers.map(item => {
                    return {
                      ok: item.reader !== null,
                      deviceId: item.deviceId,
                      site: get(item, 'reader.site.name'),
                      stream: get(item, 'reader.stream.name'),
                      door: get(item, 'reader.entityConfig.bbox'),
                      message: item.message,
                    }
                  })
                : []
            }
            columns={tableColumns}
            options={{
              ...tableOptions,
            }}
          />
        </Grid>
      </Grid>
    )
  }

  return (
    <Modal
      style={{ maxWidth: '60%', left: '20%', top: '10%' }}
      open={open}
      onClose={() => {
        onCancel(!uploaded)
        setUploaded(false)
      }}
    >
      <Paper elevation={1}>
        <Box p={2}>
          {!uploaded && <PreUpload />}
          {uploaded && <PostUpload />}
        </Box>
      </Paper>
    </Modal>
  )
}

BulkCreateAccessReadersForm.propTypes = {
  accountSlug: PropTypes.string,
  open: PropTypes.bool,
  onCancel: PropTypes.func,
}

export default BulkCreateAccessReadersForm
