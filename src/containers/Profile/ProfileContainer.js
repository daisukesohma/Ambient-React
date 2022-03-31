/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react'
import { useHistory, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect, useSelector } from 'react-redux'
import { compose } from 'redux'
import Grid from '@material-ui/core/Grid'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { isMobile } from 'react-device-detect'
import get from 'lodash/get'
// src
import { createNotification as createNotificationAction } from 'redux/slices/notifications'

import { Can } from '../../rbac'
import { updateProfile as updateProfileAction } from '../../redux/slices/auth'
import { retrieveDialCodeFromIso2 } from '../../utils/countryCodeToPhone'
import PageTitle from '../../components/Page/Title'

import ChangePasswordContainer from './ChangePassword/ChangePasswordContainer'
import {
  UPDATE_CURRENT_PROFILE,
  ROLLBACK_UI,
  GET_NOTIFICATION_METHODS,
  DELETE_PROFILE_IMAGE,
} from './gql'
import AlertSoundsSwitcher from './components/AlertSoundsSwitcher'
import AvatarContainer from './components/AvatarContainer'
import ControlButtons from './components/ControlButtons'
import DarkModeSwitcher from './components/DarkModeSwitcher'
import NewsFeedPositionSwitcher from './components/NewsFeedPositionSwitcher'
import NotificationOptions from './components/NotificationOptions'
import ProfileEditor from './components/ProfileEditor'
import SPEModeSwitcher from './components/SPEModeSwitcher'
import useStyles from './styles'
import LoadingScreen from '../LoadingScreen'
import RouteLeavingGuard from '../../hoc/routeLeavingGuard'

