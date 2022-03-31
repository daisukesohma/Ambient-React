import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { useMutation } from '@apollo/react-hooks'
import Box from '@material-ui/core/Box'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionActions'
import get from 'lodash/get'
// src
import { DISPATCH_INTERNAL } from 'components/NewsFeed/saga/gql'
import { createNotification } from 'redux/slices/notifications'

import AlertDetails from './components/AlertDetails'
import AlertHeader from './components/AlertHeader'
import useStyles from './styles'

const propTypes = {
  activityVersion: PropTypes.bool,
  alertEvent: PropTypes.object,
  index: PropTypes.number,
  initialExpanded: PropTypes.bool,
  operatorPage: PropTypes.bool,
}

const defaultProps = {
  activityVersion: false,
  alertEvent: null,
  index: 0,
  initialExpanded: false,
  operatorPage: false,
}

const AlertEventCard = ({
  activityVersion,
  alertEvent,
  index,
  initialExpanded,
  operatorPage,
}) => {
  const dispatch = useDispatch()
  const darkMode = useSelector(state => state.settings.darkMode)
  const [hovered, setHover] = useState(false)
  const [expanded, setExpanded] = useState(initialExpanded)
  const classes = useStyles({ darkMode, hovered })

  const [dispatchInternalRequest, { loading: isDispatchLoading }] = useMutation(
    DISPATCH_INTERNAL,
    {
      onCompleted({ dispatchInternal }) {
        dispatch(
          createNotification({ message: get(dispatchInternal, 'message') }),
        )
      },
    },
  )

  const toggleCardDetails = () => {
    // trackEventToMixpanel(
    //   expanded
    //     ? MixPanelEventEnum.NEWSFEED_ACTIVITIES_COLLAPSE
    //     : MixPanelEventEnum.NEWSFEED_ACTIVITIES_EXPAND,
    // )
    setExpanded(!expanded)
  }

  return (
    <Box
      id='alert-event-card'
      className={classes.root}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      key={`alertEventCardRoot-${alertEvent.eventHash}`}
    >
      <Accordion
        square
        expanded={expanded}
        onChange={toggleCardDetails}
        classes={{ root: classes.panelRoot }}
      >
        <AccordionSummary
          classes={{
            root: classes.panelSummaryRoot,
            content: classes.panelSummaryContent,
          }}
        >
          <AlertHeader
            alertEvent={alertEvent}
            hovered={hovered}
            isDispatchLoading={isDispatchLoading}
            operatorPage={operatorPage}
            index={index}
          />
        </AccordionSummary>

        <AccordionDetails classes={{ root: classes.panelDetailsRoot }}>
          <AlertDetails
            alertEvent={alertEvent}
            activityVersion={activityVersion}
            handleDispatch={dispatchInternalRequest}
            isDispatchLoading={isDispatchLoading}
            expanded={expanded}
          />
        </AccordionDetails>
      </Accordion>
    </Box>
  )
}

AlertEventCard.propTypes = propTypes
AlertEventCard.defaultProps = defaultProps

export default AlertEventCard
