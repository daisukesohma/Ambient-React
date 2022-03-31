import map from 'lodash/map'

export const addSitesToMenus = (sitesArray, primaryMenus, index) => {
  const newSites = map(sitesArray, site => ({
    title: site.name,
    slug: `${site.slug}/live`,
  }))
  const updatedPrimaryMenus = [...primaryMenus]
  updatedPrimaryMenus[index].subItems = newSites
  return updatedPrimaryMenus
}
