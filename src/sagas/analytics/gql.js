import gql from 'graphql-tag'

export const ANALYTICS_DASHBOARDS_FOR_ACCOUNT = gql`
  query($accountSlug: String!) {
    analyticsDashboardsForAccount(accountSlug: $accountSlug) {
      id
      name
      description
      metrics {
        id
        name
        description
        metricType
        chartType
        site {
          name
          timezone
        }
        breakdowns {
          breakdown
          label
        }
        streams {
          id
          name
          region {
            name
          }
        }
        maxTimeRange
        threshold
        condition
        alert {
          id
          name
          severity
          status
        }
        includeZones {
          id
          name
        }
        excludeZones {
          id
          name
        }
      }
    }
  }
`

export const ANALYTICS_METRIC_DATA = gql`
  query AnalyticsMetricData(
    $metricId: Int!
    $startTs: Int!
    $endTs: Int!
    $breakdown: Int
    $compareOffset: Int
    $streamIds: [Int]
    $mock: Boolean
    $dows: [Int]
    $hods: [Int]
  ) {
    analyticsMetricData(
      metricId: $metricId
      startTs: $startTs
      endTs: $endTs
      breakdown: $breakdown
      compareOffset: $compareOffset
      streamIds: $streamIds
      mock: $mock
      dows: $dows
      hods: $hods
    ) {
      name
      type
      xAxis {
        fmt
        name
        values
      }
      yAxes {
        fmt
        name
        values
        compare
        key
        offset
      }
      tsMin
      tsMax
    }
  }
`

export const ANALYTICS_METRIC_TYPES = gql`
  query AnalyticsMetricTypes {
    analyticsMetricTypes {
      key
      name
      chartTypes {
        key
        name
      }
    }
  }
`

export const ANALYTICS_CONDITION_TYPES = gql`
  query AnalyticsConditionTypes {
    analyticsConditionTypes {
      key
      name
    }
  }
`

export const CREATE_ANALYTICS_METRIC = gql`
  mutation CreateAnalyticsMetric(
    $dashboardId: Int!
    $siteId: Int!
    $metricType: String!
    $chartType: String!
    $name: String!
    $streamIds: [Int]!
    $description: String
    $query: String!
    $includeZones: [Int]
    $excludeZones: [Int]
  ) {
    createAnalyticsMetric(
      dashboardId: $dashboardId
      siteId: $siteId
      metricType: $metricType
      chartType: $chartType
      name: $name
      description: $description
      streamIds: $streamIds
      query: $query
      includeZones: $includeZones
      excludeZones: $excludeZones
    ) {
      metric {
        id
        name
        description
        site {
          name
          timezone
        }
        breakdowns {
          breakdown
          label
        }
        streams {
          id
          name
        }
        includeZones {
          id
          name
        }
        excludeZones {
          id
          name
        }
      }
      ok
      message
    }
  }
`

export const GET_ENTITIES = gql`
  query GetEntities($allowSearch: Boolean) {
    getEntities(allowSearch: $allowSearch) {
      id
      name
    }
  }
`

export const GET_THREAT_SIGNATURES = gql`
  query GetThreatSignatures($allowAnalytics: Boolean) {
    allThreatSignatures(allowAnalytics: $allowAnalytics) {
      id
      name
    }
  }
`

export const GET_ZONES = gql`
  query GetZones {
    getZones {
      id
      name
    }
  }
`

export const CREATE_ANALYTICS_CONDITION = gql`
  mutation CreateAnalyticsCondition(
    $metricId: Int!
    $threshold: Int!
    $condition: String!
    $raiseAlert: Boolean
    $alertName: String
    $alertSeverity: String
    $alertIsTest: Boolean
  ) {
    createAnalyticsCondition(
      metricId: $metricId
      threshold: $threshold
      condition: $condition
      raiseAlert: $raiseAlert
      alertName: $alertName
      alertSeverity: $alertSeverity
      alertIsTest: $alertIsTest
    ) {
      ok
      metric {
        id
        threshold
        condition
        alert {
          id
          name
          status
          severity
        }
      }
    }
  }
`

export const DELETE_ANALYTICS_CONDITION = gql`
  mutation DeleteAnalyticsCondition($metricId: Int!) {
    deleteAnalyticsCondition(metricId: $metricId) {
      ok
      metric {
        id
      }
    }
  }
`

export const DELETE_ANALYTICS_ALERT = gql`
  mutation DeleteAnalyticsAlert($metricId: Int!) {
    deleteAnalyticsAlert(metricId: $metricId) {
      ok
    }
  }
`

export const DELETE_ANALYTICS_METRIC = gql`
  mutation DeleteAnalyticsMetric($id: Int!) {
    deleteAnalyticsMetric(id: $id) {
      ok
      message
    }
  }
`
export const GET_SITES_BY_ACCOUNT = gql`
  query($accountSlug: String!) {
    allSitesByAccount(accountSlug: $accountSlug) {
      id
      name
      timezone
      streams {
        id
        name
      }
    }
  }
`

export const CREATE_ANALYTICS_DASHBOARD = gql`
  mutation CreateAnalyticsDashboard(
    $accountSlug: String!
    $name: String!
    $description: String
  ) {
    createAnalyticsDashboard(
      accountSlug: $accountSlug
      name: $name
      description: $description
    ) {
      ok
      message
      dashboard {
        id
        name
        description
        metrics {
          id
          name
          description
          metricType
          chartType
          site {
            name
            timezone
          }
          breakdowns {
            breakdown
            label
          }
          maxTimeRange
        }
      }
    }
  }
`

export const DELETE_ANALYTICS_DASHBOARD = gql`
  mutation DeleteAnalyticsDashboard($id: Int!) {
    deleteAnalyticsDashboard(id: $id) {
      ok
      message
    }
  }
`

export const ARRANGE_ANALYTICS_DASHBOARD = gql`
  mutation ArrangeAnalyticsDashboard($id: Int!, $order: [Int]!) {
    arrangeAnalyticsDashboard(id: $id, order: $order) {
      ok
      message
    }
  }
`
