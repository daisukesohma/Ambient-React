import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import { useMutation } from '@apollo/react-hooks'
import { useSelector, useDispatch } from 'react-redux'
import { get, filter, map } from 'lodash'
// src
import { showModal, hideModal } from 'redux/slices/modal'
import AlertEvent from 'components/AlertEvent'
import { ModalTypeEnum } from 'enums'
import { BOOKMARK_ALERT } from '../gql'

const useStyles = makeStyles(({ palette }) => ({
  root: {
    width: '100%',
    '& .slider': {
      height: '100%',
      opacity: 1,
    },
    '& .carousel': {
      height: '100%',
    },
  },
  wrapper: {
    width: 'calc(100% + 22px)',
  },
  highlight: {
    color: palette.error.main,
  },
}))

AlertEventsFeedGrid.propTypes = {
  accountSlug: PropTypes.string,
  alertEvents: PropTypes.array,
  handleResolveAlert: PropTypes.func,
}

AlertEventsFeedGrid.defaultProps = {
  accountSlug: '',
  alertEvents: [],
}

export default function AlertEventsFeedGrid({
  accountSlug,
  alertEvents,
  handleResolveAlert,
}) {
  const dispatch = useDispatch()
  const confirmed = useSelector(state => get(state, 'modal.data.confirmed'))
  const darkMode = useSelector(state => state.settings.darkMode)
  const tabIndex = useSelector(state => state.alertHistory.tabIndex)

  const [computedAlertEvents, setComputedAlertEvents] = useState(alertEvents)
  const [alertToUnbookmark, setAlertToUnbookmark] = useState(null)
  const classes = useStyles()

  const [bookmarkAlertRequest] = useMutation(BOOKMARK_ALERT)

  const handleBookmark = alert => {
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
            <div className={classes.alertMsg}>
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

  const bookmarkRequest = async alert => {
    const { id, eventHash, bookmarked } = alert
    await bookmarkAlertRequest({
      variables: {
        bookmark: !bookmarked,
        alertEventHash: eventHash,
        alertEventId: id,
      },
    })
    if (bookmarked && tabIndex === 0) {
      setComputedAlertEvents(
        filter(computedAlertEvents, item => item.id !== id),
      )
    } else {
      setComputedAlertEvents(
        map(computedAlertEvents, item => {
          if (item.id !== id) {
            return item
          }
          return {
            ...item,
            bookmarked: !bookmarked,
          }
        }),
      )
    }
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
    <div className={classes.root}>
      <Grid container spacing={3} className={classes.wrapper}>
        {map(computedAlertEvents, alertEvent => {
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={3} key={alertEvent.id}>
              <AlertEvent
                darkMode={darkMode}
                id={alertEvent.id}
                alertEventData={alertEvent}
                accountSlug={accountSlug}
                handleResolveAlert={handleResolveAlert}
                showControls
                showDetails
                isBookmarkShown
                handleBookmark={handleBookmark}
              />
            </Grid>
          )
        })}
      </Grid>
    </div>
  )
}
