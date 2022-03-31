/* eslint-disable @typescript-eslint/no-non-null-assertion */

import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import Pause from 'ambient_ui/components/icons/contents/Pause'
import clsx from 'clsx'
import { Icon } from 'react-icons-kit'
import { plusCircle } from 'react-icons-kit/feather/plusCircle'
import { trash2 } from 'react-icons-kit/feather/trash2'
import { refreshCw } from 'react-icons-kit/feather/refreshCw'
import filter from 'lodash/filter'
import get from 'lodash/get'
import { SearchableSelectDropdown } from 'ambient_ui'
import { SiteOption } from 'ambient_ui/components/menus/SearchableSelectDropdown/types'
import { Grid, IconButton } from '@material-ui/core'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ActivePulse from 'components/ActivePulse'
import { ValueType } from 'react-select'
import Tooltip from 'components/Tooltip'

import { useStyles } from './styles'

interface Props {
  darkMode: boolean
  severities: SiteOption[]
  verificationTypes: SiteOption[]
  handleStatus: (
    alertId: number,
    status: string,
    securityProfileId: number,
  ) => void
  handleVerification: (
    alertId: number,
    verificationType: string | null,
    securityProfileId: number,
  ) => void
  handleSeverity: (
    alertId: number,
    severity: string,
    securityProfileId: number,
    revert: boolean,
  ) => void
  handleCreate: (defaultAlertId: number, securityProfileId: number) => void
  handleDelete: (alertId: number, securityProfileId: number) => void
  defaultAlertSeverity: string
  defaultAlertId: number
  securityProfileId: number
  alertId: number
  threatSignatureVerificationType: string
  alertSeverity: string
  alertVerificationType: string
  alertStatus: string
  verificationTypeOverride: string | null
  isDeployed: boolean
}

