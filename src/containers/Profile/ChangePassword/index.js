import React from 'react'
import Grid from '@material-ui/core/Grid'

import PageTitle from '../../../components/Page/Title'

import ChangePasswordContainer from './ChangePasswordContainer'

export default function ChangePassword() {
  return (
    <>
      <div style={{ marginTop: 24, marginBottom: 24 }}>
        <PageTitle title='Change Password' />
      </div>
      <Grid container spacing={2}>
        <Grid item lg={4} md={6} sm={12} xs={12}>
          <ChangePasswordContainer />
        </Grid>
      </Grid>
    </>
  )
}
