import React, { useState, useEffect } from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { Icons } from 'ambient_ui'
import useHover from '@react-hook/hover'
import clsx from 'clsx'
// src

import { useFlexStyles } from 'common/styles/commonStyles'

import useStyles from './styles'
import TakePhoto from './components/TakePhoto'

const { Camera, Trash } = Icons

const AvatarUploader = ({ img, loading, onUpload, onDelete }) => {
  const { palette } = useTheme()
  const flexClasses = useFlexStyles()
  const [backgroundImg, setBackgroundImg] = useState(img)
  const [isHovering, ref] = useHover()
  const [isHoveringCamera, refCamera] = useHover()
  const classes = useStyles({ backgroundImg, isHovering })
  const [isTakingPhoto, setIsTakingPhoto] = useState(false)

  const handleFileUpload = event => {
    const reader = new FileReader()
    reader.onload = e => {
      onUpload(e.target.result)
    }
    reader.readAsDataURL(event.target.files[0])
    event.target.value = null // eslint-disable-line
  }

  const handleFileUploadClick = () => {
    document.getElementById('profile-avatar-input').click()
  }

  useEffect(() => {
    setBackgroundImg(img)
  }, [img])

  return (
    <div
      ref={ref}
      className={classes.avatarContainer}
      style={{
        backgroundImage: `url(${backgroundImg})`,
        border: img
          ? `3px solid ${palette.common.tertiary}`
          : `1px solid ${palette.grey[300]}`,
      }}
    >
      <div
        className={clsx(classes.avatarOverlay, {
          [classes.avatarOverlayPlaceholder]: !backgroundImg,
          [classes.avatarOverlayOpacity]: isHovering && backgroundImg,
        })}
      >
        {!loading && (isHovering || !backgroundImg) && (
          <div
            className={clsx(flexClasses.column, flexClasses.centerAll)}
            style={{ color: 'white' }}
          >
            <div
              ref={refCamera}
              onClick={() => setIsTakingPhoto(!isTakingPhoto)}
            >
              <Camera
                width={30}
                height={30}
                stroke={
                  isHoveringCamera
                    ? palette.secondary.main
                    : palette.common.white
                }
              />
            </div>
            <div style={{ marginBottom: 8 }}>or</div>
            <div
              onClick={handleFileUploadClick}
              className={clsx('am-overline', classes.uploadText)}
            >
              Upload
            </div>
          </div>
        )}
        <input
          accept='image/*'
          type='file'
          onChange={handleFileUpload}
          id='profile-avatar-input'
          style={{ display: 'none' }}
        />
        {img && (
          <div className={classes.deleteBtn} onClick={onDelete}>
            <Trash stroke={palette.common.white} />
          </div>
        )}
      </div>
      <div style={{ marginTop: 192, marginLeft: -24 }}>
        {isTakingPhoto && (
          <TakePhoto
            onUpload={onUpload}
            handleClose={() => setIsTakingPhoto(false)}
          />
        )}
      </div>
    </div>
  )
}

AvatarUploader.defaultProps = {
  img: [],
  loading: false,
  onUpload: () => {},
  onDelete: () => {},
}

AvatarUploader.propTypes = {
  img: PropTypes.string,
  loading: PropTypes.bool,
  onUpload: PropTypes.func,
  onDelete: PropTypes.func,
}

export default AvatarUploader
