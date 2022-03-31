import React, { memo, useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import clsx from 'clsx'
import { useHistory } from 'react-router-dom'
import { Icon } from 'react-icons-kit'
// src
import CopyLink from 'components/CopyLink'
import { useFuturisticStyles, useFlexStyles } from 'common/styles/commonStyles'
import shareLinkParams from 'selectors/shareLink/params'
import shareLinkOnlyVideoParams from 'selectors/shareLink/paramsOnlyVideo'
import OutsideClickHandler from 'react-outside-click-handler'
import { setModalOpen } from 'redux/slices/videoStreamControls'

import TimeAdjustment from './components/TimeAdjustment'
import AlertAdjustment from './components/AlertAdjustment'
import useStyles from './styles'

const propTypes = {
  isOpen: PropTypes.bool,
}

function VideoShareLink({ isOpen }) {
  const classes = useStyles()
  const flexClasses = useFlexStyles()
  const futuristicClasses = useFuturisticStyles()
  const dispatch = useDispatch()
  // Logic for toggling different params on the URL
  const urlAllParams = useSelector(shareLinkParams)
  const urlVideoOnlyParams = useSelector(shareLinkOnlyVideoParams)
  const isAlertModal = useSelector(state => state.shareLink.video.objectType) // proxy for if it's an alert modal
  const [alertParamsEnabled, setAlertParamsEnabled] = useState(isAlertModal) // pass down to checkbox

  const url = alertParamsEnabled ? urlAllParams : urlVideoOnlyParams

  if (!isOpen) return false

  return (
    <div id='keyboardHelp' className={classes.root}>
      <OutsideClickHandler
        onOutsideClick={() =>
          dispatch(
            setModalOpen({
              videoStreamKey: 'modal',
              modal: 'videoShareLink',
              open: false,
            }),
          )
        }
      >
        <div className={classes.backgroundContainer}>
          <div
            className={clsx(
              'am-caption',
              futuristicClasses.iceSheet,
              flexClasses.column,
            )}
            style={{ padding: 8 }}
          >
            <div>
              <div className='am-h5' style={{ marginBottom: 16 }}>
                Share
              </div>
              <div className={clsx(flexClasses.row, classes.rowSpacing)}>
                <div className={clsx('am-caption', classes.caption)}>{url}</div>
                <span style={{ marginLeft: 8 }}>
                  <CopyLink
                    text={url}
                    confirmText='Your shareable link has been copied to the clipboard!'
                    tooltipText='Copy shareable link'
                  />
                </span>
              </div>
              <span>
                {isAlertModal ? (
                  <div>
                    <AlertAdjustment
                      enabled={alertParamsEnabled}
                      setEnabled={setAlertParamsEnabled}
                    />
                    {alertParamsEnabled ? null : <TimeAdjustment />}
                  </div>
                ) : (
                  <TimeAdjustment />
                )}
              </span>
            </div>
          </div>
        </div>
      </OutsideClickHandler>
    </div>
  )
}

VideoShareLink.propTypes = propTypes

export default VideoShareLink
