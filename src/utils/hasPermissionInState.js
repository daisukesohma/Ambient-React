import get from 'lodash/get'
import includes from 'lodash/includes'

import { getPermissionFromAbility } from '../rbac/permissionsToAbilities'

const hasPermissionInState = (state, ability = {}) => {
  const permissions = get(state.auth, 'profile.role.permissionList', [])
  const permission = getPermissionFromAbility(ability)
  return includes(permissions, permission)
}

export default hasPermissionInState