const Profile = ({
  firstName,
  lastName,
  email,
  isoCode,
  phoneNumber,
  mfaOptIn,
  img,
  createNotification,
  updateProfile,
  hmNotificationsOptIn,
  currentDialCode,
}) => {
  const history = useHistory()
  const classes = useStyles()
  const darkMode = useSelector(state => state.settings.darkMode)
  const [isEditingPassword, setIsEditingPassword] = useState(false)

  const togglePasswordMode = () => {
    setIsEditingPassword(!isEditingPassword)
  }

  // State variables
  const [_firstName, setFirstName] = useState(firstName)
  const [_lastName, setLastName] = useState(lastName)
  const [_email, setEmail] = useState(email)
  const [_isoCode, setIsoCode] = useState(isoCode)
  const [_phoneNumber, setPhoneNumber] = useState(
    phoneNumber ? phoneNumber.replace(`+${currentDialCode}`, '') : '',
  )
  const [_mfaOptIn, setMfaOptIn] = useState(mfaOptIn)
  const [_img, setImg] = useState(img)
  const [_hmNotificationsOptIn, setHMNotificationsOptIn] = useState(
    hmNotificationsOptIn,
  )

  // Non-form state variables
  const [isDirty, setIsDirty] = useState(false)
  const [isUpdateInProgress, setIsUpdateInProgress] = useState(false)
  const [isUploadInProgress, setIsUploadInProgress] = useState(false)
  const [isRollbackInProgress, setIsRollbackInProgress] = useState(false)
  const [openRollbackDialog, setOpenRollbackDialog] = useState(false)
  const [imgUpdated, setImgUpdated] = useState(false)

  // Mutations
  const [
    updateProfileRequest,
    {
      loading: updateProfileInProgress,
      error: updateProfileError,
      data: updateProfileData,
    },
  ] = useMutation(UPDATE_CURRENT_PROFILE, { ignoreResults: false })

  const [
    rollbackUIRequest,
    {
      loading: rollbackUIInProgress,
      error: rollbackUIError,
      data: rollbackUIData,
    },
  ] = useMutation(ROLLBACK_UI)

  const [
    deleteProfileImageRequest,
    {
      loading: deleteProfileImageInProgress,
      error: deleteProfileImageError,
      data: deleteProfileImageData,
    },
  ] = useMutation(DELETE_PROFILE_IMAGE)

  const onInputChange = (setter, value) => {
    setter(value)
    setIsDirty(true)
  }

  const getStateData = addImg => {
    const dialCode = retrieveDialCodeFromIso2(_isoCode)
    const ret = {
      firstName: _firstName,
      lastName: _lastName,
      email: _email,
      isoCode: _isoCode,
      countryCode: dialCode,
      phoneNumber: _phoneNumber,
      mfaOptIn: _mfaOptIn,
      hmNotificationsOptIn: _hmNotificationsOptIn.map(el => ({
        method: el.label,
        id: el.value,
      })),
    }
    if (addImg) {
      ret.img = _img
    }
    return ret
  }

  const handleSave = () => {
    setIsUploadInProgress(true)
    const variables = getStateData(imgUpdated)
    // TODO: Get dialCode using country code and add it to phoneNumber before saving
    variables.hmNotificationsOptIn = variables.hmNotificationsOptIn.map(
      el => el.id,
    )
    updateProfileRequest({
      variables,
    })
  }

  const uploadProfileImage = image => {
    setImg(image)
    setIsDirty(true)
    setImgUpdated(true)
  }

  const handleRollback = () => {
    setIsRollbackInProgress(true)
    rollbackUIRequest()
  }

  const handleDeleteImg = () => {
    setImg(null)
    deleteProfileImageRequest()
  }

  useEffect(() => {
    if (deleteProfileImageError) {
      createNotification({
        message: 'Unable to reach Ambient services. Try again later',
      })
    } else if (deleteProfileImageData) {
      createNotification({ message: 'Removed photo' })
      setImg()
    }
  }, [
    deleteProfileImageInProgress,
    deleteProfileImageError,
    deleteProfileImageData,
    createNotification,
  ])

  useEffect(() => {
    if (updateProfileInProgress) {
      createNotification({ message: 'Updating profile...' })
      setIsUpdateInProgress(true)
    } else {
      setIsUploadInProgress(false)
      setIsUpdateInProgress(false)
      if (updateProfileError) {
        createNotification({
          message: 'Profile could not be updated. Please try again later.',
        })
      }
      if (updateProfileData) {
        const { ok } = updateProfileData.updateProfile
        setIsDirty(false)
        setImgUpdated(false)
        if (ok) {
          createNotification({ message: 'Profile updated successfully.' })
          // Update redux
          updateProfile(getStateData(true))
        } else {
          createNotification({
            message: 'Profile could not be updated. Please try again later.',
          })
        }
      }
    }
    // eslint-disable-next-line
  }, [updateProfileInProgress, updateProfileData, updateProfileError])

  useEffect(() => {
    if (rollbackUIInProgress) {
      setIsRollbackInProgress(true)
    } else {
      if (rollbackUIData) {
        window.location.replace(rollbackUIData.rollbackUi.redirect)
      }
      // TODO: Add error message
      setIsRollbackInProgress(false)
    }
  }, [rollbackUIInProgress, rollbackUIError, rollbackUIData])

  useEffect(() => {
    // Redux update
    updateProfile(getStateData(true))
    // eslint-disable-next-line
  }, [_img])

  // Queried page data
  const { loading, error, data: notificationMethodsRequest } = useQuery(
    GET_NOTIFICATION_METHODS,
  )

  // if (loading) return <Skeleton />
  if (loading) return <LoadingScreen />

  if (error) {
    return 'Error'
  }

  const notificationMethodsOptions =
    notificationMethodsRequest &&
    notificationMethodsRequest.getNotificationMethods
      ? notificationMethodsRequest.getNotificationMethods.map(el => {
          return {
            label: el.method,
            value: el.id,
          }
        })
      : []

  return (
    <Grid container className={classes.root} spacing={2}>
      <Grid item lg={6} md={6} sm={12} xs={12}>
        <PageTitle title='Profile Settings' darkMode={darkMode} />
      </Grid>
      <RouteLeavingGuard
        when={isDirty}
        onNavigate={path => {
          setIsDirty(false)
          history.push(path)
        }}
        shouldBlockNavigation={location => isDirty}
      />
      <Grid item lg={6} md={6} sm={12} xs={12}>
        {!isMobile && !isEditingPassword && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            <ControlButtons
              setOpenRollbackDialog={setOpenRollbackDialog}
              isRollbackInProgress={isRollbackInProgress}
              isUpdateInProgress={isUpdateInProgress}
              isDirty={isDirty}
              handleSave={handleSave}
              openRollbackDialog={openRollbackDialog}
              handleRollback={handleRollback}
            />
          </div>
        )}
      </Grid>
      <Grid item lg={6} md={6} sm={12} xs={12}>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <AvatarContainer
            img={_img}
            uploadProfileImage={uploadProfileImage}
            handleDeleteImg={handleDeleteImg}
            isUploadInProgress={isUploadInProgress}
            togglePasswordMode={togglePasswordMode}
            isEditingPassword={isEditingPassword}
          />
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          {isEditingPassword && (
            <ChangePasswordContainer togglePasswordMode={togglePasswordMode} />
          )}
          {!isEditingPassword && (
            <ProfileEditor
              _firstName={_firstName}
              _lastName={_lastName}
              _email={_email}
              _isoCode={_isoCode}
              _phoneNumber={_phoneNumber}
              _mfaOptIn={_mfaOptIn}
              onInputChange={onInputChange}
              setFirstName={setFirstName}
              setLastName={setLastName}
              setEmail={setEmail}
              setIsoCode={setIsoCode}
              setPhoneNumber={setPhoneNumber}
              setMfaOptIn={setMfaOptIn}
            />
          )}
        </Grid>
      </Grid>
      <Grid item lg={6} md={6} sm={12} xs={12}>
        {!isEditingPassword && (
          <>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <NotificationOptions
                notificationMethodsOptions={notificationMethodsOptions}
                _hmNotificationsOptIn={_hmNotificationsOptIn}
                onInputChange={onInputChange}
                setHMNotificationsOptIn={setHMNotificationsOptIn}
              />
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <DarkModeSwitcher />
            </Grid>
            <Can I='mute_sounds' on='Alerts'>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <AlertSoundsSwitcher />
              </Grid>
            </Can>
            <Can I='is_internal' on='Admin'>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <SPEModeSwitcher />
              </Grid>
            </Can>
            <Can I='view' on='OperatorPage'>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <NewsFeedPositionSwitcher />
              </Grid>
            </Can>
          </>
        )}
      </Grid>
      <Grid item lg={12} md={12} sm={12} xs={12}>
        {isMobile && !isEditingPassword && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <ControlButtons
              setOpenRollbackDialog={setOpenRollbackDialog}
              isRollbackInProgress={isRollbackInProgress}
              isUpdateInProgress={isUpdateInProgress}
              isDirty={isDirty}
              handleSave={handleSave}
              openRollbackDialog={openRollbackDialog}
              handleRollback={handleRollback}
            />
          </div>
        )}
      </Grid>
    </Grid>
  )
}

