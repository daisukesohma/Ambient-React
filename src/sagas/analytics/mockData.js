import {
  AnalyticsMetricTypeEnum,
  AnalyticsChartTypeEnum,
  TimeRangeEnum,
} from '../../enums'

// Common variables
const SITE = { name: 'Palo Alto' }
const STREAMS = [
  { name: 'Entry Stairwell' },
  { name: 'Emergency Exit' },
  { name: 'Workspace' },
  { name: 'Lobby' },
  { name: 'Reception' },
  { name: 'Hallway' },
]

const BREAKDOWNS_FULL = [
  { breakdown: 60, label: 'minute' },
  { breakdown: 3600, label: 'hour' },
  { breakdown: 86400, label: 'day' },
  { breakdown: 604800, label: 'week' },
  { breakdown: 2592000, label: 'month' },
]

const BREAKDOWNS_LIMITED = [{ breakdown: 300, label: '5 minutes' }]

// Commonly used functions
const range = (start, stop, step = 1) => {
  const length = Math.ceil((stop - start) / step)
  return Array(length)
    .fill(start)
    .map((x, y) => x + y * step)
}

const jitterize = (value, first, last, jitter) => {
  const jitteredValue = jitter
    ? value + Math.random() * jitter * Math.abs(last - first)
    : value

  return jitteredValue.toFixed(2)
}

const sumToN = (n, count) => {
  if (count > n) {
    throw Error(`count=${count} must be <= n=${n}`)
  }
  if (count === 1) {
    return [n]
  }
  const value = random(0, n - count, 1)[0]
  return [value].concat(sumToN(n - value, count - 1))
}

const quadratic = (first, last, rate, length, jitter) => {
  // Fitting quadratic curve through data
  // Assumptions: ax^2 + bx + c
  // c = first
  // a = rate
  // Computing b
  // a(len)^2 + b(len) + c = last
  // a * len + b = (last - c) / len
  // b = (last - c) / len - a * len
  const len = length - 1
  const b = (last - first) / len - rate * len

  return Array(length)
    .fill(0)
    .map((x, index) => {
      const value = rate * index * index + b * index + first
      return jitterize(value, first, last, jitter)
    })
}

const linear = (first, last, length, jitter) => {
  // c = first
  // Computing slow
  // last = m * len + c
  // m = (last - c) / len
  const slope = (last - first) / (length - 1)
  return Array(length)
    .fill(0)
    .map((x, index) => jitterize(slope * index + first, first, last, jitter))
}

const random = (low, high, length) => {
  return Array(length)
    .fill(0)
    .map(x => parseInt(low + Math.random() * (high - low), 10))
}

const baseline = (value, max, length, prob) => {
  return Array(length)
    .fill(value)
    .map(x => x + (Math.random() < prob ? Math.random() * max : 0))
}

const getXAxis = (startTs, endTs, breakdown) => {
  return range(parseInt(startTs, 10), parseInt(endTs, 10), breakdown)
}

const tailgatingTimeBreakdown = {
  size: 6,
  name: 'Tailgating',
  includeZones: [],
  excludeZones: [],
  metricType: AnalyticsMetricTypeEnum.COUNTER,
  chartType: AnalyticsChartTypeEnum.TIME_BREAKDOWN,
  breakdowns: BREAKDOWNS_FULL,
  maxTimeRange: TimeRangeEnum.MONTH,
  streams: STREAMS,
  site: SITE,
  data: ({ startTs, endTs, breakdown, compareOffset }) => {
    const xAxis = getXAxis(startTs, endTs, breakdown)
    return {
      name: 'Counter by Time',
      type: 'column',
      xAxis: {
        fmt: 'timestamp',
        name: 'Time',
        values: xAxis,
      },
      yAxes: [
        {
          fmt: 'number',
          name: 'Count',
          key: 'counter',
          values: quadratic(30, 5, 1, xAxis.length, 0.1),
          compare: linear(60, 15, xAxis.length, 0.1),
          offset: compareOffset,
        },
      ],
    }
  },
}

const tailgatingHeatmap = {
  size: 6,
  name: 'Tailgating (Hotspots)',
  includeZones: [],
  excludeZones: [],
  metricType: AnalyticsMetricTypeEnum.COUNTER,
  chartType: AnalyticsChartTypeEnum.HEATMAP,
  breakdowns: BREAKDOWNS_FULL,
  maxTimeRange: TimeRangeEnum.MONTH,
  streams: STREAMS,
  site: SITE,
  data: ({ startTs, endTs, breakdown, compareOffset }) => {
    const xAxis = getXAxis(startTs, endTs, breakdown)
    return {
      name: 'Tailgating Heatmap',
      type: 'column',
      xAxis: {
        fmt: 'timestamp',
        name: 'Time',
        values: xAxis,
      },
      yAxes: STREAMS.map((stream, index) => {
        return {
          fmt: 'number',
          name: stream.name,
          key: index,
          values: random(0, 20, xAxis.length),
        }
      }),
    }
  },
}

