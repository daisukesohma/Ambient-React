import React from 'react'
import { get } from 'lodash'
import { Grid, Modal } from '@material-ui/core'
// src
import { DatapointType } from 'pages/DatasetManagementTool/redux/dmsSlice'

import DatapointDetails from '../DatapointDetails'
import ImageScroll from '../ImageScroll'

import useStyles from './styles'

export default function DatapointModal({
  datapoint,
  modalOpen,
  onClose,
  index,
  count,
  back,
  forward,
}: {
  datapoint: DatapointType | null
  modalOpen: boolean
  onClose: () => void
  index: number | null
  count: number
  back: () => void
  forward: () => void
}): JSX.Element {
  const classes = useStyles()

  return (
    <Modal open={modalOpen} onClose={onClose}>
      <div className={classes.modal}>
        <Grid
          container
          justify='space-between'
          alignItems='center'
          direction='row'
          className={classes.container}
        >
          <ImageScroll source={get(datapoint, 'presignedDataUrl', '')} />
          <DatapointDetails
            datapoint={datapoint}
            index={index}
            count={count}
            forward={forward}
            back={back}
          />
        </Grid>
      </div>
    </Modal>
  )
}
