import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useQuery, useMutation } from '@apollo/react-hooks'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import { Button } from 'ambient_ui'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import AddIcon from '@material-ui/icons/Add'
import PropTypes from 'prop-types'
// src
import { createNotification } from 'redux/slices/notifications'

import {
  GET_ACCESS_NODES_FOR_ACCOUNT,
  GET_ACCESS_READERS_FOR_ACCOUNT,
  CREATE_ACCESS_NODE,
  DELETE_ACCESS_NODE,
  DELETE_ACCESS_READER,
} from '../../data/gql'

import AccessNodeTable from './AccessNodeTable'
import AccessReaderTable from './AccessReaderTable'
import BulkCreateAccessReadersForm from './BulkCreateAccessReadersForm'

const AccessEditorDetails = ({ accountSlug }) => {
  const dispatch = useDispatch()
  const [accessNodes, setAccessNodes] = useState([])
  const [accessReaders, setAccessReaders] = useState([])
  const [isBulkUploadFormOpen, setIsBulkUploadFormOpen] = useState(false)

  const { loading: accessNodesLoading, data: accessNodesRequest } = useQuery(
    GET_ACCESS_NODES_FOR_ACCOUNT,
    {
      variables: {
        accountSlug,
      },
    },
  )

  const {
    loading: accessReadersLoading,
    data: accessReadersRequest,
    refetch: accessReadersRefetch,
  } = useQuery(GET_ACCESS_READERS_FOR_ACCOUNT, {
    variables: {
      accountSlug,
    },
  })

  // Create an AccessNode
  const [
    createAccessNode,
    { loading: createAccessNodeLoading, data: createAccessNodeData },
  ] = useMutation(CREATE_ACCESS_NODE)

  // Delete an AccessNode
  const [
    deleteAccessNode,
    { loading: deleteAccessNodeLoading, data: deleteAccessNodeData },
  ] = useMutation(DELETE_ACCESS_NODE)

  // Delete an AccessReader
  const [
    deleteAccessReader,
    { loading: deleteAccessReaderLoading, data: deleteAccessReaderData },
  ] = useMutation(DELETE_ACCESS_READER)

  useEffect(() => {
    if (accessNodesRequest) {
      setAccessNodes(accessNodesRequest.accessNodesForAccount)
    }
  }, [accessNodesRequest])

  useEffect(() => {
    if (accessReadersRequest) {
      setAccessReaders(accessReadersRequest.accessReadersForAccount)
    }
  }, [accessReadersRequest])

  useEffect(() => {
    if (createAccessNodeData) {
      dispatch(
        createNotification({
          message: createAccessNodeData.createAccessNode.message,
        }),
      )
    }
  }, [createAccessNodeData, dispatch])

  useEffect(() => {
    if (deleteAccessNodeData) {
      dispatch(
        createNotification({
          message: deleteAccessNodeData.deleteAccessNode.message,
        }),
      )
    }
  }, [deleteAccessNodeData, dispatch])

  useEffect(() => {
    if (deleteAccessReaderData) {
      dispatch(
        createNotification({
          message: deleteAccessReaderData.deleteAccessReader.message,
        }),
      )
    }
  }, [deleteAccessReaderData, dispatch])

  return (
    <Box p={1}>
      <Grid container>
        <Grid item lg={12} xs={12} md={12} sm={12}>
          <Box mt={1} mb={2}>
            <AccessNodeTable
              isLoading={
                createAccessNodeLoading ||
                deleteAccessNodeLoading ||
                accessNodesLoading
              }
              accessNodes={accessNodes}
              onCreateAccessNode={data => {
                createAccessNode({
                  variables: {
                    ...data,
                    accountSlug,
                  },
                  refetchQueries: [
                    {
                      query: GET_ACCESS_NODES_FOR_ACCOUNT,
                      variables: { accountSlug },
                    },
                  ],
                  awaitRefetchQueries: true,
                })
              }}
              onDeleteAccessNode={id => {
                deleteAccessNode({
                  variables: { id },
                  refetchQueries: [
                    {
                      query: GET_ACCESS_NODES_FOR_ACCOUNT,
                      variables: { accountSlug },
                    },
                  ],
                  awaitRefetchQueries: true,
                })
              }}
            />
          </Box>
        </Grid>
        <Grid item lg={12} md={12} xs={12} sm={12}>
          <Box mt={5}>
            <AccessReaderTable
              isLoading={accessReadersLoading || deleteAccessReaderLoading}
              accessReaders={accessReaders.map(reader => {
                return {
                  id: reader.id,
                  deviceId: reader.deviceId,
                  site: reader.site && reader.site.name,
                  stream: reader.stream && reader.stream.name,
                  door: reader.entityConfig && reader.entityConfig.bbox,
                }
              })}
              onDeleteAccessReader={id => {
                deleteAccessReader({
                  variables: { id },
                  refetchQueries: [
                    {
                      query: GET_ACCESS_READERS_FOR_ACCOUNT,
                      variables: { accountSlug },
                    },
                  ],
                  awaitRefetchQueries: true,
                })
              }}
            />
          </Box>
          <Box mt={1} display='flex' flexDirection='row' alignItems='center'>
            <Box>
              <Button
                variant='contained'
                color='primary'
                startIcon={<CloudUploadIcon />}
                onClick={() => setIsBulkUploadFormOpen(true)}
              >
                Bulk Upload w/ CSV
              </Button>
              <BulkCreateAccessReadersForm
                open={isBulkUploadFormOpen}
                accountSlug={accountSlug}
                onCancel={refetch => {
                  setIsBulkUploadFormOpen(false)
                  // Refetch
                  accessReadersRefetch()
                }}
              />
            </Box>
            <Box ml={1}>
              <Button
                variant='contained'
                color='secondary'
                startIcon={<AddIcon />}
              >
                Add Reader
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

AccessEditorDetails.propTypes = {
  accountSlug: PropTypes.string,
}

export default AccessEditorDetails
