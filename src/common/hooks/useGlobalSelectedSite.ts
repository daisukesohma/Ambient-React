import some from 'lodash/some'
import { useDispatch, useSelector } from 'react-redux'
import { selectSite } from 'redux/slices/settings'
import { AuthSliceProps } from 'redux/slices/auth'
import isEmpty from 'lodash/isEmpty'
import head from 'lodash/head'
import get from 'lodash/get'

interface Store {
  settings: {
    selectedSite: string | null
    previousSelectedSite: string | null
  }
}
export default function useGlobalSelectedSite(
  nullable = false,
): [string | null, (newSiteSlug: string | null) => void] {
  const dispatch = useDispatch()
  const globalSelectedSite = useSelector(
    (state: Store) => state.settings.selectedSite,
  )
  const previousGlobalSelectedSite = useSelector(
    (state: Store) => state.settings.previousSelectedSite,
  )

  const accountSites = useSelector((state: AuthSliceProps) => state.auth.sites)

  // if this is null, means globalSelectedSites is in the account site list
  const firstAccountSite =
    !some(accountSites, ['slug', globalSelectedSite]) && !isEmpty(accountSites)
      ? get(head(accountSites), 'slug', null)
      : null

  const setGlobalSelectedSite = (newSiteSlug: string | null) => {
    dispatch(selectSite({ selectedSite: newSiteSlug }))
  }

  // if globalSelectedSite is null, means the user selected All Sites
  if (globalSelectedSite === null)
    return [globalSelectedSite, setGlobalSelectedSite]

  return [
    nullable
      ? firstAccountSite || globalSelectedSite
      : firstAccountSite || globalSelectedSite || previousGlobalSelectedSite,
    setGlobalSelectedSite,
  ]
}
