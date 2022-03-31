import get from 'lodash/get'

export const trimUser = (user, accountSlug) => {
  const edges = get(user, 'profile.sites.edges')
  const sitesArr = edges
    ? edges
        .filter(({ node }) => node.account.slug === accountSlug)
        .map(({ node }) => {
          return {
            label: node.name,
            value: node.gid,
            slug: node.slug,
          }
        })
    : []
  return {
    id: user.id,
    isActive: user.isActive,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    username: user.username,
    phoneNumber: get(user, 'profile.phoneNumber'),
    countryCode: get(user, 'profile.countryCode'),
    isoCode: get(user, 'profile.isoCode'),
    role: get(user, 'profile.role'),
    sites: sitesArr,
    img: get(user, 'profile.img'),
    isSignedIn: user.isSignedIn,
    profileId: get(user, 'profile.id'),
    federationId:
      get(user, 'profile.federationProfiles') &&
      get(user, 'profile.federationProfiles').length > 0 &&
      get(user, 'profile.federationProfiles')[0].identifier,
    federationIdType:
      get(user, 'profile.federationProfiles') &&
      get(user, 'profile.federationProfiles').length > 0 &&
      get(user, 'profile.federationProfiles')[0].identitySource.name,
  }
}

export const filterUser = (user, hasIdentitySources, siteSlugs) => {
  // if the account has identity sources, we should only show the users with identity source
  // if not, just show all of the users
  return (
    user.role !== null &&
    user.isActive &&
    (!hasIdentitySources || (hasIdentitySources && user.federationId)) &&
    user.sites.some(({ slug }) => siteSlugs.includes(slug))
  )
}
