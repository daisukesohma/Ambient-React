import React from 'react'

export default function ImagePlaceholder({
  placeholderLoaded,
  playElem,
  previewDisplay,
  setPlaceholderLoaded,
  snapshot,
}) {
  return (
    <div
      id='video-placeholder'
      style={{ position: 'relative', cursor: 'pointer' }}
    >
      <img
        className='preview full live-stream-placeholder'
        alt='Stream Preview'
        src={snapshot}
        style={{
          display: placeholderLoaded ? `${previewDisplay}` : 'none',
          width: '100%',
          backgroundColor: 'black',
        }}
        onClick={playElem}
        onLoad={() => setPlaceholderLoaded(false)}
      />
    </div>
  )
}
