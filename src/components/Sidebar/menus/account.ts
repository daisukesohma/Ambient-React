// rbac mimics object structure of mapPermissionToAbility from rbac/permissionsToAbilities
// rbac key is optional on all top level and subItems.
// if rbac key doesn't exist, it will be shown to all users, else they have to have the ability defined by subject and actions.
//
const primaryMenus = [
  {
    title: 'Live',
    path: 'live',
    icon: 'ActivePulse',
    rbac: { subject: 'OperatorPage', actions: 'view' },
    hideOnMobile: false,
  },
  {
    title: 'Sites',
    path: 'sites',
    icon: 'Sites',
    rbac: { subject: 'OperatorPage', actions: 'view' },
    subItems: null,
  },
  {
    title: 'Video Walls',
    path: 'video-walls',
    icon: 'Video',
    rbac: { subject: 'VideoWalls', actions: 'view' },
    hideOnMobile: true,
  },
  {
    title: 'Context Graph',
    path: 'context',
    icon: 'Grid',
    rbac: {
      or: [
        { subject: 'ContextGraph', actions: 'view' },
        { subject: 'Escalations', actions: 'view' },
      ],
    },
    subItems: [
      {
        title: 'Graph',
        slug: 'graph',
        rbac: { subject: 'ContextGraph', actions: 'view' },
      },
      {
        title: 'Escalations',
        slug: 'escalations/profiles',
        rbac: { subject: 'Escalations', actions: 'view' },
        hideOnMobile: true,
      },
      {
        title: 'Scheduler',
        slug: 'scheduler',
        rbac: { subject: 'Escalations', actions: 'view' },
        hideOnMobile: true,
      },
    ],
  },
  {
    title: 'Infrastructure',
    path: 'infrastructure',
    icon: 'Activity',
    rbac: {
      or: [
        { subject: 'Infrastructure-Sites', actions: 'view' },
        { subject: 'Infrastructure-Nodes', actions: 'view' },
        { subject: 'Infrastructure-Endpoints', actions: 'view' },
        { subject: 'Infrastructure-Jobs', actions: 'view' },
      ],
    },
    subItems: [
      {
        title: 'Sites',
        slug: 'sites',
        rbac: { subject: 'Infrastructure-Sites', actions: 'view' },
      },
      {
        title: 'Appliances',
        slug: 'appliances',
        rbac: { subject: 'Infrastructure-Nodes', actions: 'view' },
      },
      {
        title: 'Cameras',
        slug: 'cameras',
        rbac: { subject: 'Infrastructure-Endpoints', actions: 'view' },
      },
      {
        title: 'Jobs',
        slug: 'jobs',
        rbac: { subject: 'Infrastructure-Jobs', actions: 'view' },
      },
    ],
  },
  {
    title: 'Dashboards',
    path: 'dashboards',
    icon: 'FileText',
    rbac: {
      or: [
        { subject: 'Reporting-Security', actions: 'view' },
        { subject: 'Reporting-Analytics', actions: 'view' },
      ],
    },
    subItems: [
      {
        title: 'Security Operations',
        slug: 'operations',
        rbac: { subject: 'Reporting-Security', actions: 'view' },
      },
      {
        title: 'Analytics',
        slug: 'analytics',
        rbac: { subject: 'Reporting-Analytics', actions: 'view' },
      },
      {
        title: 'PACS Alarms',
        slug: 'pacs-alarms',
        // rbac: { subject: 'Access-Alarm', actions: 'view' },
      },
    ],
  },
  {
    title: 'History',
    path: 'history',
    icon: 'Polygon',
    rbac: {
      or: [
        { subject: 'Investigations', actions: 'view' },
        { subject: 'Archives', actions: 'view' },
      ],
    },
    subItems: [
      {
        title: 'Alerts',
        slug: 'alerts',
        rbac: { subject: 'Investigations', actions: 'view' },
      },
      {
        title: 'Activities',
        slug: 'activities',
        rbac: { subject: 'Investigations', actions: 'view' },
      },
      {
        title: 'Archives',
        slug: 'archives',
        rbac: { subject: 'Archives', actions: 'view' },
      },
    ],
  },
  {
    title: 'Forensics',
    path: 'forensics',
    icon: 'Investigate',
    rbac: { subject: 'Forensics', actions: 'view' },
  },
]

const otherMenus = [
  {
    title: 'Settings',
    path: 'settings',
    icon: 'Gear',
    reverse: true,
    subItems: [
      {
        title: 'Profile Settings',
        slug: 'profile',
        needsAccountSlug: true,
      },
      {
        title: 'User Management',
        slug: 'users',
        needsAccountSlug: true,
        rbac: { subject: 'UserManagement', actions: 'list_users' },
        hideOnMobile: false,
      },
      {
        title: 'Contact Resources',
        slug: 'contact-resources',
        rbac: { subject: 'ContactResources', actions: 'view' },
        needsAccountSlug: true,
        hideOnMobile: false,
      },
      {
        title: 'External Contacts',
        slug: 'external-profiles',
        rbac: { subject: 'UserManagement', actions: 'list_users' },
        needsAccountSlug: true,
        hideOnMobile: false,
      },
    ],
  },
  {
    title: 'Support',
    path: 'support',
    icon: 'Help',
  },
]

export { primaryMenus, otherMenus }
