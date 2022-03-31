import { SET_DATA } from './actionTypes'

export const setData = ({ data }) => {
  return {
    type: SET_DATA,
    data,
  }
}
