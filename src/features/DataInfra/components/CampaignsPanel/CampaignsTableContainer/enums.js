export const campaignActionToReadable = Object.freeze({
  STARTED: 'START',
  DELETED: 'DELETE',
  ARCHIVED: 'ARCHIVE',
  STOPPED: 'STOP',
})

export const campaignStates = Object.freeze({
  STARTED: 'STARTED',
  DELETED: 'DELETED',
  ARCHIVED: 'ARCHIVED',
  STOPPED: 'STOPPED',
})

export const irreversableStates = Object.freeze(['ARCHIVED', 'DELETED'])
