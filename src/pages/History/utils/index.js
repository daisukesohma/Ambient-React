import convertTSToReadableDate from './convertTSToReadableDate'
import generateInvestigationWebSocketMessage from './generateInvestigationWebSocketMessage'
import map from 'lodash/map'

const produceFilter = selections => map(selections, 'value')

export {
  produceFilter,
  convertTSToReadableDate,
  generateInvestigationWebSocketMessage,
}
