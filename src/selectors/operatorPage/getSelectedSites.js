import { createSelector } from '@reduxjs/toolkit'
import differenceBy from 'lodash/differenceBy'

const getSelectedSites = createSelector(
  [
    state => state.operatorPage.sites || [],
    state => state.operatorPage.unSelectedSites || [],
  ],
  (sites, unSelectedSites) => differenceBy(sites, unSelectedSites, 'slug'),
)

export default getSelectedSites
