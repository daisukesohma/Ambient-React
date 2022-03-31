import React from 'react'
import get from 'lodash/get'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'
// src
import { Icon } from 'ambient_ui'
import AlertCard from 'components/Cards/variants/Video/AlertCard'
import { getElapsedTime } from 'utils'

ActivityCard.propTypes = {
  activity: PropTypes.any, // author should decide
  handleResolveAlert: PropTypes.any, // author should decide
}

export default function ActivityCard({ activity, handleResolveAlert }) {
  const { palette } = useTheme()
  const isResolved = get(activity, 'resolved')

  return (
    <AlertCard
      title={get(activity, 'alert.name')}
      description={get(activity, 'stream.name')}
      headerBottomRight={
        isResolved ? (
          <Icon icon='checkCircle' color={palette.primary.main} />
        ) : null
      }
      footerName={get(activity, 'alert.site.name')}
      footerTime={getElapsedTime(get(activity, 'tsCreated'))}
      actionOne={handleResolveAlert}
      actionOneTitle='Resolve'
      actionTwo={() => {}}
      actionTwoTitle='View Details'
    />
  )
}
