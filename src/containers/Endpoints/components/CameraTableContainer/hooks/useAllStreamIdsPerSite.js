import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import get from 'lodash/get'
// src
import selectedSiteOption from 'selectors/cameras/selectedSiteOption'
import { getAllStreamIdsForSiteRequested } from 'redux/cameras/actions'

const useAllStreamIdsPerSite = () => {
  const selectedSite = useSelector(selectedSiteOption)
  const dispatch = useDispatch()
  const { account } = useParams()

  useEffect(() => {
    if (selectedSite && get(selectedSite, 'slug')) {
      dispatch(
        getAllStreamIdsForSiteRequested({
          accountSlug: account,
          siteSlug: selectedSite.slug,
        }),
      )
    }
  }, [selectedSite, account, dispatch])

  return [true]
}

export default useAllStreamIdsPerSite
