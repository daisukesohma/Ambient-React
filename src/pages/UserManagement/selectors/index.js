import { createSelector } from '@reduxjs/toolkit'
import get from 'lodash/get'

import { getIdentitySourcesMetaInfo, makeLabel } from '../IdentitySources/utils'
import { filterUser } from '../utils'

export const getUserRoleOptions = createSelector(
  state => state.userManagement.userRoles,
  userRoles =>
    (userRoles || []).map(({ id, name }) => ({
      label: name,
      value: id,
    })),
)

export const getIdSourceTypeOptions = createSelector(
  state => state.userManagement.idSourceTypes,
  idSourceTypes =>
    (idSourceTypes || []).map(identitySource => ({
      label: makeLabel(identitySource.name),
      value: identitySource.id,
    })),
)

export const getUsers = createSelector(
  [
    state => state.userManagement.users,
    state => state.userManagement.identitySources,
    state => state.auth.sites,
  ],
  (users, identitySources, sites) => {
    const identitySourcesMetaInfo = getIdentitySourcesMetaInfo(identitySources)
    return (users || []).filter(user =>
      filterUser(
        user,
        identitySourcesMetaInfo.hasIdentitySources,
        sites.map(({ slug }) => slug),
      ),
    )
  },
)

export const getLoadingState = createSelector(
  [
    state => state.userManagement.loadingRoles,
    state => state.userManagement.loadingIdSourceTypes,
    state => state.userManagement.loadingIdentitySources,
  ],
  (loadingRoles, loadingIdSourceTypes, loadingIdentitySources) =>
    loadingRoles || loadingIdSourceTypes || loadingIdentitySources,
)
