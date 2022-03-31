// Icon handling is in Sidebar/DrawerItem code. May want a separate component to handle it.

const primaryMenus = [
  {
    title: 'Dashboard',
    path: '',
    icon: 'Dashboard',
  },
  // {
  //   title: 'SOC',
  //   path: 'soc',
  //   icon: 'Investigate',
  //   rbac: { subject: 'Forensics', actions: 'view' },
  // },
  {
    title: 'Verification Portal',
    path: 'verification-portal',
    icon: 'Polygon',
    rbac: { subject: 'VerificationPortal', actions: 'view' },
  },
  {
    title: 'Data Infrastructure',
    path: 'data-infrastructure',
    icon: 'Grid',
    rbac: { subject: 'Data Campaigns', actions: 'view' },
  },
  {
    title: 'Inventory',
    path: 'nodes/inventory',
    icon: 'package',
    rbac: { subject: 'NodeProvision', actions: 'view' },
  },
  {
    title: 'Skus',
    path: 'nodes/skus',
    icon: 'tags',
    rbac: { subject: 'Skus', actions: 'view' },
  },
  {
    title: 'Alerting',
    path: 'alerting',
    icon: 'Caution',
    subItems: [
      {
        title: 'Threat Signatures',
        slug: 'threat-signatures',
        // TODO:
        // rbac: { subject: 'Forensics', actions: 'view' },
      },
      {
        title: 'Alerts',
        slug: 'alerts',
        rbac: { subject: 'ContextGraph', actions: 'update' },
      },
    ],
  },
  {
    title: 'Dataset Management',
    path: 'dms',
    icon: 'Layout',
  },
  {
    title: 'Support',
    path: 'support',
    icon: 'Help',
    // rbac: {
    //   or: [
    //     { subject: 'SupportAccess', actions: 'view' },
    //     { subject: 'SupportAccess', actions: 'request' }
    //   ]
    // },
    subItems: [
      {
        title: 'My Requests',
        slug: 'my-requests',
        rbac: { subject: 'SupportAccess', actions: 'request' },
      },
      {
        title: 'Review',
        slug: 'review',
        rbac: { subject: 'SupportAccess', actions: 'view' },
      },
    ],
    hideOnMobile: false,
  },
]

const otherMenus: never[] = []

const sidebarOptions = {
  menus: {
    primaryMenus,
    otherMenus,
  },
  pathPrefix: 'internal',
}

export { primaryMenus, otherMenus, sidebarOptions }
