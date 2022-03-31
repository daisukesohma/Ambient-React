import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import Grid from '@material-ui/core/Grid'
import get from 'lodash/get'
import clsx from 'clsx'

import AvatarUploader from '../../../../components/AvatarUploader'
import {
  useCursorStyles,
  useFlexStyles,
} from '../../../../common/styles/commonStyles'

import useStyles from './styles'

const AvatarContainer = ({
  handleDeleteImg,
  img,
  isEditingPassword,
  isUploadInProgress,
  togglePasswordMode,
  uploadProfileImage,
}) => {
  const darkMode = useSelector(state => state.settings.darkMode)
  const flexClasses = useFlexStyles()
  const cursorClasses = useCursorStyles()
  const firstName = useSelector(state => get(state.auth, 'user.firstName'))
  const lastName = useSelector(state => get(state.auth, 'user.lastName'))
  const email = useSelector(state => get(state.auth, 'user.email'))
  const dbRole = useSelector(state => get(state.auth, 'profile.role.role'))
  const role = dbRole
    ? `${dbRole.substring(0, 1)}${dbRole.substring(1).toLowerCase()}`
    : 'Member'

  const classes = useStyles({ darkMode })

  return (
    <Grid container className={classes.container}>
      <Grid item lg={12} md={12} sm={12} xs={12} className={classes.avatarRoot}>
        <AvatarUploader
          img={img}
          onUpload={uploadProfileImage}
          onDelete={handleDeleteImg}
          loading={isUploadInProgress}
        />
        <Grid className={classes.avatarInfo}>
          <div className={clsx(flexClasses.row, flexClasses.centerStart)}>
            <div
              className={clsx('am-h5', classes.avatarName)}
              style={{ marginRight: 24 }}
            >
              {`${firstName} ${lastName}`}
            </div>
          </div>
          <div className={clsx('body1', classes.subText)}>{role}</div>
          <div className={clsx('body1', classes.subText)}>{email}</div>
          <div
            className={clsx(flexClasses.row, flexClasses.centerStart)}
            style={{ marginTop: 16 }}
          >
            <div
              className={clsx(
                'am-overline',
                cursorClasses.clickableText,
                cursorClasses.pointer,
                classes.editText,
              )}
              onClick={togglePasswordMode}
            >
              {isEditingPassword ? 'Back to Profile' : 'Update Password'}
            </div>
          </div>
        </Grid>
      </Grid>
    </Grid>
  )
}

AvatarContainer.defaultProps = {
  handleDeleteImg: () => {},
  img: '',
  isEditingPassword: false,
  isUploadInProgress: false,
  toggleEditProfileMode: () => {},
  togglePasswordMode: () => {},
  uploadProfileImage: () => {},
}

AvatarContainer.propTypes = {
  handleDeleteImg: PropTypes.func,
  img: PropTypes.string,
  isEditingPassword: PropTypes.bool,
  isUploadInProgress: PropTypes.bool,
  toggleEditProfileMode: PropTypes.func,
  togglePasswordMode: PropTypes.func,
  uploadProfileImage: PropTypes.func,
}

export default AvatarContainer
