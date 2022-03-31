import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { CircularProgress, ErrorPanel } from 'ambient_ui'
import { makeStyles } from '@material-ui/core/styles'
import get from 'lodash/get'
import map from 'lodash/map'

import {
  GET_ACTIVITY_DIGESTS,
  GET_PROFILE_ACTIVITY_DIGESTS,
  UPDATE_ACTIVITY_DIGESTS,
} from './gql'
import MuiMultiSelect from '../../../../components/molecules/MuiMultiSelect'

const useStyles = makeStyles(theme => ({
  subscriptionFilter: {
    '& > div': {
      border: 'none',
      '& > div': {
        padding: 0,
      },
    },
  },
}))

function SubscriptionSelection({ profileId }) {
  const classes = useStyles()

  const [options, setOptions] = useState([])
  const [selectedOptions, setSelectedOptions] = useState([])
  const { loading, error, data } = useQuery(GET_ACTIVITY_DIGESTS)
  const {
    loading: profileLoading,
    error: profileError,
    data: profileData,
  } = useQuery(GET_PROFILE_ACTIVITY_DIGESTS, {
    variables: {
      profileId,
    },
  })
  const [
    updateActivityDigests,
    {
      loading: updateActivityDigestsLoading,
      error: updateActivityDigestsError,
    },
  ] = useMutation(UPDATE_ACTIVITY_DIGESTS)

  useEffect(() => {
    const newData = map(get(data, 'allActivityDigests', []), digest => ({
      label: `${digest.type.substring(0, 1)}${digest.type
        .substring(1)
        .toLowerCase()}`,
      value: digest.id,
    }))
    setOptions(newData)
  }, [data])

  useEffect(() => {
    const newProfileData = map(
      get(profileData, 'profile.activityDigests', []),
      digest => ({
        label: `${digest.type.substring(0, 1)}${digest.type
          .substring(1)
          .toLowerCase()}`,
        value: digest.id,
      }),
    )
    setSelectedOptions(newProfileData)
  }, [profileData])

  function handleSiteFilter(selection) {
    const activityDigests = map(selection, 'value')

    updateActivityDigests({
      variables: {
        activityDigests,
        profileId,
      },
    })
  }

  if (loading && profileLoading && updateActivityDigestsLoading) {
    return <CircularProgress />
  }

  if (error && profileError && updateActivityDigestsError) {
    return <ErrorPanel />
  }

  return (
    <div className={classes.subscriptionFilter}>
      <MuiMultiSelect
        options={options}
        initialValue={selectedOptions}
        label='Subscriptions'
        onClose={handleSiteFilter}
        onClear={handleSiteFilter}
        hasSelectAll
      />
    </div>
  )
}

SubscriptionSelection.defaultProps = {
  profileId: null,
}

SubscriptionSelection.propTypes = {
  profileId: PropTypes.number,
}

export default SubscriptionSelection
