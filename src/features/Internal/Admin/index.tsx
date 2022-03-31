import React from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Grid } from '@material-ui/core'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import map from 'lodash/map'
// src

import { useStyles } from './styles'
import data, { DataTypes } from './data'

export default function InternalAdmin(): JSX.Element {
  const darkMode = useSelector((state: any) => state.settings.darkMode)
  // eslint-disable-next-line
  const classes = useStyles({ darkMode })
  const history = useHistory()

  const onClick = (link: string) => () => {
    history.push(link)
  }

  return (
    <Grid
      container
      spacing={4}
      className={classes.root}
      alignItems='flex-start'
      direction='row'
      justify='space-evenly'
    >
      <Grid item lg={12} md={12} sm={12} xs={12}>
        <div className='am-h4'>Internal Admin</div>
      </Grid>
      <Grid item lg={12} md={12} sm={12} xs={12}>
        <p>
          Please choose an option from the left sidebar. Here is a reference of
          the commonly used features:
        </p>
        <List>
          {map(data, (d: DataTypes) => {
            return (
              <ListItem button onClick={onClick(d.link)}>
                <ListItemText
                  primary={d.name}
                  secondary={d.desc}
                  classes={{
                    primary: classes.root,
                    secondary: classes.secondaryText,
                  }}
                />
              </ListItem>
            )
          })}
        </List>
      </Grid>
    </Grid>
  )
}
