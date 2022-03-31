import React, { useState, useEffect, useContext } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import clsx from 'clsx'
import Drawer from '@material-ui/core/Drawer'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import Avatar from '@material-ui/core/Avatar'
import Divider from '@material-ui/core/Divider'
import { isMobileOnly } from 'react-device-detect'
import get from 'lodash/get'
import { Icon } from 'react-icons-kit'
import isEmpty from 'lodash/isEmpty'
// src
import { setSiteBarStatus } from 'redux/slices/settings'
import { clearAlerts } from 'redux/slices/operatorPage'
import { AbilityContext, Can } from 'rbac'
import LogoIcon from 'assets/logo_icon.png'
import WebLogo from 'assets/web_logo.png'
import { refreshCcw } from 'react-icons-kit/feather/refreshCcw'
import InternetSpeedIndicator from 'components/organisms/InternetSpeedIndicator'
import Tooltip from '@material-ui/core/Tooltip'
import TooltipText from 'components/Tooltip/TooltipText'
import { primaryMenus, otherMenus } from './menus/account'
import ConfirmDialog from 'components/ConfirmDialog'

import DrawerItem from './DrawerItem/index'
import { addSitesToMenus } from './utils'
import useStyles from './styles'
import { verifySitesRequested } from '../../redux/slices/auth'

