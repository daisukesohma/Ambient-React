import React, { useState, useEffect } from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import has from 'lodash/has'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Collapse from '@material-ui/core/Collapse'
import { Icons, Icon } from 'ambient_ui'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import DashboardIcon from '@material-ui/icons/Dashboard'

import ActivePulse from '../../ActivePulse'
import { getAccountSlug } from 'utils'
import { Can } from '../../../rbac'

import useStyles from './styles'

const DrawerItem = ({
  location: { pathname },
  open,
  title,
  icon,
  path,
  reverse,
  subItems,
  changeRoute,
  openSideBar,
  accountSlug,
}) => {
  const { palette } = useTheme()
  const classes = useStyles({ open })
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (!open) {
      setExpanded(false)
    }
  }, [open])

  useEffect(() => {
    if (open && pathname.indexOf(path) !== -1) {
      setExpanded(true)
    }
  }, [pathname, path, open])

  const onItemClick = () => {
    if (!open) {
      openSideBar()
    }
    if (subItems) {
      setExpanded(!expanded)
    } else {
      changeRoute(`/${path}`)
    }
  }

  const onSubItemClick = (slug, needsAccountSlug) => () => {
    const route = needsAccountSlug
      ? `/accounts/${accountSlug}/${path}/${slug}`
      : `/${path}/${slug}`
    changeRoute(route)
  }

  // NOTE: TODO: don't like this icon handling.
  //
  let iconDisplay = null

  if (icon === 'ActivePulse') {
    iconDisplay = <ActivePulse isActive variant='secondary' />
  } else if (icon === 'Dashboard') {
    iconDisplay = (
      <DashboardIcon
        style={{ color: palette.common.white, width: 18, height: 18 }}
      />
    )
  } else if (has(Icons, `${icon}`)) {
    const AmbientIcons = Icons[icon]
    iconDisplay = (
      <AmbientIcons stroke={palette.common.white} width={18} height={18} />
    )
  } else if (icon === 'tags') {
    iconDisplay = (
      <Icon
        icon={icon}
        fill={palette.common.white}
        size={18}
        viewBox={'0 0 1920 1792'}
      />
    )
  } else {
    iconDisplay = <Icon icon={icon} color={palette.common.white} size={18} />
  }

  const OpenIcon = reverse ? ExpandMore : ExpandLess
  const CloseIcon = reverse ? ExpandLess : ExpandMore

  return (
    <>
      <Grid
        className={classes.DrawerItem}
        onClick={onItemClick}
        style={
          !subItems && pathname.indexOf(`/${path}`) !== -1
            ? { backgroundColor: '#000' }
            : null
        }
      >
        <Grid
          container
          direction='row'
          alignItems='center'
          justify={open ? 'flex-start' : 'center'}
        >
          {iconDisplay && (
            <div
              style={{
                transform: icon === 'Gear' ? 'scale(0.8)' : 'unset',
                paddingLeft: icon === 'ActivePulse' ? '6px' : 0,
                marginRight: icon === 'ActivePulse' ? '1px' : 0,
                marginTop: 4,
              }}
            >
              {iconDisplay}
            </div>
          )}
          <Typography className={classes.DrawerItemText}>{title}</Typography>
        </Grid>
        {subItems &&
          open &&
          (expanded ? (
            <OpenIcon className={classes.DrawerIcon} />
          ) : (
            <CloseIcon className={classes.DrawerIcon} />
          ))}
      </Grid>
      {subItems && (
        <Collapse in={expanded} timeout='auto' unmountOnExit>
          {subItems.map(({ title: subTitle, slug, rbac, needsAccountSlug }) => {
            // FUTURE: don't hack this. Useparams?
            const selected =
              pathname.indexOf(`/accounts/${accountSlug}/${path}/${slug}`) !==
                -1 || pathname.indexOf(`/${path}/${slug}`) !== -1

            const item = (
              <Grid
                className={classes.DrawerSubItem}
                onClick={onSubItemClick(slug, needsAccountSlug)}
                key={`sites-menu-${slug}`}
                style={selected ? { background: palette.grey[800] } : null}
              >
                <Typography
                  variant='subtitle1'
                  className={classes.DrawerItemText}
                >
                  {subTitle}
                </Typography>
              </Grid>
            )

            if (rbac) {
              return (
                <Can I={rbac.actions} on={rbac.subject} key={subTitle}>
                  {() => item}
                </Can>
              )
            }

            return item
          })}
        </Collapse>
      )}
    </>
  )
}

DrawerItem.defaultProps = {
  location: {
    pathname: '',
  },
  open: false,
  title: '',
  icon: '',
  path: '',
  reverse: false,
  subItems: null,
  changeRoute: () => {},
  openSideBar: () => {},
  accountSlug: '',
}

DrawerItem.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  open: PropTypes.bool,
  title: PropTypes.string,
  icon: PropTypes.string,
  path: PropTypes.string,
  reverse: PropTypes.bool,
  subItems: PropTypes.array,
  changeRoute: PropTypes.func,
  openSideBar: PropTypes.func,
  accountSlug: PropTypes.string,
}

const mapStateToProps = state => ({
  accountSlug: getAccountSlug(state),
})

export default connect(
  mapStateToProps,
  null,
)(withRouter(DrawerItem))
