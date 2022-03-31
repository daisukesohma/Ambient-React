import React from 'react'
import { useDispatch } from 'react-redux'
import Modal from '@material-ui/core/Modal'
import Typography from '@material-ui/core/Typography'
import { Button } from 'ambient_ui'
import { setIntroSteps } from 'redux/slices/settings'
// src
import WebLogo from 'assets/web_logo_white_bg.png'
import 'intro.js/introjs.css'

import BaseModalWrapper from '../Wrappers/BaseModalWrapper'

import useStyles from './styles'

interface Props {
  open: boolean
  onClose: () => void
}

export default function IntroModal({
  open = false,
  onClose = () => {},
}: Props): JSX.Element {
  const classes = useStyles()
  const dispatch = useDispatch()

  const onExploreClick = () => {
    onClose()
    dispatch(setIntroSteps({ isShown: true }))
  }

  return (
    <Modal open={open} onClose={onClose} disableEnforceFocus>
      <BaseModalWrapper withDarkMode={false}>
        <Typography className={classes.IntroductionTitle} variant='h3'>
          Welcome!
        </Typography>
        <img src={WebLogo} alt='ambient.ai' />
        <Typography className={classes.IntroductionDescription} variant='h6'>
          The proactive video monitoring and security system built for you!
        </Typography>
        <Button onClick={onExploreClick}>Explore Ambient.ai</Button>
      </BaseModalWrapper>
    </Modal>
  )
}
