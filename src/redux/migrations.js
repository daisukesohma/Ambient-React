// NOTE: This all about migration previous localStorage (or other store)
// state to new version. If you don't have reducer in whitelist, I think you
// don't need to write migrations.

import omit from 'lodash/omit'
import get from 'lodash/get'

import { StreamTypeUpdatedEnum, StreamTypeEnum } from '../enums'

// Example: if will completely remove reducer ('intro' reducer in example)
// import omit from 'lodash/omit'
// 2: (state) => {
//   return omit(state, ['intro']);
// },

// Example: if you updated some reducer and want
// to cleanup previous state ('auth' reducer in example)
// 3: (state) => {
//   return { ...state, auth: undefined }
// },

// WARNING! Do not REMOVE migrations, it will update localStorage
// from previous localStorage state for
// users who already visited application earlier

export default {
  1: state => state,
  2: state => {
    const previousIntroState = get(state, 'intro.open', false)
    const newState = omit(state, ['intro'])
    newState.settings.introOpened = previousIntroState
    return newState
  },
  3: state => {
    const newState = state
    newState.operatorPage = get(state, 'operatorPage', {})
    newState.operatorPage.users = get(state, 'operatorPage.users', [])
    return newState
  },
  4: state => {
    const newState = state
    newState.settings = get(state, 'settings', {})
    newState.settings.streamV2Type = StreamTypeUpdatedEnum.NORMAL
    newState.settings.streamType = StreamTypeEnum.NORMAL
    return newState
  },
  5: state => {
    const newState = state
    newState.operatorPage = get(state, 'operatorPage', {})
    newState.operatorPage.unSelectedSites = get(
      state,
      'operatorPage.unSelectedSites',
      [],
    )
    return newState
  },
}
