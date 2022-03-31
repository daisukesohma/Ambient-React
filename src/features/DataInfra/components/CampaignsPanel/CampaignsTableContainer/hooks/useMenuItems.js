import { useSelector, useDispatch, batch } from 'react-redux'

import {
  setCampaignAction,
  confirmDialogOpen,
} from '../../../../redux/dataInfraSlice'

const useMenuItems = (campaignId, validActions) => {
  const isInternal = useSelector(state => state.auth.user.internal)
  const dispatch = useDispatch()
  const campaignActionToReadable = {
    STARTED: 'START',
    DELETED: 'DELETE',
    ARCHIVED: 'ARCHIVE',
    STOPPED: 'STOP',
  }
  let menuItems = validActions.map(action => {
    return {
      label: campaignActionToReadable[action],
      onClick: () => {
        batch(() => {
          dispatch(setCampaignAction({ action, campaignId }))
          dispatch(confirmDialogOpen())
        })
      },
    }
  })

  if (isInternal) {
    menuItems = [...menuItems]
  }

  return [menuItems]
}

export default useMenuItems
