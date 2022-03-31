import moment from 'moment'

const getXDomain = (
  // if controlled, use programmatic startTime and endTime
  controlled,
  startTime,
  endTime,
  // else calculate based on playtime and duration
  playTime,
  timelineDuration,
) => {
  if (controlled) {
    if (startTime && endTime) {
      return [startTime, endTime]
    }
  }

  if (!controlled) {
    if (playTime && timelineDuration) {
      return [
        moment(playTime)
          .subtract(timelineDuration / 2)
          .toDate(),
        moment(playTime)
          .add(timelineDuration / 2)
          .toDate(),
      ]
    }
  }

  // default
  return [new Date(), new Date()]
}

const currentPlayTimeController = (
  controlled,
  startTime,
  endTime,
  playTime,
  timelineDuration,
) => {
  if (controlled) {
    if (startTime && endTime) {
      // current
      return midpointTimeMoment(startTime, endTime) // this returns moment now
    }
  }

  if (!controlled) {
    if (playTime && timelineDuration) {
      return playTime
    }
  }

  return new Date()
}

const displayHoverTime = (percentageX, timelineRange) => {
  if (timelineRange) {
    const duration = moment(timelineRange[1]).subtract(moment(timelineRange[0]))
    return moment(timelineRange[0]).add(percentageX * duration)
  }
  return null
}

const convertDragToTimeDeltaMs = (percentageX, timelineRange) => {
  if (timelineRange) {
    const duration = moment.duration(
      moment(timelineRange[1]).diff(moment(timelineRange[0])),
    )
    return duration.asMilliseconds() * percentageX
  }
  return null
}

const durationTime = (start, end) =>
  moment.duration(moment(end).subtract(moment(start)))

const midpointTimeMoment = (start, end) => {
  const duration = durationTime(start, end)
  return moment(start).add(duration / 2)
}

// Based on a time, range and width (domain in scale terms), calculate the X value of time within a range

const queryEntityWithRange = (entityQueryArray, range, getMetadata) => {
  if (range && range[0] && range[1]) {
    const startQueryAt = moment(range[0]).unix()
    const endQueryAt = moment(range[1]).unix()
    getMetadata(entityQueryArray, startQueryAt, endQueryAt)
  }
}

export {
  convertDragToTimeDeltaMs,
  currentPlayTimeController,
  displayHoverTime,
  durationTime,
  midpointTimeMoment,
  getXDomain,
  queryEntityWithRange,
}
