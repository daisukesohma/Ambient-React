export const AlertType = Object.freeze({
  RESOLVED: 'resolved',
  RAISED: 'raised',
})

// export const TabType = Object.freeze({
//   ALERTS: 'alerts',
//   CASES: 'cases',
// })

// export const StatusOptions = Object.freeze({
//   alerts: [
//     {
//       label: 'Resolved',
//       value: 'resolved',
//     },
//     {
//       label: 'Raised',
//       value: 'raised',
//     },
//     {
//       label: 'Dispatched',
//       value: 'dispatched',
//     },
//   ],
//   cases: [
//     {
//       label: 'Open',
//       value: 'OPEN',
//     },
//     {
//       label: 'Closed',
//       value: 'CLOSED',
//     },
//   ],
// })

export const MOBILE_SELECT_OPTIONS = [
  {
    label: 'Spotlight',
    value: 0,
  },
  {
    label: 'Dispatched Alerts',
    value: 1,
  },
  {
    label: 'Resolved Alerts',
    value: 2,
  },
  {
    label: 'Outstanding Alerts',
    value: 3,
  },
]

export const CaseType = Object.freeze({
  OPEN: 'open',
  CLOSED: 'closed',
})

export const SPOTLIGHT = 'spotlight'
export const ACTIVITY_LOG = 'activityLog'

export const tabToType = [
  SPOTLIGHT,
  'dispatched', // dispatched
  AlertType.RESOLVED, // resolved
  AlertType.RAISED, // outstanding
  ACTIVITY_LOG, // ACTIVITY LOG - is this necessary? we aren't filtering here as other tabs
  CaseType.OPEN,
  CaseType.CLOSED,
]
