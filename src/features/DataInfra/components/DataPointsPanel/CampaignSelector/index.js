import React, { useEffect } from 'react'
import get from 'lodash/get'
import { useDispatch, useSelector, batch } from 'react-redux'
import { DropdownMenu } from 'ambient_ui'

import {
  campaignSelected,
  dataPointsFetchRequested,
  updateTabValue,
} from '../../../redux/dataInfraSlice'
import dropDownOptions from '../../../../../selectors/campaigns/dropDownOptions'

function CampaignSelector() {
  const dispatch = useDispatch()
  const campaignOptions = useSelector(
    dropDownOptions([state => get(state, 'dataInfra.allCampaigns', [])]),
  )
  const selectedCampaign = useSelector(
    state => state.dataInfra.selectedCampaign,
  )
  const dataPointsActiveFilter = useSelector(
    state => state.dataInfra.dataPointsActiveFilter,
  )

  // set default Campaign if no campaign selected
  useEffect(() => {
    if (selectedCampaign === {} && campaignOptions.length > 0) {
      dispatch(campaignSelected({ campaign: campaignOptions[0] }))
      dispatch(
        dataPointsFetchRequested({
          dataCampaignId: campaignOptions[0].id,
          page: 1,
          tsIdentifierStart: dataPointsActiveFilter.startTs,
          tsIdentifierEnd: dataPointsActiveFilter.endTs,
        }),
      )
    }
  }, [campaignOptions, dispatch, selectedCampaign, dataPointsActiveFilter])

  const handleCampaignChange = e => {
    const campaign = e.value
    batch(() => {
      dispatch(campaignSelected({ campaign }))
      dispatch(
        dataPointsFetchRequested({
          dataCampaignId: campaign.id,
          page: 1,
          tsIdentifierStart: dataPointsActiveFilter.startTs,
          tsIdentifierEnd: dataPointsActiveFilter.endTs,
        }),
      )
      dispatch(
        updateTabValue({
          tabValue: 0,
        }),
      )
    })
  }

  return (
    <div id='dataInfra-campaignSelector'>
      {campaignOptions.length > 0 && (
        <DropdownMenu
          darkMode
          menuItems={campaignOptions}
          selectedItem={campaignOptions.find(
            item => item.value.name === selectedCampaign.name,
          )}
          handleSelection={handleCampaignChange}
        />
      )}
    </div>
  )
}

export default CampaignSelector
