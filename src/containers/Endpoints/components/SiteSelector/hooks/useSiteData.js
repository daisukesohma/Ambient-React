import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import isEmpty from 'lodash/isEmpty'
import { fetchSitesRequested } from 'redux/cameras/actions'
import sitesDropdownOptions from 'selectors/cameras/sitesDropdownOptions'
import useGlobalSelectedSite from 'common/hooks/useGlobalSelectedSite'

const useSitesData = () => {
  const dispatch = useDispatch()
  const { account } = useParams()
  const loading = useSelector(state => state.cameras.sitesLoading)
  const [globalSelectedSite, setGlobalSelectedSite] = useGlobalSelectedSite()

  useEffect(() => {
    dispatch(fetchSitesRequested(account))
  }, [account, dispatch])

  const siteOptions = useSelector(sitesDropdownOptions)

  const _dispatchSelectedSite = site => {
    setGlobalSelectedSite(site)
  }

  const handleSiteSelection = item => {
    if (isEmpty(item)) return
    const { value } = item
    _dispatchSelectedSite(value)
  }

  return {
    loading,
    siteOptions,
    selectedSite: globalSelectedSite,
    handleSiteSelection,
  }
}

export default useSitesData
