import { find } from 'lodash'

export default (streams, streamFeeds, orderIndex) => {
  const cell = (streamFeeds && find(streamFeeds, { orderIndex })) || null
  return (cell && find(streams, { id: cell.streamId })) || null
}
