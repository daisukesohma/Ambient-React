import get from 'lodash/get'

export default (user, profile) => ({
  $name: `${get(user, 'firstName')} ${get(user, 'lastName')}`,
  $distinct_id: get(user, 'id'),
  $email: get(user, 'email'),
  $last_seen: new Date().getTime(),
  Role: get(profile, 'role.role'),
})
