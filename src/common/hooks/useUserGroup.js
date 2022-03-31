import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import some from 'lodash/some'
import get from 'lodash/get'

function useUserGroup({ name }) {
  const groups = useSelector(state => get(state.auth, 'user.groups', []))
  return useMemo(() => some(groups, { name }), [groups, name])
}

export default useUserGroup
