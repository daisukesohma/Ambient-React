import PropTypes from 'prop-types'

const RbacMenuItemPropType = PropTypes.shape({
  subject: PropTypes.string,
  actions: PropTypes.string,
})

const RbacMenuPropType = PropTypes.oneOfType([
  PropTypes.shape({
    or: PropTypes.arrayOf(PropTypes.shape(RbacMenuItemPropType)),
  }),
  PropTypes.shape(RbacMenuItemPropType),
])

export const SidebarMenuItemPropType = PropTypes.shape({
  title: PropTypes.string,
  path: PropTypes.string,
  icon: PropTypes.string,
  rbac: PropTypes.shape(RbacMenuPropType),
  subItems: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      slug: PropTypes.string,
      icon: PropTypes.string,
      rbac: PropTypes.shape(RbacMenuPropType),
      hideOnMobile: PropTypes.bool,
    }),
  ),
  hideOnMobile: PropTypes.bool,
})

export const SidebarOptionsPropType = PropTypes.shape({
  menus: PropTypes.shape({
    primaryMenus: PropTypes.arrayOf(SidebarMenuItemPropType),
    otherMenus: PropTypes.arrayOf(SidebarMenuItemPropType),
  }),
  pathPrefix: PropTypes.string,
})
