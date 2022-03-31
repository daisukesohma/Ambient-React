import { createSelector } from '@reduxjs/toolkit'
import find from 'lodash/find'
import get from 'lodash/get'

export default ({ accountSlug }) => {
  return createSelector([state => state.auth.accounts], accounts => {
    const account = find(accounts, { slug: accountSlug })
    return get(account, 'features', [])
  })
}
