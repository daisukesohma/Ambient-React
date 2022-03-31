export const VP_TOP_BAR_HEIGHT = 80

export const FETCH_LIMIT = 32

export const SITES_COUNT_IN_TOOLTIP = 20

export const USE_DUMMY_DATA = false

export const SOUND_LEVELS = {
  OFF: 'OFF',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
}

export const HISTORY_PANEL_STATUSES = [
  {
    label: 'Outstanding',
    value: 'created',
  },
  {
    label: 'Dismissed',
    value: 'dismissed',
  },
  {
    label: 'Stale',
    value: 'stale',
  },
  {
    label: 'History',
    value: 'raised',
  },
  {
    label: 'MultiVerified Alerts',
    value: 'multi_inprogress',
  },
]

export const AlertInstanceAction = Object.freeze({
  DISMISS: 'dismissed',
  STALE: 'stale',
  VERIFY: 'verified',
})
