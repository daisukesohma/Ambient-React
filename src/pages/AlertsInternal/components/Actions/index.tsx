/* eslint-disable @typescript-eslint/no-non-null-assertion */

import React from 'react'
import MoreOptionMenu from 'ambient_ui/components/optionMenu/MoreOptionMenu'
import { useSelector, useDispatch, batch } from 'react-redux'

import { setRecallModalOpen } from '../../redux/alertsInternalSlice'

interface Props {
  alertId: number
  canRecall: boolean
}

const Action = ({ alertId, canRecall }: Props): JSX.Element => {
  const dispatch = useDispatch()
  const darkMode = useSelector((state: any) => state.settings.darkMode)

  const handleRecall = () => {
    batch(() => {
      dispatch(setRecallModalOpen({ alertId }))
    })
  }
  return (
    <div>
      {canRecall && (
        <MoreOptionMenu
          darkMode={darkMode}
          menuItems={[
            {
              label: 'Recall to SOC',
              onClick: () => handleRecall(),
            },
          ]}
        />
      )}
    </div>
  )
}

export default Action