const RenderDefaultCell = ({
  darkMode,
  severities,
  verificationTypes,
  handleStatus,
  handleVerification,
  handleSeverity,
  handleCreate,
  handleDelete,
  defaultAlertSeverity,
  defaultAlertId,
  securityProfileId,
  alertId,
  threatSignatureVerificationType,
  alertSeverity,
  alertVerificationType,
  verificationTypeOverride,
  alertStatus,
  isDeployed,
}: Props): JSX.Element => {
  const { palette } = useTheme()
  const classes = useStyles({ darkMode })

  const handleStatusChange = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    value: string,
  ) => {
    if (value) {
      handleStatus(alertId, value, securityProfileId)
    }
  }

  const handleVerificationChange = (
    e: ValueType<SiteOption, boolean> | null,
  ) => {
    if (get(e, 'value', null) !== alertVerificationType)
      handleVerification(alertId, get(e, 'value', null), securityProfileId)
  }

  const handleSeverityChange = (e: ValueType<SiteOption, boolean> | null) => {
    if (get(e, 'value', null) !== alertSeverity)
      handleSeverity(alertId, get(e, 'value', null), securityProfileId, false)
  }

  const handleCreateAlert = () => {
    handleCreate(defaultAlertId, securityProfileId)
  }

  const handleDeleteAlert = () => {
    handleDelete(alertId, securityProfileId)
  }

  const handleRevertVerification = () => {
    handleVerification(alertId, null, securityProfileId)
  }

  const handleRevertSeverity = () => {
    handleSeverity(alertId, defaultAlertSeverity, securityProfileId, true)
  }

  if (!isDeployed) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
          width: 196,
        }}
      >
        <IconButton onClick={handleCreateAlert}>
          <Icon icon={plusCircle} size={40} />
        </IconButton>
      </div>
    )
  }

  const backgroundColor = () => {
    if (darkMode) {
      if (
        defaultAlertSeverity !== alertSeverity ||
        verificationTypeOverride !== null
      ) {
        return palette.grey[700]
      }
      return palette.grey[900]
    }
    if (
      defaultAlertSeverity !== alertSeverity ||
      verificationTypeOverride !== null
    ) {
      return palette.grey[100]
    }
    return palette.common.white
  }
  const revertSeverityTooltip =
    defaultAlertSeverity === alertSeverity
      ? 'Severity is set to default'
      : `Revert Severity back to ${
          filter(severities, ['value', defaultAlertSeverity])[0].label
        }`
  const revertVerificationTooltip =
    verificationTypeOverride === null
      ? 'Verification is set to default'
      : `Revert Verification back to ${
          filter(verificationTypes, [
            'value',
            threatSignatureVerificationType,
          ])[0].label
        }`

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 196,
        alignItems: 'center',
        backgroundColor: backgroundColor(),
        margin: -16,
        padding: 16,
      }}
    >
      <Grid container direction='column' spacing={1}>
        <Grid item>
          <div className={classes.dropdown}>
            <SearchableSelectDropdown
              options={severities}
              value={filter(severities, ['value', alertSeverity])}
              onChange={handleSeverityChange}
              isSearchable={false}
              menuPortalTarget={document.body}
              menuPlacement='auto'
            />

            <Tooltip content={revertSeverityTooltip}>
              <IconButton
                onClick={handleRevertSeverity}
                classes={{ root: classes.delete }}
                disabled={defaultAlertSeverity === alertSeverity}
              >
                <div
                  className={clsx(classes.revert, {
                    [classes.disabled]: defaultAlertSeverity === alertSeverity,
                  })}
                >
                  <Icon icon={refreshCw} size={16} />
                </div>
              </IconButton>
            </Tooltip>
          </div>
        </Grid>
        <Grid item>
          <div className={classes.dropdown}>
            <SearchableSelectDropdown
              options={verificationTypes}
              value={filter(verificationTypes, [
                'value',
                alertVerificationType,
              ])}
              onChange={handleVerificationChange}
              isSearchable={false}
              menuPortalTarget={document.body}
              menuPlacement='auto'
            />

            <Tooltip content={revertVerificationTooltip}>
              <IconButton
                onClick={handleRevertVerification}
                classes={{ root: classes.delete }}
                disabled={verificationTypeOverride === null}
              >
                <div
                  className={clsx(classes.revert, {
                    [classes.disabled]: verificationTypeOverride === null,
                  })}
                >
                  <Icon icon={refreshCw} size={16} />
                </div>
              </IconButton>
            </Tooltip>
          </div>
        </Grid>
        <Grid
          item
          style={{ width: '100%', display: 'flex', height: 'fit-content' }}
        >
          <ToggleButtonGroup
            value={alertStatus}
            exclusive
            onChange={handleStatusChange}
            aria-label='status'
            classes={{ root: classes.buttonGroup }}
          >
            <ToggleButton
              classes={{
                root: classes.buttonActive,
                selected: classes.buttonActiveSelected,
              }}
              value='active'
              aria-label='active'
            >
              <div style={{ paddingLeft: 4 }}>
                <ActivePulse isActive />
              </div>
            </ToggleButton>
            <ToggleButton
              classes={{
                root: classes.buttonTest,
                selected: classes.buttonTestSelected,
              }}
              value='test'
              aria-label='test'
            >
              <div style={{ paddingLeft: 4 }}>
                <ActivePulse variant='yellow' />
              </div>
            </ToggleButton>
            <ToggleButton
              classes={{
                root: classes.buttonDisabled,
                selected: classes.buttonDisabledSelected,
              }}
              value='disabled'
              aria-label='disabled'
            >
              <div style={{ paddingLeft: 2, paddingRight: 2 }}>
                <Pause width={12} height={12} stroke={palette.grey[700]} />
              </div>
            </ToggleButton>
          </ToggleButtonGroup>

          <Tooltip content='Delete Alert from Security Profile'>
            <IconButton
              onClick={handleDeleteAlert}
              classes={{ root: classes.delete }}
            >
              <div className={classes.deleteIcon}>
                <Icon icon={trash2} size={16} />
              </div>
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
    </div>
  )
}

export default RenderDefaultCell
