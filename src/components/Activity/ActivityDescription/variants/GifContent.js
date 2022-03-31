import React from 'react'
import PropTypes from 'prop-types'
import isEmpty from 'lodash/isEmpty'

const propTypes = {
  url: PropTypes.string,
  width: PropTypes.number,
}

const defaultProps = {
  url: '',
  width: 350,
}

function GifContent({ url, width }) {
  if (isEmpty(url)) return false

  return (
    <div>
      <img alt='Gif Content' src={url} style={{ width }} />
    </div>
  )
}

GifContent.propTypes = propTypes
GifContent.defaultProps = defaultProps

export default GifContent
