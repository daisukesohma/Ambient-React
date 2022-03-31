import React from 'react'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/react-hooks'
import get from 'lodash/get'
import { useTheme } from '@material-ui/core/styles'

import { getZoomTS, tsAtMidnight } from '../../../../utils'

import { GET_ALERT_EVENTS_PAGINATED } from './gql'
import AlertMarker from './AlertMarker'

// getting limit of 200, as this should be enough for a full-days worth of events.
// However,  there is a pagination under data.alertEventsPaginated.alertEvents.pages
//
const DEFAULT_LIMIT = 200

const AlertMarkerContainer = ({
  accountSlug,
  endTs,
  handleToggleAlert,
  handleToggleHoverAlert,
  siteSlugs,
  startTs,
  streamIds,
  subtractDays,
  zoomLevel,
  customAlert,
}) => {
  const { palette } = useTheme()
  const { data } = useQuery(GET_ALERT_EVENTS_PAGINATED, {
    variables: {
      accountSlug,
      endTs,
      limit: DEFAULT_LIMIT,
      page: 1,
      siteSlugs,
      startTs,
      status: 'raised',
      streamIds,
    },
  })

  return (
    <>
      {get(data, 'alertEventsPaginated') &&
        data.alertEventsPaginated.alertEvents.map(alert => {
          const ts = alert.tsIdentifier / 1000
          const xTs = ts - tsAtMidnight(subtractDays)
          const x = getZoomTS(xTs, zoomLevel)

          return (
            <AlertMarker
              key={`alertMarker-${alert.id}`}
              onClick={() => {
                setTimeout(() => {
                  handleToggleAlert(alert, x)
                }, 100)
              }}
              onMouseOver={() => {
                setTimeout(() => {
                  handleToggleHoverAlert(alert, x)
                }, 100)
              }}
              onMouseLeave={() => {
                handleToggleHoverAlert(null, x)
              }}
              x={x}
              ts={ts}
              gifUrl={alert.clip}
              color={
                customAlert && customAlert.id === alert.id
                  ? palette.warning.main
                  : palette.error.main
              }
            />
          )
        })}
    </>
  )
}

AlertMarkerContainer.defaultProps = {
  accountSlug: '',
  endTs: 0,
  handleToggleAlert: () => {},
  handleToggleHoverAlert: () => {},
  siteSlugs: [],
  startTs: 0,
  streamIds: [],
  subtractDays: 0,
  zoomLevel: 5,
  cusomAlert: {
    id: -1,
  },
}

AlertMarkerContainer.propTypes = {
  accountSlug: PropTypes.string,
  endTs: PropTypes.number,
  handleToggleAlert: PropTypes.func,
  handleToggleHoverAlert: PropTypes.func,
  siteSlugs: PropTypes.array,
  startTs: PropTypes.number,
  streamIds: PropTypes.array,
  subtractDays: PropTypes.number,
  zoomLevel: PropTypes.number,
  customAlert: {
    id: PropTypes.number,
  },
}

export default AlertMarkerContainer