Profile.propTypes = {
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  email: PropTypes.string,
  phoneNumber: PropTypes.string,
  isoCode: PropTypes.string,
  mfaOptIn: PropTypes.bool,
  img: PropTypes.string,
  createNotification: PropTypes.func,
  updateProfile: PropTypes.func,
  hmNotificationsOptIn: PropTypes.array,
  currentDialCode: PropTypes.string,
}

Profile.defaultProps = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  isoCode: '',
  mfaOptIn: true,
  img: null,
  createNotification: () => {},
  updateProfile: () => {},
  hmNotificationsOptIn: [],
  currentDialCode: null,
}

const mapStateToProps = state => {
  const hmNotificationsOptIn = state.auth.profile.hmNotificationsOptIn.map(
    type => ({
      label: type.method,
      value: type.id,
    }),
  )

  //  Get country code to get dialCode
  // Remove DialCode from phone number to get phoneNumber
  const isoCode = get(state, 'auth.profile.isoCode')
  const dialCode = retrieveDialCodeFromIso2(isoCode)

  return {
    firstName: state.auth.user.firstName,
    lastName: state.auth.user.lastName,
    email: state.auth.user.email,
    isoCode,
    currentDialCode: dialCode,
    phoneNumber: state.auth.profile.phoneNumber,
    mfaOptIn: state.auth.profile.mfaOptIn,
    img: state.auth.profile.img,
    hmNotificationsOptIn,
  }
}

const mapDispatchToProps = dispatch => ({
  createNotification: message => dispatch(createNotificationAction(message)),
  updateProfile: data => dispatch(updateProfileAction(data)),
})

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withRouter,
)(Profile)
