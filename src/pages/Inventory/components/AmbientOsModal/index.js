/* eslint-disable consistent-return */
import React, { useState, useEffect } from 'react'
import { useTheme } from '@material-ui/core/styles'
import { useSelector, useDispatch } from 'react-redux'
import clsx from 'clsx'
import Box from '@material-ui/core/Box'
import Modal from '@material-ui/core/Modal'
import fromUnixTime from 'date-fns/fromUnixTime'
import differenceInSeconds from 'date-fns/differenceInSeconds'
import { Button } from 'ambient_ui'
// src
import trackEventToMixpanel from 'mixpanel/utils/trackEventToMixpanel'
import { MixPanelEventEnum } from 'enums'
import { useCursorStyles } from 'common/styles/commonStyles'
import BaseModalWrapper from 'components/Modals/Wrappers/BaseModalWrapper'
import BaseModalTitle from 'components/Modals/Wrappers/BaseModalTitle'
import {
  setAmbientOsModalValue,
  fetchAmbientOsRequested,
} from 'pages/Inventory/redux'

function AmbientOsModal({ open }) {
  const { palette } = useTheme()
  const dispatch = useDispatch()
  const cursorClasses = useCursorStyles()

  const { url, expires } = useSelector(state => state.inventory.ambientOsModal)

  // START COUNTDOWN TIMER
  //
  // initialize timeLeft with the seconds prop
  const [timeLeft, setTimeLeft] = useState(
    differenceInSeconds(fromUnixTime(expires), new Date()),
  )

  useEffect(() => {
    setTimeLeft(differenceInSeconds(fromUnixTime(expires), new Date()))
  }, [expires])

  useEffect(() => {
    // exit early when we reach 0
    if (!timeLeft) return

    // save intervalId to clear the interval when the
    // component re-renders
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1)
    }, 1000)

    // clear interval on re-render to avoid memory leaks
    return () => clearInterval(intervalId)
    // add timeLeft as a dependency to re-rerun the effect when it updates
  }, [timeLeft])
  //
  // END COUNTDOWN TIMER

  const renewUrl = () => dispatch(fetchAmbientOsRequested())

  const handleClose = () => {
    dispatch(
      setAmbientOsModalValue({
        isOpen: false,
        url: null,
        expires: null,
      }),
    )
  }

  const trackDownload = () => {
    trackEventToMixpanel(MixPanelEventEnum.INVENTORY_DOWNLOAD_ISO)
  }

  return (
    <Modal open={open}>
      <BaseModalWrapper width='475px' height='fit-content'>
        <BaseModalTitle title='Ambient OS Download' handleClose={handleClose} />
        <Box display='flex' flexDirection='row' alignItems='center' p={2}>
          {timeLeft > 0 ? (
            <>
              <a
                href={url}
                target='_'
                style={{ color: 'white' }}
                onClick={trackDownload}
              >
                Download Ambient OS
              </a>
              <span
                className='am-caption'
                style={{ color: palette.grey[500], marginLeft: 16 }}
              >
                {`Link expires in ${timeLeft}s`}
              </span>
            </>
          ) : (
            <Button
              variant='text'
              onClick={renewUrl}
              className={clsx(
                cursorClasses.pointer,
                cursorClasses.clickableText,
                'am-caption',
              )}
            >
              Generate new Ambient OS download link
            </Button>
          )}
        </Box>
      </BaseModalWrapper>
    </Modal>
  )
}

export default AmbientOsModal
