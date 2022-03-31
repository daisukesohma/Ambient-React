import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Grid, Typography, CircularProgress } from '@material-ui/core'
import Apollo from 'providers/apollo'
import getResponders from '../../../selectors/alertModal/getResponders'
import { GET_DISPATCH_STATUS } from '../../../sagas/alertModal/gql'
import ResponderList from '../../AlertCommon/ResponderList'
import { resetState, fetchDispatchStatusSucceeded } from 'redux/slices/alertModal'

export default function RespondersModal({ alertEventId, alertEventHash }) {
  const dispatch = useDispatch()
  const responders = useSelector(getResponders)
  const [loading, setLoading] = useState(true)

  const fetchDispatchStatus = useCallback(() => {
    Apollo.client
      .query({
        query: GET_DISPATCH_STATUS,
        variables: {
          alertEventId,
          alertEventHash,
        },
      })
      .then(response => {
        dispatch(fetchDispatchStatusSucceeded(response.data))
        setLoading(false)
      })
      .catch(error => {
        throw error
      })
  }, [alertEventId, alertEventHash, dispatch])

  useEffect(() => {
    fetchDispatchStatus()
    const intervalId = setInterval(fetchDispatchStatus, 5000)
    return () => {
      dispatch(resetState())
      clearInterval(intervalId)
    }
  }, [fetchDispatchStatus, dispatch])

  return (
    <Grid container direction='column' spacing={2} alignItems='center'>
      <Box mt={3} mr={6} mb={6} ml={6}>
        <Box display="flex" justifyContent='center' mb={3}>
          <Typography variant='h4'>Select Responder to dispatch</Typography>
        </Box>
        {!loading && (
          <ResponderList
            responders={responders}
            alertEventId={alertEventId}
            alertEventHash={alertEventHash}
          />
        )}
        {loading && <Box display="flex" justifyContent='center'><CircularProgress /></Box>}
      </Box>
    </Grid>
  )
}
