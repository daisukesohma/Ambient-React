/*
 * author: rodaan@ambient.ai
 * A creation function for the VideoStream react component
 * if you need to activate it from regular Javascript
 */
import React from 'react'
import ReactDOM from 'react-dom'

import VideoStream from './index'
import PreviewFrequency from './data/PreviewFrequency'

// Function which creates a React LiveStreamComponent
const createVideoStream = (
  domContainer,
  accountSlug,
  streamId,
  nodeId,
  viewMode = 'JPG',
  willAutoLoad = false,
  showPlaybackControls = false,
  previewFreq = PreviewFrequency.SLOW,
  siteSlug = null,
  initTS = null,
  isModal = false,
  key,
) => {
  const startTS = initTS ? initTS - 5 : null

  // Should be loaded after defined
  ReactDOM.render(
    <VideoStream
      accountSlug={accountSlug}
      siteSlug={siteSlug}
      streamId={streamId}
      nodeId={nodeId}
      previewFreq={previewFreq}
      debugMode={false}
      viewMode={viewMode}
      autoReconnectAttempts={false}
      reconnectTimeoutMs={false}
      willAutoLoad={willAutoLoad}
      key={key}
      showPlaybackControls={showPlaybackControls}
      initTS={startTS}
      isModal={isModal}
    />,
    domContainer,
  )
}

const destroyVideoStream = domContainer => {
  ReactDOM.unmountComponentAtNode(domContainer)
}

module.exports = {
  create: createVideoStream,
  destroy: destroyVideoStream,
}
