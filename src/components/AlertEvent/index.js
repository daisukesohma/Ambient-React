/*
 * author: rodaan@ambient.ai
 * The AlertEvent used in investigations and ActivityDashboard
 * Uses ApolloClient Provider to access GraphQL
 * Meant to be independent so it doesn't rely on other components for things to work
 * If alertEventData is passed, alertEvent component will skip the query
 */
import React, { useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Chip from '@material-ui/core/Chip'
import VideocamOffIcon from '@material-ui/icons/VideocamOff'
import { Carousel } from 'react-responsive-carousel'
import { CircularProgressPanel, ErrorPanel, AlertLevelLabel } from 'ambient_ui'
import { get, toLower } from 'lodash'
import clsx from 'clsx'
// src
import EvidenceGif from 'components/EvidenceGif'
import Tooltip from 'components/Tooltip'
import {
  formatUnixTimeWithTZ,
  DEFAULT_TIMEZONE,
} from 'utils/dateTime/formatTimeWithTZ'

import { GET_ALERT_EVENT } from './gql'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
// Want to remove the need for this
import ActionToolbar from './ActionToolbar'
import useStyles from './styles'
import './index.css'
import { msToUnix } from 'utils'
import { SeverityToReadableTextEnum } from '../../enums'

const propTypes = {
  accountSlug: PropTypes.string,
  id: PropTypes.number,
  handleResolveAlert: PropTypes.func,
  showControls: PropTypes.bool,
  showDetails: PropTypes.bool,
  showBadge: PropTypes.bool,
  alertEventData: PropTypes.object,
  handleBookmark: PropTypes.func,
  isBookmarkShown: PropTypes.bool,
  darkMode: PropTypes.bool,
}

const defaultProps = {
  accountSlug: '',
  id: 1,
  showControls: false,
  showDetails: false,
  showBadge: false,
  alertEventData: null,
  isBookmarkShown: false,
  darkMode: false,
  handleBookmark: () => {},
}

function AlertEvent({
  accountSlug,
  alertEventData,
  handleResolveAlert,
  handleBookmark,
  id,
  isBookmarkShown,
  showControls,
  showDetails,
  darkMode,
  showBadge,
}) {
  const { palette } = useTheme()
  const classes = useStyles({ darkMode })

  const statusToBGColor = {
    RAISED: palette.error.main,
    RESOLVED: palette.primary.main,
  }

  const [selectedItem, setSelectedItem] = useState(0)

  function severity(alert) {
    const severity = get(alert, 'severity', '')
    return SeverityToReadableTextEnum[toLower(severity)]
  }

  function generateSlides(alertInstances, selected) {
    return (
      alertInstances &&
      alertInstances.map((alertInstance, i) => {
        const {
          id,
          alert_hash,
          alertHash,
          eventHash,
          clip,
          tsIdentifier,
          ts_identifier,
          tsCreated,
        } = alertInstance
        const display =
          i < 50 ? (
            <EvidenceGif
              id={id}
              alert_hash={alert_hash}
              alertHash={alertHash}
              eventHash={eventHash}
              clip={clip}
              tsIdentifier={tsIdentifier}
              ts_identifier={ts_identifier}
              tsCreated={tsCreated}
              uniqueKey={`evidence-gif-${alertInstance.id}_${i}`}
              selected={selected === i}
            />
          ) : (
            'More of the same'
          )
        return (
          <div
            id={`alert_instance_${alertInstance.id}`}
            key={`generated-slide-${alertInstance.id}-${i}`}
            style={{ height: '100%' }}
          >
            {display}
          </div>
        )
      })
    )
  }

  const skip = !!alertEventData

  const { loading, error, data } = useQuery(GET_ALERT_EVENT, {
    variables: {
      accountSlug,
      id,
    },
    skip,
  })

  if (loading) {
    return <CircularProgressPanel />
  }

  if (error) {
    return <ErrorPanel />
  }

  let alertInstances = []
  let alertEvent = {}
  let alertId = id
  if (alertEventData) {
    alertEvent = alertEventData
  } else if (data && data.alertEvent) {
    alertEvent = data.alertEvent
  }
  alertId = alertEvent.id
  const { name } = alertEvent.alert
  const site = alertEvent.alert.site.name
  const timezone = get(alertEvent, 'alert.site.timezone', DEFAULT_TIMEZONE)
  const { stream } = alertEvent
  const streamName = get(stream, 'name', null)
  const deviceId = get(alertEvent, 'accessReader.deviceId', null)
  alertInstances = alertEvent.alertInstances
  const alertEventTs = msToUnix(
    alertInstances.length > 0
      ? alertInstances[0].tsIdentifier
      : alertEvent.tsIdentifier,
  )

  const handleChangeAlertInstance = selected => {
    setSelectedItem(selected)
  }

  const bgColor = statusToBGColor[alertEvent.status] || palette.error.main
  const slides = generateSlides(alertInstances, selectedItem)

  return (
    <div
      key={`alert-event-${alertId}`}
      className={classes.root}
      style={{ border: `1px solid ${bgColor}` }}
    >
      <div className='topBar'>
        <Grid
          container
          direction='row'
          justify='flex-start'
          alignItems='center'
        >
          {showBadge && (
            <Box mt={1} ml={1}>
              <Chip
                size='small'
                label='Alert Event'
                style={{ backgroundColor: bgColor, borderRadius: 4 }}
              />
            </Box>
          )}

          {get(alertEventData, 'severity', false) && (
            <Box mt={1} ml={1}>
              <AlertLevelLabel
                level={severity(alertEventData)}
                label={severity(alertEventData)}
              />
            </Box>
          )}
        </Grid>

        {showDetails && (
          <div className={classes.titleContainer}>
            <div>
              <Tooltip content={name}>
                <Typography variant='body1' className={classes.title}>
                  {name}
                </Typography>
              </Tooltip>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              {deviceId && (
                <Typography
                  variant='subtitle2'
                  className={clsx(classes.subTitle, classes.textTruncate)}
                >
                  {deviceId}
                </Typography>
              )}
              {streamName && (
                <Typography
                  variant='subtitle2'
                  className={clsx(classes.subTitle, classes.textTruncate)}
                >
                  {streamName}
                </Typography>
              )}
              {!stream && (
                <Typography
                  variant='subtitle2'
                  className={clsx(classes.subTitle, classes.textTruncate)}
                >
                  &nbsp;
                </Typography>
              )}
            </div>
            <div className={classes.rowContainer}>
              <div
                className={clsx(
                  classes.halfWidthContainer,
                  classes.textTruncate,
                )}
              >
                <Typography
                  variant='subtitle2'
                  className={clsx(classes.subTitle, classes.textTruncate)}
                >
                  {site}
                </Typography>
              </div>
              <div className={clsx(classes.halfWidthContainer, classes.rowEnd)}>
                <Typography variant='subtitle2' className={classes.subTitle}>
                  <Box display='flex' flexDirection='column'>
                    <Box>
                      {formatUnixTimeWithTZ(
                        alertEventTs,
                        'yyyy-MM-dd',
                        timezone,
                      )}
                    </Box>
                    <Box>
                      {formatUnixTimeWithTZ(
                        alertEventTs,
                        'HH:mm:ss zzz',
                        timezone,
                      )}
                    </Box>
                  </Box>
                </Typography>
              </div>
            </div>
          </div>
        )}
      </div>
      {stream && (
        <div style={{ flex: 1, minHeight: 200 }}>
          <div className={classes.carouselWrapper}>
            <Carousel
              showThumbs={false}
              showIndicators={false}
              key={`alert-event-carousel-${alertId}`}
              onChange={handleChangeAlertInstance}
              selectedItem={selectedItem}
            >
              {slides}
            </Carousel>
          </div>
        </div>
      )}
      {!stream && (
        <div className={classes.iconContainer}>
          <VideocamOffIcon classes={{ root: classes.videoIcon }} />
        </div>
      )}
      {showControls && (
        <ActionToolbar
          handleResolveAlert={handleResolveAlert}
          alertEvent={alertEvent}
          isBookmarkShown={isBookmarkShown}
          handleBookmark={handleBookmark}
          darkMode={darkMode}
        />
      )}
    </div>
  )
}

AlertEvent.propTypes = propTypes
AlertEvent.defaultProps = defaultProps

export default AlertEvent
