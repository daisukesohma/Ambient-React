const generateInvestigationWebSocketMessage = (userId, type, argObj) => {
  const startingObj = {
    type,
    user_id: userId,
  }

  return Object.assign(startingObj, argObj)
}

export default generateInvestigationWebSocketMessage
