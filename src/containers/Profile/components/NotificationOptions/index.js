import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import Grid from '@material-ui/core/Grid'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import clsx from 'clsx'
import { Icon } from 'ambient_ui'
import { Icon as IconKit } from 'react-icons-kit'
import { email } from 'react-icons-kit/entypo/email'
import { ic_textsms as icTextSms } from 'react-icons-kit/md/ic_textsms'

import useStyles from './styles'

const NotificationOptions = ({
  notificationMethodsOptions,
  _hmNotificationsOptIn,
  onInputChange,
  setHMNotificationsOptIn,
}) => {
  const { palette } = useTheme()
  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({ darkMode })

  const getIcon = label => {
    if (label === 'CALL') {
      return <Icon icon='phone' color={palette.grey[500]} />
    }
    if (label === 'EMAIL') {
      return (
        <span
          style={{
            color: palette.grey[500],
            width: 24,
            height: 24,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <IconKit icon={email} size={20} />
        </span>
      )
    }
    if (label === 'TEXT') {
      return (
        <span
          style={{
            color: palette.grey[500],
            width: 24,
            height: 24,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <IconKit icon={icTextSms} size={20} />
        </span>
      )
    }

    return null
  }

  const getCheckedIcon = label => {
    if (label === 'CALL') {
      return <Icon icon='phone' color={palette.primary.main} />
    }
    if (label === 'EMAIL') {
      return (
        <span
          style={{
            color: palette.primary.main,
            width: 24,
            height: 24,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <IconKit icon={email} size={20} />
        </span>
      )
    }
    if (label === 'TEXT') {
      return (
        <span
          style={{
            color: palette.primary.main,
            width: 24,
            height: 24,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <IconKit icon={icTextSms} size={20} />
        </span>
      )
    }
    return null
  }

  const selectedValues = notificationMethodsOptions
    .map(option =>
      _hmNotificationsOptIn.find(item => item.value === option.value),
    )
    .filter(option => !!option)
    .map(option => option.label)

  return (
    <Grid container className={classes.container}>
      <Grid item lg={12} md={12} sm={12} xs={12}>
        <div className={clsx('am-body1', classes.notificationTitle)}>
          Receive Notifications By
        </div>
        <div className={classes.notificationContainer}>
          {notificationMethodsOptions.map(({ value, label }) => {
            const isSelected = !!_hmNotificationsOptIn.find(
              item => item.value === value,
            )

            return (
              <div style={{ marginRight: 16 }} key={label}>
                <FormControlLabel
                  control={
                    <Checkbox
                      disableRipple
                      icon={getIcon(label)}
                      checkedIcon={getCheckedIcon(label)}
                      checked={isSelected}
                      onChange={event => {
                        let newItems = [..._hmNotificationsOptIn]
                        if (
                          _hmNotificationsOptIn.find(
                            item => item.value === value,
                          )
                        ) {
                          newItems = newItems.filter(i => i.value !== value)
                        } else {
                          newItems.push({ value, label })
                        }
                        onInputChange(setHMNotificationsOptIn, newItems)
                      }}
                    />
                  }
                  label={
                    <div
                      className={clsx(
                        'am-subtitle2',
                        isSelected ? classes.labelSelected : classes.labelText,
                      )}
                    >
                      {label}
                    </div>
                  }
                  key={value}
                />
              </div>
            )
          })}
        </div>
        <div className={clsx('am-caption', classes.labelText)}>
          <span>
            {selectedValues.length === 0
              ? 'You are not receiving notifications.'
              : 'You are receiving notifications by '}
          </span>
          {selectedValues.length > 0 && (
            <span>
              {selectedValues.map((label, index) => {
                if (selectedValues.length === 1) {
                  return `${label.toLowerCase()}.`
                }
                if (index === selectedValues.length - 1) {
                  return `and ${label.toLowerCase()}.`
                }
                return `${label.toLowerCase()}, `
              })}
            </span>
          )}
        </div>
      </Grid>
    </Grid>
  )
}

NotificationOptions.defaultProps = {
  notificationMethodsOptions: [],
  _hmNotificationsOptIn: [],
  onInputChange: () => {},
  setHMNotificationsOptIn: () => {},
}

NotificationOptions.propTypes = {
  notificationMethodsOptions: PropTypes.array,
  _hmNotificationsOptIn: PropTypes.array,
  onInputChange: PropTypes.func,
  setHMNotificationsOptIn: PropTypes.func,
}

export default NotificationOptions