const crowdingTimeBreakdown = {
  size: 6,
  name: 'Crowding',
  includeZones: [],
  excludeZones: [],
  metricType: AnalyticsMetricTypeEnum.COUNTER,
  chartType: AnalyticsChartTypeEnum.TIME_BREAKDOWN,
  breakdowns: BREAKDOWNS_FULL,
  maxTimeRange: TimeRangeEnum.MONTH,
  streams: STREAMS,
  site: SITE,
  data: ({ startTs, endTs, breakdown, compareOffset }) => {
    const xAxis = getXAxis(startTs, endTs, breakdown)
    return {
      name: 'Crowding',
      type: 'column',
      xAxis: {
        fmt: 'timestamp',
        name: 'Time',
        values: xAxis,
      },
      yAxes: [
        {
          fmt: 'number',
          name: 'Count',
          key: 'counter',
          values: quadratic(5, 30, 1, xAxis.length, 0.1),
          compare: linear(5, 15, xAxis.length, 0.1),
          offset: compareOffset,
        },
      ],
    }
  },
}

const crowdingHeatmap = {
  size: 6,
  name: 'Crowding (Hotspots)',
  includeZones: [],
  excludeZones: [],
  metricType: AnalyticsMetricTypeEnum.COUNTER,
  chartType: AnalyticsChartTypeEnum.HEATMAP,
  breakdowns: BREAKDOWNS_FULL,
  maxTimeRange: TimeRangeEnum.MONTH,
  streams: STREAMS,
  site: SITE,
  data: ({ startTs, endTs, breakdown, compareOffset }) => {
    const xAxis = getXAxis(startTs, endTs, breakdown)
    return {
      name: 'Crowding (Hotspots)',
      type: 'column',
      xAxis: {
        fmt: 'timestamp',
        name: 'Time',
        values: xAxis,
      },
      yAxes: STREAMS.map((stream, index) => {
        return {
          fmt: 'number',
          name: stream.name,
          key: index,
          values: random(0, 20, xAxis.length),
        }
      }),
    }
  },
}

const socialDistancing = {
  size: 6,
  name: 'Social Distancing',
  includeZones: [],
  excludeZones: [],
  metricType: AnalyticsMetricTypeEnum.COUNTER,
  chartType: AnalyticsChartTypeEnum.TIME_BREAKDOWN,
  breakdowns: BREAKDOWNS_FULL,
  defaultTimeRange: TimeRangeEnum.DAY,
  maxTimeRange: TimeRangeEnum.MONTH,
  streams: STREAMS,
  site: SITE,
  threshold: 80,
  data: ({ startTs, endTs, breakdown, compareOffset }) => {
    const xAxis = getXAxis(startTs, endTs, breakdown)
    return {
      name: 'Social Distance',
      type: 'column',
      xAxis: {
        fmt: 'timestamp',
        name: 'Time',
        values: xAxis,
      },
      yAxes: [
        {
          fmt: 'number',
          name: '% pairs of people > 6 ft. apart ',
          key: 'counter',
          values: baseline(100, -30, xAxis.length, 0.2),
          offset: compareOffset,
        },
      ],
    }
  },
}

const ppeCompliance = {
  size: 6,
  name: 'PPE Compliance',
  includeZones: [],
  excludeZones: [],
  metricType: AnalyticsMetricTypeEnum.COUNTER,
  chartType: AnalyticsChartTypeEnum.TIME_BREAKDOWN,
  breakdowns: BREAKDOWNS_FULL,
  defaultTimeRange: TimeRangeEnum.DAY,
  maxTimeRange: TimeRangeEnum.MONTH,
  streams: STREAMS,
  site: SITE,
  threshold: 80,
  data: ({ startTs, endTs, breakdown, compareOffset }) => {
    const xAxis = getXAxis(startTs, endTs, breakdown)
    return {
      name: 'PPE Compliance',
      type: 'column',
      xAxis: {
        fmt: 'timestamp',
        name: 'Time',
        values: xAxis,
      },
      yAxes: [
        {
          fmt: 'number',
          name: '% of people wearing protective gear',
          key: 'counter',
          values: baseline(100, -30, xAxis.length, 0.2),
          offset: compareOffset,
        },
      ],
    }
  },
}

