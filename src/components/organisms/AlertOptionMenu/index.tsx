import React from 'react'
import Icon from 'react-icons-kit'
import { useDispatch, useSelector } from 'react-redux'
import { ic_more_vert as icMoreVertical } from 'react-icons-kit/md/ic_more_vert'
// src
import OptionMenuV2 from 'components/molecules/OptionMenuV2'
import { openModal as openSubmitModal } from 'components/organisms/SubmitAlertModal/redux/submitAlertModalSlice'
import Tooltip from 'components/Tooltip'
import { AuthSliceProps } from 'redux/slices/auth'

import useStyles from './styles'

interface Props {
  darkMode: boolean
  lightIcon: boolean
  siteSlug: string | null
  threatSignatureId: number | null
  threatSignatureName: string | null
  streamId: number | null
  streamName: string | null
  alertId: number | null
}

export default function AlertOptionMenu({
  darkMode,
  lightIcon,
  siteSlug,
  threatSignatureId,
  threatSignatureName,
  streamId,
  streamName,
  alertId,
}: Props): JSX.Element {
  const classes = useStyles({ darkMode, lightIcon })
  const dispatch = useDispatch()
  const profileId = useSelector(
    (state: AuthSliceProps) => state.auth.profile.id,
  )
  const icon = (
    <div className={classes.iconContainer}>
      <Icon icon={icMoreVertical} size={20} />
    </div>
  )

  const openSubmitAlertModal = () => {
    dispatch(
      openSubmitModal({
        alertId,
        streamId,
        profileId,
        siteSlug,
        threatSignatureId,
        threatSignatureName,
        streamName,
      }),
    )
  }

  const menuItems = [
    {
      label: 'Submit alert feedback',
      onClick: openSubmitAlertModal,
    },
  ]

  return (
    <div className={classes.root}>
      <Tooltip
        content='More Options'
        animation='scale-subtle'
        arrow={false}
        duration={[100, 200]}
        placement='top'
        theme='ambient'
        visible={undefined}
        innerSpanStyles={null}
      >
        <OptionMenuV2
          darkMode={darkMode}
          icon={icon}
          noBackground={false}
          menuItems={menuItems}
        />
      </Tooltip>
    </div>
  )
}
