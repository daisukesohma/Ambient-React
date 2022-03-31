import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { clone } from 'lodash'
// src
import { updateAbilities } from 'rbac'
import { AuthSliceProps } from 'redux/slices/auth'
import isAdminSelector from 'selectors/auth/isAdmin'

// selects abilities from state
export default function useUpdateAbilities(): void {
  const permissionList = useSelector(
    (state: AuthSliceProps) => state.auth.profile.role.permissionList,
  )
  const isAdmin = useSelector(isAdminSelector)
  const isInternal = useSelector(
    (state: AuthSliceProps) => state.auth.profile.internal,
  )

  useEffect(() => {
    if (permissionList) {
      const completePermissionList: string[] = clone(permissionList)

      // Additional flags for permission list
      if (isInternal) completePermissionList.push('is_internal')
      if (isAdmin) completePermissionList.push('mute_alert_sounds')

      updateAbilities(completePermissionList)
    }
  }, [permissionList, isInternal, isAdmin])
}
