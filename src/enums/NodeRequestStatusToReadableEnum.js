// Node Request Statuses
import NodeRequestStatusEnum from './NodeRequestStatusEnum'

const NodeRequestStatusToReadableEnum = {
  // statuses which node assigns to table from appliance code
  [NodeRequestStatusEnum.INCOMPLETE]: 'Incomplete',
  [NodeRequestStatusEnum.INPROGRESS]: 'In Progress',
  [NodeRequestStatusEnum.COMPLETED]: 'Completed',
  [NodeRequestStatusEnum.FAILED]: 'Failed',
}

export default NodeRequestStatusToReadableEnum
