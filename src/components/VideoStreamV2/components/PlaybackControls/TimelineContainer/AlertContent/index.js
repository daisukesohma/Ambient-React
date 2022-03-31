import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import onClickOutside from 'react-onclickoutside'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { Icons } from 'ambient_ui'
import moment from 'moment'
import { useDispatch } from 'react-redux'
import get from 'lodash/get'
// src
import { ModalTypeEnum } from 'enums'
import { showModal } from 'redux/slices/modal'

import useStyles from './styles'

const propTypes = {
  alert: PropTypes.shape({
    alert: PropTypes.shape({
      name: PropTypes.string,
    }),
    alertInstances: PropTypes.arrayOf(
      PropTypes.shape({
        tsIdentifier: PropTypes.string,
        clip: PropTypes.string,
      }),
    ),
  }),
  positionX: PropTypes.number,
  handleToggleAlert: PropTypes.func,
}

const defaultProps = {
  alert: {
    alert: {
      name: '',
    },
    alertInstances: [
      {
        tsIdentifier: '',
        clip: '',
      },
    ],
  },
  positionX: 0,
  handleToggleAlert: () => {},
}

function AlertContent({ alert, handleToggleAlert, positionX }) {
  const { palette } = useTheme()
  const dispatch = useDispatch()
  const classes = useStyles({ positionX })
  const firstInstance = get(alert, 'alertInstances[0]')
  AlertContent.handleClickOutside = () => {
    handleToggleAlert(null)
  }
  return (
    <Card className={classes.card}>
      {firstInstance && (
        <CardContent className={classes.cardContent}>
          <div className={classes.cardHeader}>
            <div className={classes.cardTitle}>
              {alert.alert.name}
              <span className={classes.cardTimeStamp}>
                {moment
                  .unix(firstInstance.tsIdentifier / 1000)
                  .format('HH:mm:ss')}
              </span>
            </div>
            <div className={classes.cardActions}>
              <span
                onClick={() => {
                  dispatch(
                    showModal({
                      content: {
                        alertEvent: alert,
                      },
                      type: ModalTypeEnum.ALERT,
                    }),
                  )
                }}
              >
                <Icons.Info
                  width={20}
                  height={20}
                  stroke={palette.common.black}
                />
              </span>
              <span
                onClick={() => {
                  handleToggleAlert(null)
                }}
              >
                <Icons.Close
                  width={20}
                  height={20}
                  stroke={palette.common.black}
                />
              </span>
            </div>
          </div>
          <img alt='' src={firstInstance.clip} style={{ width: '100%' }} />
        </CardContent>
      )}
    </Card>
  )
}

AlertContent.propTypes = propTypes
AlertContent.defaultProps = defaultProps

const clickOutsideConfig = {
  handleClickOutside: () => AlertContent.handleClickOutside,
}

export default onClickOutside(AlertContent, clickOutsideConfig)