const flowStreamBreakdown = {
  size: 12,
  name: 'Door Utilization',
  includeZones: [],
  excludeZones: [],
  metricType: AnalyticsMetricTypeEnum.FLOW,
  chartType: AnalyticsChartTypeEnum.STREAM_BREAKDOWN,
  breakdowns: BREAKDOWNS_FULL,
  maxTimeRange: TimeRangeEnum.MONTH,
  streams: STREAMS,
  site: SITE,
  data: ({ startTs, endTs, breakdown, compareOffset }) => {
    const xAxis = STREAMS.map(stream => stream.name)

    return {
      name: 'Door Utilization',
      type: 'column',
      xAxis: {
        fmt: 'timestamp',
        name: 'Time',
        values: xAxis,
      },
      yAxes: [
        {
          fmt: 'number',
          name: 'Enters',
          key: 'enters',
          values: linear(50, 20, xAxis.length, 0.2).map(o => parseInt(o, 10)),
          compare: linear(40, 30, xAxis.length, 0.2).map(o => parseInt(o, 10)),
        },
        {
          fmt: 'number',
          name: 'Exits',
          key: 'exits',
          values: linear(50, 20, xAxis.length, 0.2).map(o => parseInt(o, 10)),
          compare: linear(40, 30, xAxis.length, 0.2).map(o => parseInt(o, 10)),
        },
      ],
    }
  },
}

const occupancyTimeBreakdown = {
  size: 6,
  name: 'Occupancy (Live)',
  includeZones: [],
  excludeZones: [],
  metricType: AnalyticsMetricTypeEnum.OCCUPANCY,
  chartType: AnalyticsChartTypeEnum.TIME_BREAKDOWN,
  breakdowns: BREAKDOWNS_LIMITED,
  defaultTimeRange: TimeRangeEnum.HOUR,
  maxTimeRange: TimeRangeEnum.DAY,
  streams: STREAMS,
  site: SITE,
  threshold: 60,
  data: ({ startTs, endTs, breakdown, compareOffset }) => {
    const xAxis = getXAxis(startTs, endTs, breakdown)
    return {
      name: 'Occupancy',
      type: 'column',
      xAxis: {
        fmt: 'timestamp',
        name: 'Time',
        values: xAxis,
      },
      yAxes: [
        {
          fmt: 'number',
          name: '% capacity occupied',
          key: 'occupancy',
          values: baseline(40, 40, xAxis.length, 0.5),
          compare: baseline(60, 30, xAxis.length, 0.5),
          offset: compareOffset,
        },
        {
          fmt: 'number',
          name: 'Now',
          key: 'now',
          values: random(2, 10, 1),
        },
      ],
    }
  },
}

const occupancyHeatmap = {
  size: 6,
  name: 'Occupancy (Hotspots)',
  includeZones: [],
  excludeZones: [],
  metricType: AnalyticsMetricTypeEnum.OCCUPANCY,
  chartType: AnalyticsChartTypeEnum.HEATMAP,
  breakdowns: BREAKDOWNS_LIMITED,
  defaultTimeRange: TimeRangeEnum.HOUR,
  maxTimeRange: TimeRangeEnum.DAY,
  streams: STREAMS,
  site: SITE,
  data: ({ startTs, endTs, breakdown, compareOffset }) => {
    const xAxis = getXAxis(startTs, endTs, breakdown)
    return {
      name: 'Occupancy',
      type: 'column',
      xAxis: {
        fmt: 'timestamp',
        name: 'Time',
        values: xAxis,
      },
      yAxes: STREAMS.map((stream, index) => {
        return {
          fmt: 'number',
          name: stream.name,
          key: index,
          values: random(0, 20, xAxis.length),
        }
      }),
    }
  },
}

const metrics = [
  tailgatingTimeBreakdown,
  tailgatingHeatmap,
  crowdingTimeBreakdown,
  crowdingHeatmap,
  socialDistancing,
  ppeCompliance,
  flowStreamBreakdown,
  occupancyTimeBreakdown,
  occupancyHeatmap,
].map((metric, index) => {
  return {
    id: index,
    ...metric,
  }
})

const dashboards = [
  {
    id: 0,
    name: 'Spatial Intelligence',
    description: 'Spatial analytics for security, compliance and experience',
    metrics,
  },
  {
    id: 1,
    name: 'Workplace Analytics',
    description: 'Workplace statistics',
    metrics: [],
    concept: true,
  },
]

const mockData = {
  dashboards,
  metrics,
}

const funcs = {
  random,
  baseline,
  linear,
  quadratic,
  getXAxis,
  jitterize,
  sumToN,
}

export { mockData, funcs }
