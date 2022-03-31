import React, { useMemo, useEffect } from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import Modal from 'components/Modal'
import { useTheme } from '@material-ui/core/styles'
import { Button, SearchableSelectDropdown, DropdownMenu } from 'ambient_ui'
import { useFlexStyles } from 'common/styles/commonStyles'
import { useParams } from 'react-router-dom'
import get from 'lodash/get'
import { Can } from 'rbac'

import Profile from './components/ProfileItem'
import ContactResourceItem from './components/ContactResourceItem'
import {
  createWorkShiftRequested,
  setCheckinModalOpen,
  setResponderId,
  setSiteSlug,
  setContactResourceId,
} from './redux/checkinModalSlice'
import useStyles from './styles'

const defaultProps = {
  noButton: false,
  mobile: false,
}

const propTypes = {
  noButton: PropTypes.bool,
  mobile: PropTypes.bool,
}

const CheckinModal = ({ noButton, mobile }) => {
  const { palette } = useTheme()
  const dispatch = useDispatch()
  const { account } = useParams()
  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({ darkMode })

  const checkinModalOpen = useSelector(
    state => state.checkinModal.checkinModalOpen,
  )
  const users = useSelector(state => state.checkinModal.users)
  const userSites = useSelector(state => state.auth.sites)
  const currentUserProfileId = useSelector(state => state.auth.profile.id)

  const currentUserSignedIn = useSelector(
    state => state.auth.profile.isSignedIn,
  )

  const responderId = useSelector(state => state.checkinModal.responderId)
  const responderReadOnly = useSelector(
    state => state.checkinModal.responderReadOnly,
  )
  const siteSlug = useSelector(state => state.checkinModal.siteSlug)
  const contactResourceId = useSelector(
    state => state.checkinModal.contactResourceId,
  )
  const contactResourceReadOnly = useSelector(
    state => state.checkinModal.contactResourceReadOnly,
  )
  const siteReadOnly = useSelector(state => state.checkinModal.siteReadOnly)

  const flexClasses = useFlexStyles()

  const sites = useSelector(state => state.operatorPage.sites)
  const contactResources = useSelector(
    state => state.checkinModal.contactResources,
  )
  const refreshUsers = useSelector(state => state.checkinModal.refreshUsers)

  const profileIdOptions = useMemo(
    () =>
      contactResourceReadOnly && siteSlug !== null
        ? [
            { label: 'Select Profile', value: null },
            ...(users || [])
              .filter(
                user => get(user, 'profile.role.name', null) === 'Responder',
              )
              .filter(
                user =>
                  user.sites.findIndex(site => site.slug === siteSlug) > -1,
              )
              .map(user => ({
                value: user.profile.id,
                label: <Profile user={user} darkMode={darkMode} />,
              })),
          ]
        : [
            { label: 'Select Profile', value: null },
            ...(users || [])
              .filter(
                user => get(user, 'profile.role.name', null) === 'Responder',
              )
              .map(user => ({
                value: user.profile.id,
                label: <Profile user={user} darkMode={darkMode} />,
              })),
          ],
    [users, contactResourceReadOnly, siteSlug, darkMode],
  )

  const responder = users.find(user => user.profile.id === responderId)

  const checkedIn =
    (responder && responder.profile.isSignedIn) ||
    (mobile && currentUserSignedIn)

  const siteMap = sitesToMap =>
    sitesToMap.map(site => ({
      value: site.slug,
      label: site.name,
    }))

  const initialSiteOptions = useMemo(
    () =>
      mobile
        ? [{ label: 'Select Site', value: null }, ...siteMap(userSites)]
        : [{ label: 'Select Site', value: null }, ...siteMap(sites)],
    [sites, mobile, userSites],
  )

  const siteOptions = responder
    ? initialSiteOptions.filter(
        // only show allowed sites for user
        siteOption =>
          !siteOption.value ||
          responder.sites.findIndex(site => site.slug === siteOption.value) >
            -1,
      )
    : initialSiteOptions

  const contactResourceOptions = useMemo(
    () => [
      { label: 'Select Contact Resource', value: null },
      ...(contactResources || [])
        .filter(
          contact =>
            !contact.site || siteSlug === get(contact, 'site.slug', null),
        )
        .map(contact => ({
          value: contact.id,
          label: <ContactResourceItem contact={contact} darkMode={darkMode} />,
        })),
    ],
    [contactResources, siteSlug, darkMode],
  )

  const contactResource = contactResources.find(
    resource => resource.id === contactResourceId,
  )

  useEffect(() => {
    // need to check if responder has access to the site
    if (
      responder &&
      responder.sites.findIndex(site => site.slug === siteSlug) === -1
    ) {
      dispatch(setSiteSlug({ siteSlug: null }))
    }
  }, [dispatch, responder, siteSlug])

  useEffect(() => {
    if (contactResource) {
      const slug = get(contactResource, 'site.slug', null)
      if (slug !== null && siteSlug !== slug) {
        dispatch(setContactResourceId({ contactResourceId: null }))
      }
    }
  }, [dispatch, contactResource, siteSlug])

  const usersLoading = useSelector(state => state.checkinModal.usersLoading)
  const contactResourcesLoading = useSelector(
    state => state.checkinModal.contactResourcesLoading,
  )
  const creatingWorkShift = useSelector(
    state => state.checkinModal.creatingWorkShift,
  )

  const handleClick = signIn => {
    const cRId = signIn ? contactResourceId : null
    if (mobile && siteSlug) {
      dispatch(
        createWorkShiftRequested({
          accountSlug: account,
          siteSlug,
          contactResourceId: cRId,
          signIn,
          userProfileId: responderId,
          refreshContactResources: false,
          refreshUsers,
          checkInThemself: true,
        }),
      )
    }
    if (!responder || !siteSlug) {
      return
    }
    const checkInThemself = parseInt(currentUserProfileId, 10) === cRId

    dispatch(
      createWorkShiftRequested({
        accountSlug: account,
        siteSlug,
        contactResourceId: cRId,
        signIn,
        userProfileId: get(responder, 'profile.id'),
        refreshContactResources: contactResourceReadOnly,
        refreshUsers,
        checkInThemself,
      }),
    )
  }

  const contactResourceInfoText =
    'Optional: Contact resource is the medium in which a responder can be contacted with. If none selected, the responder can be contacted through their default information.'

  return (
    <>
      {!noButton && (
        <Can I='create' on='WorkShifts'>
          <Button
            onClick={() => {
              dispatch(setCheckinModalOpen({ checkinModalOpen: true }))
            }}
            variant='text'
            color='primary'
            customStyle={{
              position: 'relative',
              width: '100%',
            }}
            loading={usersLoading || contactResourcesLoading}
            disabled={usersLoading || contactResourcesLoading}
          >
            Check in
          </Button>
        </Can>
      )}
      <Modal
        isChildOpen={checkinModalOpen}
        handleChildClose={() => {
          dispatch(setCheckinModalOpen({ checkinModalOpen: false }))
        }}
        showCloseIcon={false}
        customStyle={{
          maxWidth: 600,
          background: darkMode ? palette.common.black : palette.common.white,
          padding: 16,
        }}
      >
        <div className={clsx(flexClasses.column)}>
          <div
            className='am-h4'
            style={{
              color: darkMode ? palette.common.white : palette.common.black,
            }}
          >
            Check In Responder
          </div>
          <div className={clsx(flexClasses.row, classes.modalBody)}>
            <div className={clsx(flexClasses.column, classes.userInformation)}>
              {!responderReadOnly && !mobile && (
                <div className={clsx(flexClasses.row, classes.row)}>
                  <div className={clsx(classes.labelContainer)}>
                    <div className={clsx(classes.label)}>Profile</div>
                  </div>
                  <DropdownMenu
                    menuItems={profileIdOptions}
                    selectedItem={profileIdOptions.find(
                      item => item.value === responderId,
                    )}
                    handleSelection={option =>
                      dispatch(setResponderId({ responderId: option.value }))
                    }
                    styles={{ marginLeft: 0 }}
                    fitRow
                  />
                </div>
              )}
              <div className={clsx(flexClasses.row, classes.row)}>
                <div className={clsx(classes.labelContainer)}>
                  <div className={clsx(classes.label)}>Site</div>
                </div>
                <SearchableSelectDropdown
                  options={siteOptions}
                  value={siteOptions.find(item => item.value === siteSlug)}
                  onChange={option =>
                    dispatch(setSiteSlug({ siteSlug: option.value }))
                  }
                  styles={{ marginLeft: 0 }}
                  disabled={siteReadOnly || (!responder && !mobile)}
                  fitRow
                  menuPortalTarget={document.body}
                  styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                />
              </div>
              <div className={clsx(flexClasses.row, classes.row)}>
                <div className={clsx(classes.labelContainer)}>
                  <div className={clsx(classes.label)}>Contact Resource</div>
                </div>

                <DropdownMenu
                  menuItems={contactResourceOptions}
                  selectedItem={contactResourceOptions.find(
                    item => item.value === contactResourceId,
                  )}
                  handleSelection={option =>
                    dispatch(
                      setContactResourceId({
                        contactResourceId: option.value,
                      }),
                    )
                  }
                  styles={{ marginLeft: 0 }}
                  fitRow
                  disabled={
                    contactResourceReadOnly ||
                    (!contactResourceReadOnly && !siteSlug)
                  }
                />
              </div>
              {!contactResourceReadOnly && siteSlug && (
                <div className={clsx(flexClasses.row)}>
                  <p className={clsx('am-subtitle2', classes.text)}>
                    {contactResourceInfoText}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className={clsx(flexClasses.row, flexClasses.centerBetween)}>
            <div className={clsx(flexClasses.row)}>
              {checkedIn && (
                <Button
                  onClick={() => {
                    handleClick(false)
                  }}
                  variant='text'
                  color='warning'
                  disabled={
                    !siteSlug || (!responder && !mobile) || creatingWorkShift
                  }
                  customStyle={{
                    backgroundColor: palette.warning.main,
                    color: palette.common.white,
                    opacity: !siteSlug ? 0.5 : 1,
                  }}
                >
                  Check Out
                </Button>
              )}
            </div>
            <div className={clsx(flexClasses.row)}>
              <Button
                disabled={creatingWorkShift}
                onClick={() => {
                  dispatch(setCheckinModalOpen({ checkinModalOpen: false }))
                }}
                variant='text'
                color='primary'
                customStyle={{ marginRight: 24 }}
              >
                Cancel
              </Button>

              <Button
                disabled={
                  !siteSlug || (!responder && !mobile) || creatingWorkShift
                }
                loading={creatingWorkShift}
                onClick={() => {
                  handleClick(true)
                }}
                color='primary'
              >
                Check in
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

CheckinModal.propTypes = propTypes
CheckinModal.defaultProps = defaultProps

export default CheckinModal
