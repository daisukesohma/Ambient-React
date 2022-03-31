import React, { useState, useEffect } from 'react'
import { Grid } from '@material-ui/core'
import { useMutation } from '@apollo/react-hooks'
import { useSelector, useDispatch } from 'react-redux'
import { get, filter, map } from 'lodash'
import { showModal, hideModal } from 'redux/slices/modal'
import AlertEvent from 'components/organisms/AlertEventCard'
import { ModalTypeEnum } from 'enums'
import { BOOKMARK_ALERT } from 'pages/HistoryV3/saga/gql'
import { AlertHistorySliceProps } from 'pages/HistoryV3/alertHistorySlice'

import useStyles from './styles'

export default function AlertsGrid(): JSX.Element {
  const dispatch = useDispatch()
  const confirmed = useSelector(state => get(state, 'modal.data.confirmed'))
  const alertEvents = useSelector(
    (state: AlertHistorySliceProps) => state.alertHistoryV3.alertEvents,
  )

  const [computedAlertEvents, setComputedAlertEvents] = useState<any[] | []>(
    alertEvents,
  )
  const [alertToUnbookmark, setAlertToUnbookmark] = useState(null)
  const classes = useStyles()

  const [bookmarkAlertRequest] = useMutation(BOOKMARK_ALERT)

  const bookmarkRequest = async (alert: any) => {
    const { id, eventHash, bookmarked } = alert
    await bookmarkAlertRequest({
      variables: {
        bookmark: !bookmarked,
        alertEventHash: eventHash,
        alertEventId: id,
      },
    })
    if (bookmarked) {
      setComputedAlertEvents(
        filter(computedAlertEvents, item => item.id !== id),
      )
    } else {
      setComputedAlertEvents(
        map(computedAlertEvents, item => {
          if (item.id !== id) return item
          return {
            ...item,
            bookmarked: !bookmarked,
          }
        }),
      )
    }
  }

  // eslint-disable-next-line no-unused-vars
  const handleBookmark = (alert: any) => {
    if (!alert.bookmarked) {
      bookmarkRequest(alert)
      return
    }
    setAlertToUnbookmark(alert)
    dispatch(
      showModal({
        type: ModalTypeEnum.CONFIRM,
        content: {
          // eslint-disable-next-line react/display-name
          html: () => (
            <div>
              Are you sure you want to{' '}
              <span className={classes.highlight}>
                remove this alert from Spotlight
              </span>
              ? This does not affect the alert in any other way.
            </div>
          ),
        },
      }),
    )
  }

  useEffect(() => {
    if (confirmed) {
      bookmarkRequest(alertToUnbookmark)
      dispatch(hideModal())
    }
    // eslint-disable-next-line
  }, [confirmed])

  useEffect(() => {
    if (alertEvents) {
      setComputedAlertEvents(alertEvents)
    }
    // eslint-disable-next-line
  }, [alertEvents])

  return (
    <Grid className={classes.root} container spacing={2}>
      {map(computedAlertEvents, alertEvent => {
        return (
          <Grid item xs={12} sm={12} md={6} lg={4} xl={3} key={alertEvent.id}>
            <AlertEvent alertEvent={alertEvent} />
          </Grid>
        )
      })}
    </Grid>
  )
}
