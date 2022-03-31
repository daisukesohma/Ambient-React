import { useDispatch, useSelector, batch } from 'react-redux'
import { useParams } from 'react-router-dom'
// src
import { PAGE_LIMIT } from 'pages/Forensics/constants'
import {
  entityFetchRequested, // should change this name
  regionStatsFetchRequested,
  setSelectedPage,
} from 'redux/forensics/actions'
import useGlobalSelectedSite from 'common/hooks/useGlobalSelectedSite'

export default function useForensicData() {
  const dispatch = useDispatch()
  const { account } = useParams()
  const query = useSelector(state => state.forensics.searchQuery)
  const [globalSelectedSite] = useGlobalSelectedSite()
  const searchTsRange = useSelector(state => state.forensics.searchTsRange)
  const activeRegions = useSelector(state => state.forensics.activeRegions)
  const selectedPage = useSelector(state => state.forensics.searchSelectedPage)
  const activeStream = useSelector(state => state.forensics.activeStream)

  const fetchRegionStats = (overrideVariables = {}) => {
    if (!globalSelectedSite) return

    // ensure query, override variable
    const queryVariable = overrideVariables.query || query

    // This really just avoids errors from when we reset the searchQuery to {}, and if that is not of the OptionInput!
    // shape, gql will fail.
    if (!queryVariable.searchType) return

    // default is the production search
    const variables = {
      accountSlug: account,
      siteSlug: globalSelectedSite,
      query: queryVariable,
      startTs: searchTsRange[0],
      endTs: searchTsRange[1],
      ...overrideVariables,
    }

    dispatch(regionStatsFetchRequested(variables))
  }

  const fetchEntities = (overrideVariables = {}) => {
    // ensure selected site
    if (!globalSelectedSite) return

    const queryVariable = overrideVariables.query || query
    if (!queryVariable.searchType) return

    // default is the production search
    const variables = {
      accountSlug: account,
      siteSlug: globalSelectedSite,
      query: queryVariable,
      startTs: searchTsRange[0],
      endTs: searchTsRange[1],
      regionIds:
        activeRegions && activeRegions.length > 0 ? activeRegions : null,
      streamIds: !activeStream ? null : [activeStream],
      limit: PAGE_LIMIT,
      page: 1,
      ...overrideVariables,
    }

    batch(() => {
      dispatch(entityFetchRequested(variables))

      // keep page in sync if not same page
      const { page } = overrideVariables
      if (typeof page !== 'undefined' && selectedPage !== page) {
        dispatch(setSelectedPage(page))
      }
    })
  }

  return [fetchRegionStats, fetchEntities]
}
