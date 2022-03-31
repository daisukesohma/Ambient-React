/*
 * author: eric@ambient
 */
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { ThemeProvider } from '@material-ui/core/styles'
import gifFrames from 'gif-frames'

import Theme from 'theme'

import '../../design_system/Theme.css'
import useStyles from './styles'

// If CORS Error:
// https://medium.com/@dtkatz/3-ways-to-fix-the-cors-error-and-how-access-control-allow-origin-works-d97d55946d9

// This works for most cases, but not all.
// For example, the Math.round produces uninteneded frame mismatch between expected
// output and actual output.
// Take for example 108 as totalFrames and count = 20
// With a count of 19, we get 19 final frames, but with 20, we get 23 final frames.
// This is because the interval is 5.4 rounded down to 5, and
const getFrameIndices = (totalFrames, count, includeLastFrame) => {
  // get [0, 1, ... totalFrames - 1]
  const allIndices = [...Array(totalFrames).keys()]

  // early exit if you ask for more total frames than there are
  if (count >= totalFrames) {
    return allIndices
  }

  // first frame is always returned (index 0), so subtract one to get the right count number
  //
  const countCountingFirst = count - 1
  const interval = Math.round(totalFrames / countCountingFirst)
  let filtered = allIndices.filter(i => i % interval === 0)

  if (includeLastFrame) {
    const lastIndex = totalFrames - 1
    if (filtered[filtered.length - 1] !== lastIndex) {
      filtered = [...filtered, lastIndex]
    }
  }
  return filtered
}

function GifSplitter({
  frameCount,
  includeLastFrame,
  orientation,
  url,
  width,
  wrap,
}) {
  const rootId = 'gif-root'
  // dynamically set aspect ratio
  const [widthHeightRatio, setWidthHeightRatio] = useState(4 / 3)
  const classes = useStyles({
    ratio: widthHeightRatio,
    width,
    wrap,
    orientation,
  })
  const [frames, setFrames] = useState(undefined)

  const clearNode = () => {
    const root = document.getElementById(rootId)
    const clearedNode = root.cloneNode(false)
    root.parentNode.replaceChild(clearedNode, root)
  }

  const renderFrames = (allFrames, indices) => {
    indices.forEach(i => {
      const img = allFrames[i].getImage()
      const container = document.createElement('div')
      container.appendChild(img)
      document.getElementById(rootId).append(container)
    })
  }

  useEffect(() => {
    gifFrames({
      url,
      frames: 'all',
      quality: 100,
      outputType: 'canvas',
      cumulative: true,
    }).then(frameData => {
      setFrames(frameData)
      setWidthHeightRatio(
        frameData[0].frameInfo.width / frameData[0].frameInfo.height,
      )
    })
  }, [url])

  useEffect(() => {
    if (frames) {
      clearNode()
      const { length } = frames
      const indices = getFrameIndices(length, frameCount, includeLastFrame)
      renderFrames(frames, indices)
    }
  }, [frames, frameCount, includeLastFrame, url])

  return (
    <ThemeProvider theme={Theme}>
      <div id={rootId} className={classes.root} />
    </ThemeProvider>
  )
}

GifSplitter.defaultProps = {
  frameCount: 5,
  includeLastFrame: true,
  orientation: 'horizontal',
  url:
    'https://media1.tenor.com/images/b9b0253a0d1a42baf064e643aaad20cb/tenor.gif?itemid=10903124', // 'http://remote.ambient.ai/static/gifs/251_1575787525071.gif', // 'https://media1.giphy.com/media/21AQO1Mrq6i0E/giphy.gif',
  width: 250,
  wrap: false,
}

GifSplitter.propTypes = {
  frameCount: PropTypes.number,
  includeLastFrame: PropTypes.bool,
  orientation: PropTypes.oneOf(['vertical', 'horiztonal']),
  url: PropTypes.string,
  width: PropTypes.number,
  wrap: PropTypes.bool,
}

export default GifSplitter
