import { getCurrUnixTimestamp } from '../utils'

const increment = 30 * 1000
const tsInMs = getCurrUnixTimestamp() * 1000
const catalogMap = [1, 2, 3, 4, 5]
const mock = {
  available_days: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  catalogue: catalogMap.map(item => {
    return {
      stream_id: 1,
      start_ts: tsInMs - increment * item * 2,
      end_ts: tsInMs - increment * (item * 2 - 1),
    }
  }),
  entity_selections: [
    {
      name: 'person',
      friendly_name: 'Person',
      icon: '/static/img/entities/person.png',
      id: 1,
    },
    { name: 'car', friendly_name: 'Car', icon: '', id: 3 },
    { name: 'truck', friendly_name: 'truck', icon: '', id: 4 },
    { name: 'bicycle', friendly_name: 'bicycle', icon: '', id: 5 },
    { name: 'backpack', friendly_name: 'backpack', icon: '', id: 7 },
    { name: 'door', friendly_name: 'door', icon: '', id: 9 },
    { name: 'box', friendly_name: 'box', icon: '', id: 10 },
    { name: 'bus', friendly_name: 'bus', icon: '', id: 11 },
  ],
  retention: {
    nonmotion_segment_retention_days: 1,
    motion_segment_retention_days: 15,
  },
  motion_segment_retention_days: 15,
  nonmotion_segment_retention_days: 1,
}

export default mock
