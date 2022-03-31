import React from 'react'
import Grid from '@material-ui/core/Grid'

import { useStyles } from './styles'

function TitleRow({ title }) {
  const classes = useStyles()
  return (
    <Grid
      item
      sm={12}
      xs={12}
      md={12}
      lg={12}
      xl={12}
      className={classes.titleContainer}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <div className='am-h4' style={{ textAlign: 'left' }}>
          {title}
        </div>
        <div>
          {/* <Button
            disabled={isDownloading}
            className={`btn btn-primary ${classes.downloadBtn}`}
            onClick={handleGenerateReport}
          >
            {buttonText}
          </Button> */}
        </div>
      </div>
    </Grid>
  )
}

export default TitleRow
