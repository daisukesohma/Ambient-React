import React, { useEffect } from 'react'
import { isMobileOnly } from 'react-device-detect'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import { fetchSitesRequested } from '../../redux/slices/operatorPage'
import MobileView from './MobileView'
import DesktopView from './DesktopView'

export default function OperatorPage() {
  const dispatch = useDispatch()
  const { account } = useParams()
  const siteLoading = useSelector(state => state.operatorPage.sitesLoading)
  const sites = useSelector(state => state.operatorPage.sites)

  useEffect(() => {
    dispatch(fetchSitesRequested({ accountSlug: account }))
  }, [account, dispatch])

  if (siteLoading || (sites && sites.length === 0)) return null

  return isMobileOnly ? <MobileView /> : <DesktopView />
}
