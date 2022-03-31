export const createExportRequestMessage = (
  uniq,
  streamId,
  nodeId,
  sessionId,
  startTs,
  endTs,
) => ({
  streamId,
  // TODO: DOS possibility. Machine Perception Team wanted exported videos to contain stream id and the start and end time stamps.
  // Math.floor is needed because video exports URL does not take in decimal so must be a round number
  uniqId: `${uniq}-${streamId}-${Math.floor(startTs)}-${Math.floor(endTs)}`,
  nodeId,
  sessionId,
  startTs: startTs * 1000, // needs it in milliseconds
  endTs: endTs * 1000,
})

export const createUpdateArchivalStreamMessage = (
  streamId,
  uniqId,
  nodeId,
  sessionId,
  ts,
) => ({
  streamId,
  uniqId,
  nodeId,
  sessionId,
  ts: ts * 1000,
})
