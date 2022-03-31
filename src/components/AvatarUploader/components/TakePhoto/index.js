import React from 'react'
import PropTypes from 'prop-types'
import { Icon } from 'ambient_ui'
import Camera from 'react-html5-camera-photo'
import 'react-html5-camera-photo/build/css/index.css'
import './override.css'
import clsx from 'clsx'

import { useCursorStyles } from 'common/styles/commonStyles'

function TakePhoto({ onUpload, handleClose }) {
  const cursorClasses = useCursorStyles()
  function handleTakePhoto(dataUri) {
    onUpload(dataUri)
    handleClose()
  }

  return (
    <div style={{ position: 'relative', width: 'calc(40vw)', zIndex: 10 }}>
      <Camera
        onTakePhoto={dataUri => {
          handleTakePhoto(dataUri)
        }}
      />
      <div
        className={clsx('am-subtitle2', cursorClasses.pointer)}
        style={{ position: 'absolute', top: 24, right: 24 }}
        onClick={handleClose}
      >
        <Icon icon='close' color='white' size={36} />
      </div>
    </div>
  )
}

TakePhoto.propTypes = {
  onUpload: PropTypes.func,
  handleClose: PropTypes.func,
}

TakePhoto.defaultProps = {
  onUpload: () => {},
  handleClose: () => {},
}

export default TakePhoto