function Sidebar({ menus, pathPrefix }) {
  const history = useHistory()
  const dispatch = useDispatch()
  const { account, site } = useParams()
  const ability = useContext(AbilityContext)
  const sideBarOpened = useSelector(state => state.settings.sideBarOpened)
  const firstName = useSelector(state => state.auth.user.firstName)
  const lastName = useSelector(state => state.auth.user.lastName)
  const profileImg = useSelector(state => state.auth.profile.img)
  const sites = useSelector(state => state.auth.sites)
  const darkMode = useSelector(state => state.settings.darkMode)
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false)
  const sitesLoading = useSelector(state => state.auth.sitesLoading)
  const accounts = useSelector(state => state.auth.accounts)
  const firstAccountSlug = get(accounts, '[0].slug')

  const accountSlug = account || firstAccountSlug

  useEffect(() => {
    if (accountSlug) {
      dispatch(clearAlerts())
      dispatch(
        verifySitesRequested({
          accountSlug,
        }),
      )
    }
  }, [accountSlug, dispatch])

  const { primaryMenus, otherMenus } = menus

  const [mainMenu, setMainMenu] = useState(
    primaryMenus
      .filter(menu => {
        return (
          !(isMobileOnly && menu.hideOnMobile) &&
          !(!isMobileOnly && menu.hideOnDesktop)
        )
      }) // remove main menus
      .map(menu => ({
        ...menu,
        subItems: menu.subItems
          ? menu.subItems.filter(
              subMenu =>
                !(isMobileOnly && subMenu.hideOnMobile) &&
                !(!isMobileOnly && subMenu.hideOnDesktop),
            )
          : menu.subItems,
      })), // remove sub menus
  )
  const classes = useStyles({ sideBarOpened, mobile: isMobileOnly })

  useEffect(() => {
    // TODO: This is a really hacky way to add Sites Menu to the Sidebar.
    // Granted, the reason we do this is because Sites cannot be specified
    // declaratively like other menu items. Still, there are many bad things here:
    // 1) Utility method is only used here
    // 2) This hack check is needed to make Sidebar reusable in non-account based pages.
    if (!pathPrefix) {
      setMainMenu(addSitesToMenus(sites, mainMenu, 1))
    }
    // eslint-disable-next-line
  }, [sites, account, site, sitesLoading])

  const handleDrawerOpen = () => dispatch(setSiteBarStatus({ isOpened: true }))
  const handleDrawerClose = () =>
    dispatch(setSiteBarStatus({ isOpened: false }))

  const changeRoute = route => {
    if (route === '/logout') return setLogoutConfirmOpen(true)
    history.push(route)
    if (isMobileOnly) dispatch(setSiteBarStatus({ isOpened: false }))
    return true
    // TODO: Set state of currentSite if it is a sites route --> Not needed but we may want to do this
  }

  const onSwitch = () => {
    history.push('/select-account')
  }

  const routePrefix = pathPrefix || `accounts/${accountSlug}`

  return (
    <Drawer
      variant='permanent'
      className={clsx(classes.SidebarDrawer, {
        [classes.SidebarDrawerOpen]: sideBarOpened,
        [classes.SidebarDrawerClose]: !sideBarOpened,
      })}
      classes={{
        paper: clsx({
          [classes.SidebarDrawerOpen]: sideBarOpened,
          [classes.SidebarDrawerClose]: !sideBarOpened,
        }),
      }}
      open={sideBarOpened}
    >
      <Grid
        container
        direction='row'
        alignItems='center'
        justify='space-between'
        className={classes.SidebarLogoWrapper}
      >
        <img
          src={sideBarOpened ? WebLogo : LogoIcon}
          alt='Ambient'
          className={classes.SidebarLogo}
        />
        {sideBarOpened && accounts.length > 1 && (
          <Tooltip title='Switch accounts' placement='bottom'>
            <IconButton
              onClick={() => onSwitch()}
              className={classes.SwitchButton}
            >
              <Icon icon={refreshCcw} size={16} />
            </IconButton>
          </Tooltip>
        )}
      </Grid>

      <Grid className={classes.SidebarAvatarContainer}>
        <Avatar
          alt={firstName}
          src={profileImg}
          className={clsx('am-subtitle1', classes.SidebarAvatar)}
        >
          {firstName ? firstName.charAt(0).toUpperCase() : null}
        </Avatar>
        {sideBarOpened && (
          <div className={clsx('am-subtitle1', classes.SidebarUserName)}>
            {firstName} {lastName}
          </div>
        )}
        {sideBarOpened && (
          <span style={{ marginLeft: 24 }}>
            <Tooltip
              content={<TooltipText>Internet connectivity speed</TooltipText>}
            >
              <InternetSpeedIndicator />
            </Tooltip>
          </span>
        )}
      </Grid>
      <Divider />

      <Grid
        className={clsx(classes.SidebarMenuContainer, 'introjs-sidebar')}
        onDoubleClick={() =>
          dispatch(setSiteBarStatus({ isOpened: !sideBarOpened }))
        }
      >
        <Grid>
          {mainMenu.map(({ title, icon, subItems, path, rbac }) => {
            const menuItem = (
              <DrawerItem
                open={sideBarOpened}
                title={title}
                subItems={subItems}
                key={title}
                path={`${routePrefix}${isEmpty(path) ? '' : `/${path}`}`}
                icon={icon}
                changeRoute={changeRoute}
                openSideBar={handleDrawerOpen}
              />
            )

            if (rbac) {
              // OR logic
              if (rbac.or) {
                if (
                  rbac.or
                    .map(a => ability.can(a.actions, a.subject))
                    .includes(true)
                ) {
                  return menuItem
                }
                return null
              }

              // AND logic
              if (rbac.and) {
                if (
                  rbac.and
                    .map(a => ability.can(a.actions, a.subject))
                    .includes(false)
                ) {
                  return null
                }

                return menuItem
              }

              // if its a single rbac item

              return (
                <Can I={rbac.actions} on={rbac.subject} key={title}>
                  {menuItem}
                </Can>
              )
            }

            // by default, show the item
            return menuItem
          })}
        </Grid>
        <Grid>
          {otherMenus.map(({ title, icon, subItems, reverse, path }) => (
            <DrawerItem
              open={sideBarOpened}
              title={title}
              subItems={subItems}
              reverse={reverse}
              key={title}
              path={
                subItems
                  ? path
                  : `${routePrefix}${isEmpty(path) ? '' : `/${path}`}`
              }
              icon={icon}
              changeRoute={changeRoute}
              openSideBar={handleDrawerOpen}
            />
          ))}
          <DrawerItem
            open={sideBarOpened}
            title='Logout'
            reverse={false}
            key='Logout'
            path='logout'
            icon='Door'
            changeRoute={changeRoute}
            openSideBar={handleDrawerOpen}
          />
        </Grid>
      </Grid>

      <ConfirmDialog
        open={logoutConfirmOpen}
        onClose={() => {
          setLogoutConfirmOpen(false)
        }}
        onConfirm={() => {
          setLogoutConfirmOpen(true)
          history.push('/logout')
        }}
        content='Are you sure you want to logout?'
      />

      <div className={classes.SidebarToolbar}>
        {sideBarOpened ? (
          <IconButton
            onClick={handleDrawerClose}
            className={classes.SidebarIconBtn}
          >
            <ChevronLeftIcon />
          </IconButton>
        ) : (
          <IconButton
            onClick={handleDrawerOpen}
            className={classes.SidebarIconBtn}
          >
            <ChevronRightIcon />
          </IconButton>
        )}
      </div>
    </Drawer>
  )
}

Sidebar.defaultProps = {
  menus: {
    primaryMenus,
    otherMenus,
  },
}

export default Sidebar
