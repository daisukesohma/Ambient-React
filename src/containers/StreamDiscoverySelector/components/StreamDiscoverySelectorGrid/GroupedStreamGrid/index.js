import React from 'react'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import { useSelector } from 'react-redux'
import map from 'lodash/map'

import IpInformationCard from '../../IpInformationCard'
import ipGroupedStreamRequests from '../../../../../selectors/streamDiscovery/ipGroupedStreamRequests'
import constants from '../../../constants'

import mockData from './mockData'

function GroupedStreamGrid({ isMockData }) {
  // eslint-disable-line react/prop-types
  const groupedStreams = useSelector(ipGroupedStreamRequests)

  const data = isMockData ? mockData : groupedStreams

  return (
    <Grid
      alignItems='flex-start'
      justify='flex-start'
      container
      direction='row'
      spacing={2}
    >
      {map(data, groupedIp => {
        const { ip } = groupedIp
        return (
          <Grid
            item
            key={`groupedIp-${ip}`}
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={3}
            style={{
              minWidth: constants.minWidth,
              maxWidth: constants.maxWidth,
            }}
          >
            <IpInformationCard
              data={groupedIp}
              streams={groupedIp.streamRequests}
            />
          </Grid>
        )
      })}
    </Grid>
  )
}

GroupedStreamGrid.propTypes = {
  isMockData: PropTypes.bool,
}

GroupedStreamGrid.defaultProps = {
  isMockData: false,
}

export default GroupedStreamGrid
