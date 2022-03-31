import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import { Button } from 'ambient_ui'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { isMobile } from 'react-device-detect'

import { Can } from 'rbac'
import addUserImg from 'assets/members/addUser.svg'
import addIdentityImg from 'assets/members/addIdentity.svg'

const useStyles = makeStyles(({ palette }) => ({
  root: {
    padding: isMobile ? 0 : '50px 100px',
  },
  description: {
    fontSize: 16,
    color: palette.grey[700],
    marginTop: 16,
  },
  container: {
    borderRadius: 4,
    backgroundColor: palette.common.white,
    boxShadow: '0px 1px 50px rgba(98, 100, 105, 0.15)',
    padding: 24,
    marginTop: 16,
    marginBottom: 16,
    height: '90%',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  imgContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: 32,
    minHeight: 180,
  },
}))

const Start = ({ onAdd }) => {
  const classes = useStyles()

  return (
    <Grid container spacing={2} className={classes.root}>
      <Grid item lg={12} md={12} sm={12} xs={12}>
        <Typography className='am-h3'>You currently have no users.</Typography>
        <Typography className={classes.description}>
          Choose to either add users manually or import from an Identity Source.
        </Typography>
      </Grid>
      <Grid item lg={6} md={6} sm={12} xs={12}>
        <Grid className={classes.container}>
          <Grid>
            <Typography className='am-h5'>Add User Manually</Typography>
            <Typography className={classes.description}>
              Add users from your organization and input their details manually.
              Ideal for small teams.
            </Typography>
          </Grid>
          <Grid className={classes.imgContainer}>
            <img alt='Add User' src={addUserImg} />
          </Grid>
          <Grid container justify='flex-end'>
            <Can I='create_users' on='UserManagement'>
              {can => (
                <Button disabled={!can} onClick={() => onAdd(0)}>
                  Add Now
                </Button>
              )}
            </Can>
          </Grid>
        </Grid>
      </Grid>
      <Grid item lg={6} md={6} sm={12} xs={12}>
        <Grid className={classes.container}>
          <Grid>
            <Typography className='am-h5'>Add Identity Source</Typography>
            <Typography className={classes.description}>
              Import users from an identity source you currently use, such as
              Active Directory or other LDAP’s.{' '}
            </Typography>
          </Grid>
          <Grid className={classes.imgContainer}>
            <img alt='Add Identity' src={addIdentityImg} />
          </Grid>
          <Grid container justify='flex-end'>
            <Can I='create_users' on='UserManagement'>
              {can => (
                <Button disabled={!can} onClick={() => onAdd(1)}>
                  Add Now
                </Button>
              )}
            </Can>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

Start.propTypes = {
  onAdd: PropTypes.func,
}

Start.defaultProps = {
  onAdd: () => {},
}

export default Start
