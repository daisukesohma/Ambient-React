import React from 'react'
import { Button } from 'ambient_ui'
import { useDispatch, batch } from 'react-redux'

import useForensicData from '../../../../hooks/useForensicData'
import { setSelectedPage } from '../../../../../../redux/forensics/actions'

function SearchButton() {
  const dispatch = useDispatch()
  const [fetchRegionStats, fetchEntities] = useForensicData()

  const handleSearch = () => {
    batch(() => {
      dispatch(setSelectedPage(1))
      fetchEntities()
      fetchRegionStats()
    })
  }

  return <>{false && <Button onClick={handleSearch}>Search</Button>}</>
}

export default SearchButton
