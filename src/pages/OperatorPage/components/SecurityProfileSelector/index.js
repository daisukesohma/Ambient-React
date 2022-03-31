import React, { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { Icon } from 'react-icons-kit'
import { sun } from 'react-icons-kit/feather/sun'
import { moon } from 'react-icons-kit/feather/moon'
import { eyeOff } from 'react-icons-kit/feather/eyeOff'
import { useLazyQuery, useMutation } from '@apollo/react-hooks'
import { isMobile } from 'react-device-detect'
import { DropdownMenu, Icons } from 'ambient_ui'
import get from 'lodash/get'
// src
import { createNotification } from 'redux/slices/notifications'
import { SecurityProfileStyleEnum } from 'enums'
import { Can } from 'rbac'
import ConfirmDialog from 'components/ConfirmDialog'
import useGlobalSelectedSite from 'common/hooks/useGlobalSelectedSite'
import { stringUtility } from 'utils'

import {
  GET_SECURITY_PROFILE_SELECTOR_INFORMATION,
  CHANGE_SECURITY_PROFILE,
} from './gql'
import useStyles from './styles'

const getIcon = style => {
  switch (style) {
    case SecurityProfileStyleEnum.NIGHT:
      return <Icon icon={sun} />
    case SecurityProfileStyleEnum.DAY:
      return <Icon icon={moon} />
    case SecurityProfileStyleEnum.DISABLED:
    case undefined: // comes back from db as undefined
      return <Icon icon={eyeOff} />

    default:
      return <Icons.Polygon />
  }
}

const propTypes = {
  showOverriddenData: PropTypes.func,
  showAsDropdown: PropTypes.bool,
}

const defaultProps = {
  showOverriddenData: () => {},
  showAsDropdown: true,
}

function SecurityProfileSelector({ showOverriddenData, showAsDropdown }) {
  const latestSecurityProfileName = useSelector(
    state => state.settings.latestSecurityProfileName,
  )
  const [globalSelectedSite] = useGlobalSelectedSite()
  const darkMode = useSelector(state => state.settings.darkMode)

  const [activeIndex, setActiveIndex] = useState(0)
  const dispatch = useDispatch()

  const { account } = useParams()
  const classes = useStyles({ mobile: isMobile, darkMode })
  const [tabs, setTabs] = useState([])
  const [isUpdating, setIsUpdating] = useState(false)
  const [securityProfiles, setSecurityProfiles] = useState([])
  const [isCreateConfirm, setIsCreateConfirm] = useState(false)
  const [toSecurityProfile, setToSecurityProfile] = useState(undefined)

  const [loadOverriddenData, { data: overriddenData }] = useLazyQuery(
    GET_SECURITY_PROFILE_SELECTOR_INFORMATION,
    {
      variables: {
        siteSlug: globalSelectedSite,
        accountSlug: account,
      },
    },
  )

  const [
    changeSecurityProfile,
    { data: changeSecurityProfileResponse },
  ] = useMutation(CHANGE_SECURITY_PROFILE)

  const getOverriddenData = useCallback(async () => {
    await loadOverriddenData()
  }, [loadOverriddenData])

  useEffect(() => {
    if (overriddenData && overriddenData.overriddenSecurityProfile) {
      showOverriddenData({
        user: overriddenData.overriddenSecurityProfile.overrideLog.user,
      })
    }
  }, [overriddenData, showOverriddenData])

  useEffect(() => {
    if (globalSelectedSite) {
      getOverriddenData()
    }
  }, [globalSelectedSite, getOverriddenData])

  useEffect(() => {
    if (overriddenData && overriddenData.securityProfiles) {
      setActiveIndex(
        overriddenData.securityProfiles.reduce((current, item, index) => {
          return item.active ? index + 1 : current
        }, 0),
      )

      const newTabs = overriddenData.securityProfiles.map((el, i) => {
        return {
          label: el.name,
          style: el.style,
          id: el.id,
        }
      })

      newTabs.unshift({
        label: stringUtility.toSentenceCase(SecurityProfileStyleEnum.DISABLED),
      })

      setTabs(newTabs)
      setSecurityProfiles(overriddenData.securityProfiles)
    }
  }, [overriddenData])

  useEffect(() => {
    if (changeSecurityProfileResponse) {
      dispatch(
        createNotification({
          message: get(
            changeSecurityProfileResponse,
            'changeSecurityProfile.message',
          ),
        }),
      )
      getOverriddenData()
    }
  }, [changeSecurityProfileResponse, getOverriddenData, dispatch])

  useEffect(() => {
    if (latestSecurityProfileName) {
      getOverriddenData()
    }
  }, [latestSecurityProfileName, getOverriddenData])

  const handleSecurityProfileChange = newIndex => () => {
    // Dont set disabled on Tab as it changes the style. Instead, make the click
    // a no-op and show default cursor (see below)
    // trackEventToMixpanel(
    //   MixPanelEventEnum.OPERATOR_PAGE_SECURITY_PROFILE_OVERRIDE,
    // )
    if (newIndex !== activeIndex) {
      setIsUpdating(true)
      dispatch(
        createNotification({
          message: 'Switching security profile. This will take a moment.',
        }),
      )

      const variables = {
        siteSlug: globalSelectedSite,
        accountSlug: account,
      }

      if (newIndex !== 0 || newIndex !== undefined) {
        const securityProfile = securityProfiles[newIndex - 1]
        if (securityProfile) {
          variables.securityProfileId = securityProfile.id
        }
      }
      changeSecurityProfile({ variables })
      setIsUpdating(false)
      setActiveIndex(newIndex)
    }
  }

  const mobileActive = tabs.find((label, id) => id === activeIndex)

  const mobileValue = {
    label: get(mobileActive, 'label'),
    value: activeIndex,
  }

  //  Removes "Profile" from Security profile name if it exists
  const getTabLabel = useCallback(label => {
    const labelWords = label.split(' ')
    if (labelWords[labelWords.length - 1].toLowerCase() === 'profile') {
      labelWords.pop()
    }
    return labelWords.join(' ')
  }, [])

  const showConfirmDialog = () => setIsCreateConfirm(true)
  const hideCreateDialog = () => setIsCreateConfirm(false)
  const unauthMessage =
    'You do not have permissions to change the security profile'

  return (
    <Can I='update' on='ContextGraph' passThrough>
      {can => (
        <>
          {showAsDropdown ? (
            <DropdownMenu
              menuItems={tabs.map(({ label, id: value }, index) => ({
                label,
                value,
                index,
              }))}
              selectedItem={mobileValue}
              handleSelection={({ index }) => {
                if (true || can) {
                  if (activeIndex !== index) {
                    showConfirmDialog()
                    setToSecurityProfile(index)
                  }
                } else {
                  dispatch(
                    createNotification({
                      message: unauthMessage,
                    }),
                  )
                }
              }}
            />
          ) : (
            <Tabs
              value={activeIndex}
              onChange={(event, index) => {
                if (true || can) {
                  if (activeIndex !== index) {
                    showConfirmDialog()
                    setToSecurityProfile(index)
                  }
                } else {
                  dispatch(
                    createNotification({
                      message: unauthMessage,
                    }),
                  )
                }
              }}
            >
              {tabs.map((tab, index) => (
                <Tab
                  disableRipple
                  disabled={isUpdating}
                  icon={getIcon(tab.style)}
                  label={getTabLabel(tab.label)}
                  className='am-caption'
                  classes={{
                    root: classes.tabRoot,
                    wrapper: classes.tabWrapper,
                  }}
                  style={{
                    cursor: activeIndex === index ? 'default' : 'pointer',
                  }}
                  key={index}
                />
              ))}
            </Tabs>
          )}
          <ConfirmDialog
            open={isCreateConfirm}
            onClose={hideCreateDialog}
            onConfirm={() => {
              handleSecurityProfileChange(toSecurityProfile)()
              hideCreateDialog()
            }}
            content={
              !toSecurityProfile
                ? 'Are you sure you want to disable Ambient security?'
                : `Are you sure you want to switch your Security Profile to ${tabs[toSecurityProfile].label}?`
            }
          />
        </>
      )}
    </Can>
  )
}

SecurityProfileSelector.propTypes = propTypes
SecurityProfileSelector.defaultProps = defaultProps

export default SecurityProfileSelector
