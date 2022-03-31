import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Steps } from 'intro.js-react'
import { setIntroSteps } from 'redux/slices/settings'

import introSteps from './Intro'

// FUTURE: generalize walkthru to be for any type, not just intro

export default function WalkThru() {
  const dispatch = useDispatch()
  const isStepsEnabled = useSelector(state => state.settings.introOpened)
  const onExitIntro = () => {
    dispatch(setIntroSteps({ isShown: false }))
  }

  return (
    <>
      <Steps
        enabled={isStepsEnabled}
        steps={introSteps}
        initialStep={0}
        options={{ showStepNumbers: false }}
        onExit={onExitIntro}
      />
    </>
  )
}
