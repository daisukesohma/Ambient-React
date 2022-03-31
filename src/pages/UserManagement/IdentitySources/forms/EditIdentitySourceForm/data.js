export const commonFields = [
  {
    name: 'sourceTypeId',
    label: 'Identity Source Type',
    type: 'select',
    tips: 'Active Directory is a LDAP-supported database',
  },
]

export const ldapFields = [
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    placeholder: 'name',
    tips: 'Required',
  },
  {
    name: 'host',
    label: 'Host',
    type: 'text',
    placeholder: 'host',
    tips: 'Required',
  },
  {
    name: 'port',
    label: 'Port',
    type: 'text',
    placeholder: 'port',
    tips: 'Required',
  },
  {
    name: 'username',
    label: 'Username',
    type: 'text',
    placeholder: 'username',
    tips: 'Required',
  },
  {
    name: 'dn',
    label: 'BaseDN',
    type: 'text',
    placeholder: 'baseDN',
    tips: 'Required',
  },
  {
    name: 'group',
    label: 'Group',
    type: 'text',
  },
  {
    name: 'password',
    label: 'Password',
    type: 'text',
    placeholder: 'password',
    tips: 'Required',
  },
]

export const azureADFields = [
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    placeholder: 'name',
    tips: 'Required',
  },
  {
    name: 'tenantId',
    label: 'Tenant ID',
    type: 'text',
    tips: 'Required',
  },
  {
    name: 'clientId',
    label: 'Client ID',
    type: 'text',
    tips: 'Required',
  },
  {
    name: 'clientSecret',
    label: 'Client Secret',
    type: 'text',
    tips: 'Required',
  },
]
