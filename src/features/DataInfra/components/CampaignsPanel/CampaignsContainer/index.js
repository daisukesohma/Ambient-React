import React from 'react'

import CampaignsTableContainer from '../CampaignsTableContainer'

import useStyles from './styles'

function CampaignsContainer() {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <CampaignsTableContainer />
    </div>
  )
}

export default CampaignsContainer
