export const makeLabel = name => {
  let label = name
    .split('_')
    .join(' ')
    .toLowerCase()
  label = `${label.substring(0, 1).toUpperCase()}${label.substring(1)}`
  return label
}

export const makeIdentitySourceParams = (identitySource, accountSlug) => {
  const {
    name,
    tenantId,
    clientId,
    clientSecret,
    sourceTypeId,
    host,
    port,
    dn,
    group,
    username,
    password,
    isAzure,
  } = identitySource

  const config = isAzure
    ? {
        tenantId,
        clientId,
        clientSecret,
      }
    : {
        host,
        port,
        dn,
        group,
        username,
        password,
      }

  const params = {
    accountSlug,
    name,
    sourceTypeId,
    config: JSON.stringify(config),
  }

  if (identitySource.identitySourceId) {
    params.identitySourceId = identitySource.identitySourceId
  }

  return params
}

export const makeSourceTypeName = type => {
  if (!type.includes('_')) {
    return type
  }
  const split = type.split('_')
  let str = ''
  split.forEach(s => {
    str += `${s[0]}${s.slice(1, s.length).toLowerCase()} `
  })
  return str
}

export const getIdentitySourcesMetaInfo = identitySources => {
  const hasIdentitySources =
    identitySources &&
    Array.isArray(identitySources) &&
    identitySources.length > 0
  if (!hasIdentitySources) {
    return {}
  }
  let info = ''
  let sourceStatusData = {}
  if (identitySources.length === 1) {
    info = makeSourceTypeName(identitySources[0].sourceType.name)
  } else {
    info = `${identitySources.length} Identity Sources`
  }
  const failedSource = identitySources.find(
    ({ lastSyncRequest }) =>
      !lastSyncRequest ||
      (lastSyncRequest && lastSyncRequest.status !== 'SUCCESSFUL'),
  )
  sourceStatusData = failedSource
    ? {
        type: makeSourceTypeName(failedSource.sourceType.name),
        lastSyncRequest: failedSource.lastSyncRequest,
        status: failedSource.lastSyncRequest
          ? failedSource.lastSyncRequest.status
          : null,
      }
    : {
        status: 'SUCCESSFUL',
      }
  return {
    hasIdentitySources,
    info,
    sourceStatusData,
  }
}
