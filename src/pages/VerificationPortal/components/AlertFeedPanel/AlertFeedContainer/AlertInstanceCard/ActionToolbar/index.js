import React, { useState } from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import CircularProgress from '@material-ui/core/CircularProgress'
import IconButton from '@material-ui/core/IconButton'
import Grid from '@material-ui/core/Grid'
import get from 'lodash/get'
import { ic_more_horiz } from 'react-icons-kit/md/ic_more_horiz'
// src
import { Icon, Icons, OptionMenu } from 'ambient_ui'
import { Icon as IconKit } from 'react-icons-kit'
import {
  confirmVerifyAlertInstance,
  verifyAlertRequested,
} from 'pages/VerificationPortal/redux/verificationSlice'
import { AlertInstanceAction } from 'pages/VerificationPortal/constants'
import TooltipText from 'components/Tooltip/TooltipText'
import AlertVMSModal from 'components/Modals/AlertVMSModal'
import { parseLatLng } from 'utils'
import Tooltip from 'components/Tooltip'
import useDelay from 'common/hooks/useDelay'
import { msToUnix } from '../../../../../../../utils'

const { Check, CloseOctagon } = Icons

const propTypes = {
  alertInstance: PropTypes.object,
}

const defaultProps = {
  alertInstance: null,
}

function ActionToolbar({ alertInstance }) {
  const { palette } = useTheme()
  const active = useDelay(3000)
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch()

  const performAction = status => {
    const { id: alertInstanceId, alertHash } = alertInstance
    dispatch(verifyAlertRequested({ alertInstanceId, alertHash, status }))
  }

  const { stream, tsIdentifier, alert, alertHash } = alertInstance
  const ts = msToUnix(tsIdentifier)
  const coordinates = parseLatLng(alert.site.latlng)

  const menuItems = [
    {
      label: 'Mark Stale',
      value: 'markStale',
      onClick: () => performAction(AlertInstanceAction.STALE),
    },
  ]

  return (
    <Grid
      container
      justify='space-evenly'
      alignItems='center'
      style={{ minHeight: 40 }}
    >
      {alertInstance.verifyLoading && (
        <Grid item>
          <CircularProgress color='primary' size={24} />
        </Grid>
      )}

      {!alertInstance.verifyLoading && (
        <>
          <Grid item>
            <Tooltip
              placement='bottom'
              content={<TooltipText>Dismiss</TooltipText>}
            >
              <IconButton
                onClick={() => performAction(AlertInstanceAction.DISMISS)}
                disabled={!active}
              >
                <CloseOctagon
                  stroke={active ? palette.error.main : palette.grey[500]}
                  width={24}
                  height={24}
                />
              </IconButton>
            </Tooltip>
          </Grid>

          <Grid item>
            <Tooltip
              placement='bottom'
              content={<TooltipText>View Details</TooltipText>}
            >
              <IconButton onClick={() => setOpen(true)} disabled={!active}>
                <Icon
                  icon='eye'
                  color={active ? palette.common.white : palette.grey[500]}
                />
              </IconButton>
            </Tooltip>
          </Grid>

          <AlertVMSModal
            open={open}
            onClose={() => {
              setOpen(false)
            }}
            handleClose={() => {
              setOpen(false)
            }}
            accountSlug={get(alert, 'site.account.slug')}
            alertInstances={[alertInstance]}
            isHigh={false}
            alertEventId={alert.id}
            alertEventHash={alertHash}
            siteSlug={get(alert, 'site.slug')}
            streamId={get(stream, 'id')}
            nodeId={get(stream, 'node.identifier')}
            timezone={get(alert, 'site.timezone')}
            initTs={ts}
            siteName={get(alert, 'site.name')}
            streamName={get(stream, 'name')}
            alertTs={ts}
            coordinates={coordinates}
            alertName={alert.name}
            hideAlertTimeline={true}
            hideAlertModalControls={true}
            hideResponderList={true}
            canRecall={get(alertInstance, 'canRecall', false)}
          />

          <Grid item>
            <OptionMenu
              customIconContainer={false}
              darkMode
              icon={
                <Tooltip content={<TooltipText>More Actions</TooltipText>}>
                  <IconButton color='inherit' disabled={!active}>
                    <IconKit
                      icon={ic_more_horiz}
                      style={{
                        color: active
                          ? palette.common.white
                          : palette.grey[500],
                      }}
                      size={24}
                    />
                  </IconButton>
                </Tooltip>
              }
              menuItems={menuItems}
              noBackground
            />
          </Grid>

          <Grid item>
            <Tooltip
              placement='bottom'
              content={<TooltipText>Verify</TooltipText>}
            >
              <IconButton
                onClick={() => {
                  dispatch(confirmVerifyAlertInstance({ alert: alertInstance }))
                }}
                disabled={!active}
              >
                <Check
                  stroke={active ? palette.primary.main : palette.grey[500]}
                />
              </IconButton>
            </Tooltip>
          </Grid>
        </>
      )}
    </Grid>
  )
}

ActionToolbar.propTypes = propTypes
ActionToolbar.defaultProps = defaultProps

export default ActionToolbar
