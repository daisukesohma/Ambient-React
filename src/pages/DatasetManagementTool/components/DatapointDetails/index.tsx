import React from 'react'
import { get, isEmpty, map } from 'lodash'
import { Button, Grid } from '@material-ui/core'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
// src
import { DatapointType } from 'pages/DatasetManagementTool/redux/dmsSlice'

import Detail from '../Detail'

import useStyles from './styles'

export default function DatapointDetails({
  datapoint,
  index,
  count,
  back,
  forward,
}: {
  datapoint: DatapointType | null
  index: number | null
  count: number
  back: () => void
  forward: () => void
}): JSX.Element {
  const classes = useStyles()
  const displayIndex = index !== null ? index + 1 : index
  return (
    <Grid container item className={classes.root} justify='space-between'>
      <Grid item>
        <table>
          {datapoint &&
            map(Object.entries(datapoint), (d: string[]) => {
              if (
                d[0] === '__typename' ||
                d[0] === 'datasplits' ||
                isEmpty(d[1]) ||
                (d[0] === 'timezone' &&
                  isEmpty(get(datapoint, 'timestampCreated', null)))
              ) {
                return null
              }
              return (
                <Detail
                  key={`${get(datapoint, 'id', '')}${get(
                    datapoint,
                    'dataFile',
                    '',
                  )}${d[0]}`}
                  header={d[0]}
                  data={d[1]}
                />
              )
            })}
        </table>
      </Grid>
      <Grid
        container
        alignItems='flex-end'
        justify='center'
        item
        className={classes.buttonContainer}
      >
        <div className={classes.buttons}>
          <Button onClick={back}>
            <ChevronLeftIcon />
          </Button>
          <div>{`${displayIndex} / ${count}`}</div>
          <Button onClick={forward}>
            <ChevronRightIcon />
          </Button>
        </div>
      </Grid>
    </Grid>
  )
}
