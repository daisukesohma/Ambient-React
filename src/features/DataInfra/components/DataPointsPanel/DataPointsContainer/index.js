import React from 'react'
import Grid from '@material-ui/core/Grid'
import { useSelector } from 'react-redux'

import DataPointContainer from './DataPointContainer'

const DataPointsContainer = () => {
  const dataPoints = useSelector(state => state.dataInfra.dataPoints)

  return (
    <div id='alertFeedContainer' style={{ width: '100%' }}>
      <Grid container spacing={3}>
        {dataPoints.map((dataPoint, i) => (
          <Grid item xs={3} key={dataPoint.id}>
            <DataPointContainer
              dataPoint={dataPoint}
              idx={i}
              key={dataPoint.react_key}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  )
}

export default DataPointsContainer
