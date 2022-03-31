import React, { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import Paper from '@material-ui/core/Paper'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { Icon } from 'react-icons-kit'
import { sun } from 'react-icons-kit/feather/sun'
import { moon } from 'react-icons-kit/feather/moon'
import { eyeOff } from 'react-icons-kit/feather/eyeOff'
import { octagon } from 'react-icons-kit/feather/octagon'
import { useLazyQuery, useMutation } from '@apollo/react-hooks'
import { isMobile } from 'react-device-detect'
import { SearchableSelectDropdown } from 'ambient_ui'
import get from 'lodash/get'
import { isWidthDown } from '@material-ui/core/withWidth'

// src
import { createNotification } from 'redux/slices/notifications'
import { Can } from 'rbac'
import ConfirmDialog from 'components/ConfirmDialog'
import { SecurityProfileStyleEnum } from 'enums'
import { stringUtility } from 'utils'
import useWidth from 'common/hooks/useWidth'

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
      return <Icon icon={octagon} />
  }
}

const SecurityProfileSelector = ({ showOverriddenData }) => {
  const latestSecurityProfileName = useSelector(
    state => state.settings.latestSecurityProfileName,
  )
  const darkMode = useSelector(state => state.settings.darkMode)

  const [activeIndex, setActiveIndex] = useState(0)
  const dispatch = useDispatch()

  const { account, site } = useParams()
  const classes = useStyles({ mobile: isMobile })
  const [tabs, setTabs] = useState([])
  const [isUpdating, setIsUpdating] = useState(false)
  const [securityProfiles, setSecurityProfiles] = useState([])
  const [isCreateConfirm, setIsCreateConfirm] = useState(false)
  const [toSecurityProfile, setToSecurityProfile] = useState(undefined)

  const [loadOverriddenData, { data: overriddenData }] = useLazyQuery(
    GET_SECURITY_PROFILE_SELECTOR_INFORMATION,
    {
      variables: {
        siteSlug: site,
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

  const width = useWidth()

  useEffect(() => {
    if (overriddenData && overriddenData.overriddenSecurityProfile) {
      showOverriddenData({
        user: overriddenData.overriddenSecurityProfile.overrideLog.user,
      })
    }
    // eslint-disable-next-line
  }, [overriddenData])

  useEffect(() => {
    getOverriddenData()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (overriddenData) {
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
    if (newIndex !== activeIndex) {
      setIsUpdating(true)
      dispatch(
        createNotification({
          message: 'Switching security profile. This will take a moment.',
        }),
      )

      const variables = {
        siteSlug: site,
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

  const mobileActive = tabs.find((label, id) => {
    return id === activeIndex
  })
  const mobileValue = {
    label: get(mobileActive, 'label'),
    value: activeIndex,
  }

  //  Removes "Profile" from Security profile name if it exists
  const getTabLabel = label => {
    const labelWords = label.split(' ')
    if (labelWords[labelWords.length - 1].toLowerCase() === 'profile') {
      labelWords.pop()
    }
    return labelWords.join(' ')
  }

  const tabsLimit = 5

  const showAsDropdown =
    isMobile ||
    tabs.length > tabsLimit ||
    (tabs.length <= tabsLimit && isWidthDown('md', width))

  const showConfirmDialog = () => {
    setIsCreateConfirm(true)
  }

  const hideCreateDialog = () => {
    setIsCreateConfirm(false)
  }

  const unauthMessage =
    'You do not have permissions to change the security profile'

  return (
    <Can I='update' on='Escalations' passThrough>
      {can => (
        <Paper
          square
          className={classes.paper}
          style={
            !isMobile && showAsDropdown ? { width: '75%', maxWidth: 400 } : {}
          }
        >
          {showAsDropdown ? (
            <SearchableSelectDropdown
              options={tabs.map(({ label, id }, index) => {
                return {
                  label,
                  value: id,
                  index,
                }
              })}
              onChange={({ index }) => {
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
              value={mobileValue}
              isSearchable={false}
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
        </Paper>
      )}
    </Can>
  )
}

SecurityProfileSelector.defaultProps = {
  showOverriddenData: () => {},
}

SecurityProfileSelector.propTypes = {
  showOverriddenData: PropTypes.func,
}

export default SecurityProfileSelector
