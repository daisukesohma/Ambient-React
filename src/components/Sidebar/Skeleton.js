import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'
import Skeleton from '@material-ui/lab/Skeleton'

import WebLogo from 'assets/web_logo.png'

import { primaryMenus, otherMenus } from './data'

const drawerWidth = 240

const useStyles = makeStyles(({ spacing, palette, transitions }) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    backgroundColor: 'transparent !important',
  },
  drawerOpen: {
    '&&': {
      width: drawerWidth,
      transition: transitions.create('width', {
        easing: transitions.easing.sharp,
        duration: transitions.duration.enteringScreen,
      }),
      backgroundColor: palette.common.black,
    },
  },
  menuContainer: {
    display: 'flex',
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  logo: {
    width: 240,
    marginTop: 10,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    backgroundColor: palette.grey[400],
    borderRadius: '50% !important',
    marginRight: spacing(2),
  },
  avatarContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    padding: spacing(1),
    marginLeft: spacing(2),
    alignItems: 'center',
  },
  drawerItem: {
    marginLeft: spacing(3),
    width: spacing(24),
    height: spacing(5),
    backgroundColor: palette.grey[400],
    margin: spacing(1, 0),
  },
  drawerSubItem: {
    marginLeft: spacing(6),
    width: spacing(21),
    height: spacing(3),
    backgroundColor: palette.grey[400],
    margin: spacing(1, 0),
  },
  bottom: {
    marginBottom: 50,
  },
  userName: {
    width: spacing(17),
    height: spacing(4),
    backgroundColor: palette.grey[400],
  },
}))

export default function SidebarSkeleton() {
  const classes = useStyles()

  return (
    <Drawer
      variant='permanent'
      className={classes.drawerOpen}
      classes={{
        paper: classes.drawerOpen,
      }}
      open
    >
      <img src={WebLogo} alt='Ambient' className={classes.logo} />

      <Grid className={classes.avatarContainer}>
        <Skeleton variant='circle' className={classes.avatar} />
        <Skeleton className={classes.userName} />
      </Grid>
      <Divider fullWidth />
      <Grid className={classes.menuContainer}>
        <Grid>
          {primaryMenus.map(({ title }) => (
            <>
              <Skeleton key={title} className={classes.drawerItem} />
              <div>
                {[1, 2].map(idx => {
                  return (
                    <Skeleton
                      key={`sub-${idx}-${title}`}
                      className={classes.drawerSubItem}
                    />
                  )
                })}
              </div>
            </>
          ))}
        </Grid>
        <Grid className={classes.bottom}>
          {otherMenus.map(({ title, icon, subItems, reverse, path }) => (
            <Skeleton key={title} className={classes.drawerItem} />
          ))}
        </Grid>
      </Grid>
    </Drawer>
  )
}
