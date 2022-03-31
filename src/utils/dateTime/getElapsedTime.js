import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import formatDistance from 'date-fns/formatDistance'

const getElapsedTime = (unixTs, addSuffix = false) => {
  return formatDistanceToNow(new Date(unixTs * 1000), { addSuffix })
}

export const getElapsedTimeBetweenDates = (
  unixStartTs,
  unixEndTs,
  addSuffix = false,
) => {
  return formatDistance(
    new Date(unixStartTs * 1000),
    new Date(unixEndTs * 1000),
    { addSuffix },
  )
}

export default getElapsedTime
