import moment from 'moment'

const getEnrichedSparseData = (timeRange, metadata = {}) => {
  const enriched = {}
  const entities = Object.keys(metadata)

  entities.forEach(entity => {
    enriched[entity] = enrichEntity(entity, timeRange, metadata[entity])
  })

  return enriched
}

const enrichEntity = (entity, timeRange, points) => {
  const enrichedEntity = [] // initialize array of objs

  // Loop thru each entity object
  // each obj is {date, value}
  points.forEach((obj, index) => {
    const currentMTime = moment(obj.date)
    const prevUnixTs = currentMTime.subtract(10, 'seconds').unix()
    const nextUnixTs = currentMTime.add(10, 'seconds').unix()
    const prevObjUnixTs = points[index - 1]
      ? moment(points[index - 1].date).unix()
      : 'prevObjUnixTs'
    const nextObjUnixTs = points[index + 1]
      ? moment(points[index + 1].date).unix()
      : 'nextObjUnixTs'
    const nextObjUnixTsMinusTen = nextObjUnixTs
      ? moment
          .unix(nextObjUnixTs)
          .subtract(10, 'seconds')
          .unix()
      : 'nextObjUnixTsMinusTen'

    // push in order (alt. push to end, then sort at the end.)

    // Algorithm:
    // 1) If First ES metadata point
    if (index === 0) {
      // if start of timeline is before first metadata point, put a zero value (this ensures line
      // draws from beginning of timeline to the end)
      if (timeRange[0] < obj.date) {
        enrichedEntity.push({
          date: moment(timeRange[0]).toDate(),
          value: 0,
          which: 'timelineStart', // 'which' data is solely for debugging purposes
        })
        enrichedEntity.push({
          date: moment(obj.date)
            .subtract(1, 'seconds')
            .toDate(),
          value: 0,
          which: 'firstBefore', // 'which' data is solely for debugging purposes
        })
      }

      enrichedEntity.push({
        date: moment(obj.date).toDate(),
        value: Number(obj.value),
        which: 'first',
      })

      if (nextUnixTs !== nextObjUnixTsMinusTen) {
        // =P confused
        enrichedEntity.push({
          date: moment.unix(nextUnixTs).toDate(),
          value: 0,
          which: 'firstNext',
        })
      }
    }

    // all data points in the middle
    if (index !== 0 && index !== points.length - 1) {
      if (prevUnixTs !== prevObjUnixTs) {
        enrichedEntity.push({
          date: moment(obj.date)
            .subtract(1, 'seconds')
            .toDate(),
          value: 0,
          which: 'prev',
        })
      }

      // Push current value
      enrichedEntity.push({
        date: new Date(obj.date),
        value: Number(obj.value),
        which: 'current',
      })

      if (
        nextUnixTs !== nextObjUnixTs &&
        moment
          .unix(nextUnixTs)
          .add(10, 'seconds')
          .unix() !== nextObjUnixTs // =P confused
      ) {
        // draw the line the length of 10 seconds (9.99)
        enrichedEntity.push({
          date: moment(obj.date)
            .add(9.99, 'seconds')
            .toDate(),
          value: Number(obj.value),
          which: 'currentLength',
        })

        enrichedEntity.push({
          date: moment
            .unix(nextUnixTs)
            .add(10, 'seconds')
            .toDate(),
          value: 0,
          which: 'next',
        })
      }
    }

    // For last Metadata item
    if (index === points.length - 1) {
      if (prevUnixTs !== prevObjUnixTs) {
        enrichedEntity.push({
          date: moment(points[points.length - 1].date)
            .subtract(1, 'seconds')
            .toDate(),
          value: 0,
          which: 'lastBefore', // 'which' data is solely for debugging purposes
        })
      }

      enrichedEntity.push({
        date: moment(points[points.length - 1].date).toDate(),
        value: Number(points[points.length - 1].value),
        which: 'last',
      })

      enrichedEntity.push({
        date: moment
          .unix(nextUnixTs)
          .add(9.99, 'seconds')
          .toDate(),
        value: Number(points[points.length - 1].value),
        which: 'lastAfter',
      })

      enrichedEntity.push({
        date: moment
          .unix(nextUnixTs)
          .add(10, 'seconds')
          .toDate(),
        value: 0,
        which: 'lastAfterZero',
      })

      if (timeRange[1] > obj.date) {
        let endTimeline = timeRange[1]
        if (new Date() < timeRange[1]) {
          endTimeline = new Date()
        }
        if (
          moment
            .unix(nextUnixTs)
            .add(10, 'seconds')
            .toDate() < endTimeline
        ) {
          enrichedEntity.push({
            date: moment(endTimeline)
              .subtract(0.01, 'seconds')
              .toDate(),
            value: 0,
            which: 'timelineEndBefore', // 'which' data is solely for debugging purposes
          })
          enrichedEntity.push({
            date: endTimeline,
            value: 0,
            which: 'timelineEnd', // 'which' data is solely for debugging purposes
          })
        }
      }
    }
  })

  // set { car: [...] }
  return enrichedEntity
}

export default getEnrichedSparseData
