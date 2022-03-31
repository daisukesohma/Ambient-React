import React from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { Grid, Box, Typography, Card, CardContent, CardActionArea, Tooltip, Grow } from '@material-ui/core'
// src
import useStyles from './styles'

const propTypes = {
  account: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
}

export default function AccountCard({ account, index }) {
  const classes = useStyles()
  const history = useHistory()

  const onClick = () => history.push(`/accounts/${account.slug}/live`)

  return (
    <Grid item xl={3} lg={3} md={4} sm={6} xs={12} key={account.slug}>
      <Grow in timeout={(index + 1) * 1000}>
        <Tooltip title={`Switch to: ${account.name}`} placement='top'>
          <Card
            onClick={() => onClick()}
            className={classes.accountCard}
          >
            <CardActionArea>
              <CardContent>
                <Box display="flex" justifyContent="center">
                  <Typography gutterBottom variant='h4' component='h2'>
                    {account.name}
                  </Typography>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        </Tooltip>
      </Grow>
    </Grid>
  )
}

AccountCard.propTypes = propTypes
