import {
  PLAY_DEMO,
  PAUSE_DEMO,
  UPDATE_STEP,
  UPDATE_NEXT_TICK,
  TOGGLE_PLAY_PAUSE,
} from './actionTypes'

export const pauseDemo = () => {
  return {
    type: PAUSE_DEMO,
  }
}

export const playDemo = () => {
  return {
    type: PLAY_DEMO,
  }
}

export const togglePlayPauseDemo = () => {
  return {
    type: TOGGLE_PLAY_PAUSE,
  }
}

export const updateStep = ({ activeStep }) => {
  return {
    type: UPDATE_STEP,
    payload: { activeStep },
  }
}

export const updateNextTick = ({ nextTick }) => {
  return {
    type: UPDATE_NEXT_TICK,
    payload: { nextTick },
  }
}
