import { map, get, isEmpty, startCase } from 'lodash'
import { formatUnixTimeWithTZ } from '../../utils/dateTime/formatTimeWithTZ'

export const convertAllUppercaseWordToReadable = type => {
  let str = ''
  const chunks = type.split('_')
  chunks.forEach((chunk, index) => {
    if (index === chunks.length - 1) {
      str += startCase(chunk.toLowerCase())
    } else {
      str += `${startCase(chunk.toLowerCase())} `
    }
  })
  return str
}

export const getEventByThreatSignaturePause = activity => {
  const timeFormat = 'yyy-MM-dd HH:mm:ss zzz'
  const streams = get(activity, 'streams', [])
  const streamNames = map(streams, 'name').join(', ')
  const formattedEndTime = formatUnixTimeWithTZ(
    get(activity, 'endTs'),
    timeFormat,
  )
  const formattedCancelledTime = formatUnixTimeWithTZ(
    get(activity, 'cancelledTs'),
    timeFormat,
  )
  const getName = prop => {
    return `${get(activity, [prop, 'user', 'firstName'])} ${get(activity, [
      prop,
      'user',
      'lastName',
    ])}`
  }
  const getDetails = prop => {
    const description = get(activity, prop)
    return isEmpty(description) ? '' : `because "${description}"`
  }
  const getStreamsText = isEmpty(streamNames)
    ? ''
    : `on streams: ${streamNames}`
  const description = get(activity, 'description')
  const threatSignatureName = get(activity, 'threatSignature.name')
  return isEmpty(activity.cancelledBy)
    ? `${getName(
        'createdBy',
      )} created a pause period for ${threatSignatureName} ${getDetails(
        'description',
      )} ${getStreamsText} which will end on ${formattedEndTime}`
    : `${getName('cancelledBy')} cancelled ${getName('createdBy')} pause period 
    for ${threatSignatureName} ${getDetails(
        'cancelledDescription',
      )} ${getStreamsText} originally 
    created ${
      isEmpty(description) ? '' : `for "${description}"`
    } at ${formattedCancelledTime}`
}
