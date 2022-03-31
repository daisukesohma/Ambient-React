/* eslint-disable no-case-declarations, no-param-reassign, no-fallthrough */
import produce from 'immer'
import { showModal } from 'redux/slices/modal'

import {
  PLAY_DEMO,
  PAUSE_DEMO,
  UPDATE_STEP,
  UPDATE_NEXT_TICK,
  TOGGLE_PLAY_PAUSE,
} from './actionTypes'

const initialState = {
  playing: false,
  activeStep: -1,
  nextTick: 5,
}

const demoReducer = produce((draft = initialState, action) => {
  switch (action.type) {
    case TOGGLE_PLAY_PAUSE:
      draft.playing = !draft.playing
      return draft

    case PLAY_DEMO:
      draft.playing = true
      return draft

    case PAUSE_DEMO:
      draft.playing = false
      return draft

    case UPDATE_STEP:
      draft.activeStep = action.payload.activeStep
      return draft

    case UPDATE_NEXT_TICK:
      draft.nextTick = action.payload.nextTick
      return draft

    /*
     * This was initially desirable but folks don't like
     * playback resuming automatically. It's disruptive.
    case HIDE_MODAL:
    case CONFIRM:
      draft.playing = true
      return draft
    */
    // NOTE: not sure why we need it, but after refactoring Modal Slice just need to support it to avoid any regressions (Alex L.)
    case showModal.type:
      draft.playing = false
      return draft

    default:
      return draft
  }
})

export default demoReducer
