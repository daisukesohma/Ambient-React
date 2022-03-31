/* eslint-disable @typescript-eslint/naming-convention */
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useTheme } from '@material-ui/core/styles'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Grid,
  Box,
} from '@material-ui/core'
import { get, map, capitalize } from 'lodash'
import VideocamOffIcon from '@material-ui/icons/VideocamOff'
import LinkIcon from '@material-ui/icons/Link'
import AlertsSeverity from 'pages/HistoryV3/components/AlertsSeverity'
import AlertsMenu from 'pages/HistoryV3/components/AlertsMenu'
import AlertStatusChip from 'pages/HistoryV3/components/AlertsStatuses/V2/AlertStatusChip'
import { resolveAlertRequested } from 'pages/History/alertHistorySlice'
import EvidenceGif from 'components/EvidenceGif'
import { msToUnix } from 'utils'
import {
  formatUnixTimeWithTZ,
  DEFAULT_TIMEZONE,
} from 'utils/dateTime/formatTimeWithTZ'

import useStyles from './styles'

interface Props {
  alertEvent: any,
}

export default function AlertEvent({
  alertEvent,
}: Props): JSX.Element {
  const { palette } = useTheme()
  const classes = useStyles()
  const dispatch = useDispatch()

  const [selectedItem, setSelectedItem] = useState(0)

  function generateSlides(alertInstances: any, selected: any) {
    return map(alertInstances, (alertInstance, i: number) => {
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
      return (
        <div
          id={`alert_instance_${alertInstance.id}`}
          key={`generated-slide-${alertInstance.id}-${i}`}
          style={{ height: '100%' }}
        >
          {
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
          }
        </div>
      )
    })
  }

  const { stream, alertInstances, severity } = alertEvent
  const alertId = alertEvent.id
  const site = alertEvent.alert.site.name
  const name = get(alertEvent, 'alert.name')
  const timezone = get(alertEvent, 'alert.site.timezone', DEFAULT_TIMEZONE)
  const streamName = get(stream, 'name', null)
  // const deviceId = get(alertEvent, 'accessReader.deviceId', null)
  const alertEventTs = msToUnix(
    alertInstances.length > 0
      ? alertInstances[0].tsIdentifier
      : alertEvent.tsIdentifier,
  )

  const handleChangeAlertInstance = (selected: any) => {
    setSelectedItem(selected)
  }

  const slides = generateSlides(alertInstances, selectedItem)

  const isAccepted = true
  const isResolved = false
  const isRequested = false
  // const isResolved = alertEvent.resolved
  // const isSpotlighted = alertEvent.bookmarked

  const onResolveAlert = () => dispatch(resolveAlertRequested({ alertEvent }))

  return (
    <Card className={classes.root}>
      <CardActionArea className={classes.cardActionArea}>
        <CardMedia classes={{ root: classes.cardMediaRoot }}>
          {stream && (
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
          )}
          {!stream && (
            <div className={classes.iconContainer}>
              <VideocamOffIcon classes={{ root: classes.videoIcon }} />
            </div>
          )}
        </CardMedia>
        <CardContent className={classes.cardContent}>
          <Grid container direction='column' spacing={1}>
            <Grid item>
              <Grid container alignItems='center'>
                <Box mr={1} display='inline-flex'>
                  <AlertsSeverity
                    severity={severity}
                  />
                </Box>
                <Typography variant='h5' component='h2'>
                  {capitalize(name)}
                </Typography>
              </Grid>
            </Grid>
            <Grid item>
              <Typography
                variant='subtitle1'
                color='textSecondary'
                component='p'
              >
                {`Location: ${streamName} @ ${site}`}
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                variant='subtitle1'
                color='textSecondary'
                component='p'
              >
                {'Date: '}
                {formatUnixTimeWithTZ(
                  alertEventTs,
                  'yyyy-MM-dd HH:mm:ss zzz',
                  timezone,
                )}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </CardActionArea>

      <CardActions className={classes.cardActions}>
        <Grid container justify='space-between' alignItems='center'>
          <Grid item>
            <Grid container alignItems='center'>
              {isResolved && <AlertStatusChip isResolved />}
              {isAccepted && (
                <AlertStatusChip isAccepted labelContent='by 2 responders' />
              )}
              {isRequested && (
                <AlertStatusChip isRequested labelContent='for Vikesh' />
              )}

              <IconButton size='small'>
                <LinkIcon htmlColor={palette.text.primary} fontSize='small' />
              </IconButton>
            </Grid>
          </Grid>

          <AlertsMenu onResolveAlert={onResolveAlert} />
        </Grid>
      </CardActions>
    </Card>
  )
}
