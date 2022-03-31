/*
 * author: rodaan@ambient.ai
 * A utility method for generating WebSocket Messages
 */
const generateWebSocketMessage = (profileId, type, argObj) => {
  const startingObj = {
    type,
    profile_id: profileId,
  }

  return Object.assign(startingObj, argObj)
}

export default generateWebSocketMessage
