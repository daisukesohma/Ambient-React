import React from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Grid, Container, Typography, Box, Grow, Tooltip, IconButton } from '@material-ui/core'
import { useTheme } from '@material-ui/core/styles'
import { Icon } from 'ambient_ui'
import { map, get } from 'lodash'
import clsx from 'clsx'
// src
import AccountCard from './AccountCard'
import useStyles from './styles'

export default function SwitchAccount() {
  const history = useHistory()
  const classes = useStyles()
  const { palette } = useTheme()
  const accounts = useSelector(state => state.auth.accounts)
  const firstAccountSlug = get(accounts, '[0].slug')

  const handleClose = () => {
    history.push(`/accounts/${firstAccountSlug}/live`)
  }

  return (
    <Container
      maxWidth={false}
      className={clsx(classes.container, classes.maxHeight)}
    >
      <Tooltip placement='bottom' title='Close'>
        <IconButton
          aria-label='Close'
          size='small'
          color='primary'
          onClick={handleClose}
          classes={{ root: classes.closeButton }}
        >
          <Icon icon='close' color={palette.grey[300]} size={40} />
        </IconButton>
      </Tooltip>
      <Grid
        container
        justify='center'
        alignItems='center'
        className={classes.maxHeight}
      >
        <Grid item xs={12}>
          <Grid container justify='center'>
            <Box mb={10}>
              <Grow in timeout={1000}>
                <Typography variant='h3'>Select an account:</Typography>
              </Grow>
            </Box>
            <Grid item xs={12}>
              <Grid container direaction='row' spacing={3} justify='center'>
                {accounts &&
                  map(accounts, (account, index) => (
                    <AccountCard
                      key={account.name}
                      account={account}
                      index={index}
                    />
                  ))}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  )
}
