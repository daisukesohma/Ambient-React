import ability from './ability'
import { getAbilityFromPermission } from './permissionsToAbilities'

export default function updateAbilities(dbPermissions) {
  // Update CASL Abilities
  // ability.update() takes an array of abilities objects
  // Each ability object is in this format:
  // ie. { subject: 'all', actions: 'manage' }
  // ie. { subject: 'Organization', actions: 'delete', inverted: true }

  const abilities = dbPermissions
    .filter(p => getAbilityFromPermission(p))
    .map(p => getAbilityFromPermission(p))
  ability.update(abilities)

  return true // completed successfully
}
