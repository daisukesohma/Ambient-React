import { keys, values, findIndex } from 'lodash'

const mapPermissionToAbility = {
  // from redux/auth/user/internal, not a permission in the db
  is_internal: {
    subject: 'Admin',
    action: 'is_internal',
  },
  // from redux/auth/profile/role/role, not a permission in the db
  mute_alert_sounds: {
    subject: 'Alerts',
    action: 'mute_sounds',
  },

  add_users: { subject: 'UserManagement', action: 'create_users' }, // duplicate of create_users, deprecate
  alert_escalation_receive: {
    subject: 'Alerts',
    action: 'receive_mobile_escalation',
  },
  alert_escalation_create_dispatch: {
    subject: 'Alerts',
    action: 'request_dispatch',
  },
  create_analytics_reports: {
    subject: 'Reporting-Analytics',
    action: 'create',
  },
  create_archives: { subject: 'Archives', action: 'create' },
  create_cases: { subject: 'CaseManagement', action: 'create_cases' },
  create_escalations: { subject: 'Escalations', action: 'create' },
  create_video_walls: { subject: 'VideoWalls', action: 'create' },
  create_users: { subject: 'UserManagement', action: 'create_users' },
  delete_analytics_reports: {
    subject: 'Reporting-Analytics',
    action: 'delete',
  },
  delete_archives: { subject: 'Archives', action: 'delete' },
  delete_cases: { subject: 'CaseManagement', action: 'delete_cases' },
  delete_escalations: { subject: 'Escalations', action: 'delete' },
  delete_users: { subject: 'UserManagement', action: 'delete_users' },
  delete_video_walls: { subject: 'VideoWalls', action: 'delete' },
  download_security_reports: {
    subject: 'Reporting',
    action: 'download_security_reports',
  },
  subscribe_security_reports: {
    subject: 'Reporting',
    action: 'subscribe_to_security_reports',
  },
  update_analytics_reports: {
    subject: 'Reporting-Analytics',
    action: 'update',
  },
  update_cases: { subject: 'CaseManagement', action: 'update_cases' },
  update_context_graph: { subject: 'ContextGraph', action: 'update' },
  update_escalations: { subject: 'Escalations', action: 'update' },
  update_infra_endpoints: {
    subject: 'Infrastructure-Endpoints',
    action: 'manage',
  },
  update_infra_nodes: { subject: 'Infrastructure-Nodes', action: 'manage' },
  update_infra_sites: { subject: 'Infrastructure-Sites', action: 'manage' },
  update_users: { subject: 'UserManagement', action: 'update_users' },
  update_video_walls: { subject: 'VideoWalls', action: 'update' },
  view_analytics_reports: {
    subject: 'Reporting-Analytics',
    action: 'view',
  },
  view_archives: { subject: 'Archives', action: 'view' },
  view_cases: { subject: 'CaseManagement', action: 'view_cases' },
  view_context_graph: { subject: 'ContextGraph', action: 'view' },
  view_escalations: { subject: 'Escalations', action: 'view' },
  view_forensics: { subject: 'Forensics', action: 'view' },
  view_infra_endpoints: {
    subject: 'Infrastructure-Endpoints',
    action: 'view',
  },
  view_jobs: { subject: 'Infrastructure-Jobs', action: 'view' },
  view_infra_nodes: { subject: 'Infrastructure-Nodes', action: 'view' },
  view_infra_sites: { subject: 'Infrastructure-Sites', action: 'view' },
  view_investigations: { subject: 'Investigations', action: 'view' },
  view_operator_page: { subject: 'OperatorPage', action: 'view' },
  view_security_reports: {
    subject: 'Reporting-Security',
    action: 'view',
  },
  view_incognito_streams: { subject: 'ViewIncognitoStreams', action: 'view' },
  view_user_management: { subject: 'UserManagement', action: 'list_users' },
  view_video_walls: { subject: 'VideoWalls', action: 'view' },
  vms_advanced_controls: { subject: 'VmsAdvancedControls', action: 'view' },
  activity_log: { subject: 'Activity-Log', action: 'view' },
  view_reid: { subject: 'Live', action: 'search_person' },

  // Stream Configuration
  view_stream_configurations: {
    subject: 'StreamConfiguration',
    action: 'view',
  },
  create_stream_configurations: {
    subject: 'StreamConfiguration',
    action: 'create',
  },
  update_stream_configurations: {
    subject: 'StreamConfiguration',
    action: 'update',
  },
  delete_stream_configurations: {
    subject: 'StreamConfiguration',
    action: 'delete',
  },
  // Contact Resources
  view_contact_resources: {
    subject: 'ContactResources',
    action: 'view',
  },
  create_contact_resources: {
    subject: 'ContactResources',
    action: 'create',
  },
  update_contact_resources: {
    subject: 'ContactResources',
    action: 'update',
  },
  delete_contact_resources: {
    subject: 'ContactResources',
    action: 'delete',
  },
  create_work_shifts: {
    subject: 'WorkShifts',
    action: 'create',
  },
  // Data Infra
  view_data_campaigns: {
    subject: 'Data Campaigns',
    action: 'view',
  },
  create_data_campaigns: {
    subject: 'Data Campaigns',
    action: 'create',
  },
  update_data_campaigns: {
    subject: 'Data Campaigns',
    action: 'update',
  },
  delete_data_campaigns: {
    subject: 'Data Campaigns',
    action: 'delete',
  },
  view_data_points: {
    subject: 'DataPoints',
    action: 'view',
  },
  update_data_points: {
    subject: 'DataPoints',
    action: 'update',
  },
  create_data_points: {
    subject: 'DataPoints',
    action: 'create',
  },

  // Verification Portal
  view_verification_portal: {
    subject: 'VerificationPortal',
    action: 'view',
  },
  // Internal admin
  view_internal_admin: {
    subject: 'InternalAdmin',
    action: 'view',
  },
  // Support Access
  request_support_access: {
    subject: 'SupportAccess',
    action: 'request',
  },
  grant_support_access: {
    subject: 'SupportAccess',
    action: 'grant',
  },
  view_support_access: {
    subject: 'SupportAccess',
    action: 'view',
  },
  // Nodes - Inventory & Management
  // # SKUS
  create_skus: {
    subject: 'Skus',
    action: 'create',
  },
  view_skus: {
    subject: 'Skus',
    action: 'view',
  },
  update_skus: {
    subject: 'Skus',
    action: 'update',
  },
  delete_skus: {
    subject: 'Skus',
    action: 'delete',
  },
  //   # PARTNERS
  create_hardware_partners: {
    subject: 'HardwarePartners',
    action: 'create',
  },
  view_hardware_partners: {
    subject: 'HardwarePartners',
    action: 'view',
  },
  update_hardware_partners: {
    subject: 'HardwarePartners',
    action: 'update',
  },
  delete_hardware_partners: {
    subject: 'HardwarePartners',
    action: 'delete',
  },
  //   # SKU CAPABILITIES
  create_sku_capabilities: {
    subject: 'SkuCapabilities',
    action: 'create',
  },
  view_sku_capabilities: {
    subject: 'SkuCapabilities',
    action: 'view',
  },
  update_sku_capabilities: {
    subject: 'SkuCapabilities',
    action: 'update',
  },
  delete_sku_capabilities: {
    subject: 'SkuCapabilities',
    action: 'delete',
  },
  //   # NODE PROVISION
  create_node_provision: {
    subject: 'NodeProvision',
    action: 'create',
  },
  view_node_provision: {
    subject: 'NodeProvision',
    action: 'view',
  },
  update_node_provision: {
    subject: 'NodeProvision',
    action: 'update',
  },
  delete_node_provision: {
    subject: 'NodeProvision',
    action: 'delete',
  },
  //   # NODE ADMIN
  view_node_admin: {
    subject: 'NodeAdmin',
    action: 'view',
  },
  update_node_admin: {
    subject: 'NodeAdmin',
    action: 'update',
  },
  //   # AMBIENT OS DOWNLOAD
  download_ambient_os: {
    subject: 'AmbientOs',
    action: 'download',
  },
}

export const getAbilityFromPermission = permission => {
  return mapPermissionToAbility[permission]
}

export const getPermissionFromAbility = ability => {
  const keysList = keys(mapPermissionToAbility)
  const valuesList = values(mapPermissionToAbility)
  const keyIndex = findIndex(valuesList, ability)
  return keysList[keyIndex]
}
