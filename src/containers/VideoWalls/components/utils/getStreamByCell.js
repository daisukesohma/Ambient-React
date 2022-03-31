import find from 'lodash/find'

export default (streams, streamFeeds, orderIndex) => {
  const cell = (streamFeeds && find(streamFeeds, { orderIndex })) || null
  return (cell && find(streams, { id: cell.streamId })) || null
}
