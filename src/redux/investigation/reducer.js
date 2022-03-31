import { SET_DATA } from './actionTypes'

const investigationInitialState = {
  investigationData: {},
}

const investigationReducer = (
  state = { ...investigationInitialState },
  action,
) => {
  switch (action.type) {
    case SET_DATA:
      return {
        investigationData: action.data,
      }
    default:
      return state
  }
}

export default investigationReducer
