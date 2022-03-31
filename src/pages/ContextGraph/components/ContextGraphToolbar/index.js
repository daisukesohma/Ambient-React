import React, { useCallback, useMemo, useState } from 'react'
import { useTheme } from '@material-ui/core/styles'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'
import find from 'lodash/find'
import includes from 'lodash/includes'
import { isMobileOnly } from 'react-device-detect'
import Paper from '@material-ui/core/Paper'
import { Icon as IconKit } from 'react-icons-kit'
import Modal from '@material-ui/core/Modal'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Popover from '@material-ui/core/Popover'
import { plus } from 'react-icons-kit/feather/plus'
import MuiButton from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import { useSelector, useDispatch } from 'react-redux'
import clsx from 'clsx'
// src
import { DropdownMenu, Icon } from 'ambient_ui'
import { upperFirst } from 'utils'
import { Can } from 'rbac'
import Tooltip from 'components/Tooltip'
import { SeverityTypeEnum, SeverityToReadableTextEnum } from 'enums'
import { useCursorStyles, useFlexStyles } from 'common/styles/commonStyles'
import ToolbarSearch from 'components/ToolbarSearch'
import {
  threatSignaturesSetSearch,
  setCreateAlertOpen,
  setCreateDefaultAlertOpen,
  filterActive,
  filterSeverity,
  // SP
  securityProfileCreateRequested,
  unSetPreviewMode,
} from 'redux/contextGraph/actions'
import ConfirmDialog from 'components/ConfirmDialog'
import useGlobalSelectedSite from 'common/hooks/useGlobalSelectedSite'

import ThreatSignatureDetailView from '../ThreatSignatureDetailView'
import CreateAlertForm from '../CreateAlertForm'

import ThreatCardList from './components/ThreatCardList'
import ToolbarStatus from './components/ToolbarStatus'
import useStyles from './styles'

const ContextGraphToolbar = () => {
  const { palette } = useTheme()
  const flexClasses = useFlexStyles()
  const [filterOpen, setFilterOpen] = useState(false)
  const darkMode = useSelector(state => state.settings.darkMode)
  const isDeployOpen = useSelector(state => state.contextGraph.createAlertOpen)
  const filterActiveSelected = useSelector(
    state => state.contextGraph.filterActiveSelected,
  )
  const filterSeveritySelected = useSelector(
    state => state.contextGraph.filterSeveritySelected,
  )
  const dispatch = useDispatch()
  const classes = useStyles({ isMobileOnly, filterOpen, isDeployOpen })
  const cursorClasses = useCursorStyles()
  const [createConfirmation, setCreateConfirmation] = useState(false)
  const [
    threatSignatureDetailViewAnchorEl,
    setThreatSignatureDetailViewAnchorEl,
  ] = useState(null)

  const previewMode = useSelector(state => state.contextGraph.previewMode)
  const [globalSelectedSite] = useGlobalSelectedSite()
  const sites = useSelector(state => state.contextGraph.sites)
  const search = useSelector(state => state.contextGraph.search)

  const hoveredThreatSignature = useSelector(
    state => state.contextGraph.hoveredAlert,
  )
  const activeThreatSignature = useSelector(
    state => state.contextGraph.activeAlert,
  )

  const createDefaultAlertOpen = useSelector(
    state => state.contextGraph.createDefaultAlertOpen,
  )
  const siteTypeName = useMemo(
    () => get(find(sites, { slug: globalSelectedSite }), 'siteType.name'),
    [sites, globalSelectedSite],
  )

  const isActiveThreatSignature = useCallback(
    tsAlertId => {
      return includes(
        [hoveredThreatSignature, activeThreatSignature],
        tsAlertId,
      )
    },
    [hoveredThreatSignature, activeThreatSignature],
  )

  const getTitle = () => {
    if (previewMode) {
      return 'Preview Threat Signatures'
    }
    if (isDeployOpen) {
      return 'Deploy Threat Signatures'
    }
    return 'Threat Signatures'
  }

  const getToolbarRightAdornment = () => {
    if (previewMode) {
      return (
        <Tooltip content='Exit'>
          <div
            className={cursorClasses.pointer}
            onClick={() => dispatch(unSetPreviewMode())}
          >
            <Icon icon='close' color={palette.grey[500]} size={24} />
          </div>
        </Tooltip>
      )
    }

    if (isDeployOpen) {
      return (
        <Tooltip content='Exit'>
          <div
            className={cursorClasses.pointer}
            onClick={() => dispatch(setCreateAlertOpen(false))}
          >
            <Icon icon='close' color={palette.grey[500]} size={24} />
          </div>
        </Tooltip>
      )
    }

    return <ToolbarStatus />
  }

  const activeMenuItems = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'disabled', label: 'Disabled' },
  ]

  const severityMenuItems = [
    { value: 'all', label: 'All' },
    {
      value: SeverityTypeEnum.SEV_0,
      label: upperFirst(SeverityToReadableTextEnum.sev0),
    },
    {
      value: SeverityTypeEnum.SEV_1,
      label: upperFirst(SeverityToReadableTextEnum.sev1),
    },
    {
      value: SeverityTypeEnum.SEV_2,
      label: upperFirst(SeverityToReadableTextEnum.sev2),
    },
  ]

  const handleSeveritySelect = option => {
    dispatch(filterSeverity({ value: option.value }))
  }

  const handleActiveSelect = option => {
    dispatch(filterActive({ value: option.value }))
  }

  const DEFAULT_FILTER_VALUE = 'all'
  const isFiltersClear =
    filterActiveSelected === DEFAULT_FILTER_VALUE &&
    filterSeveritySelected === DEFAULT_FILTER_VALUE

  const filterTitle = () => {
    let title = ''
    if (!isFiltersClear) {
      if (filterActiveSelected || filterSeveritySelected) title += ': '
      if (filterActiveSelected)
        title += `${upperFirst(filterActiveSelected)} Status`
      if (filterActiveSelected && filterSeveritySelected) title += ', '
      if (filterSeveritySelected) {
        if (filterSeveritySelected === DEFAULT_FILTER_VALUE) {
          title += upperFirst(DEFAULT_FILTER_VALUE)
        } else {
          title += upperFirst(
            SeverityToReadableTextEnum[filterSeveritySelected],
          )
        }
        title += ' Severity'
      }
    }

    return title
  }

  return (
    <Paper
      classes={{
        root: classes.paperDrawerDark,
      }}
      className={classes.drawerOpen}
      square
      variant='outlined'
      elevation={5}
      id='context-graph-toolbar'
    >
      <Box
        display='flex'
        alignItems='center'
        justifyContent='space-between'
        className={classes.titleWrapper}
        id='context-graph-toolbar-title'
      >
        <span className='am-body1'>{getTitle()}</span>
        <span>{getToolbarRightAdornment()}</span>
        <ConfirmDialog
          open={!isEmpty(createConfirmation)}
          onClose={() => setCreateConfirmation(false)}
          onConfirm={() => {
            dispatch(securityProfileCreateRequested(createConfirmation))
            setCreateConfirmation(false)
          }}
          content={`Do you want to create a security profile with ${
            siteTypeName ? `${siteTypeName} / ` : ''
          }${get(createConfirmation, 'variables.name', '')} threat model?`}
        />
      </Box>
      <ToolbarSearch
        search={search}
        setSearch={threatSignaturesSetSearch}
        darkMode
      />
      <Box onClick={() => setFilterOpen(!filterOpen)}>
        <div
          className={clsx(
            'am-body1',
            classes.filterContainer,
            flexClasses.row,
            flexClasses.centerBetween,
            cursorClasses.pointer,
          )}
        >
          <div
            className={clsx({
              [classes.selectedFilter]: !isFiltersClear,
            })}
          >
            <span>Filters</span>
            <span>{filterTitle()}</span>
          </div>
          <span>
            {filterOpen ? (
              <Icon icon='arrowUp' color={palette.grey[500]} size={24} />
            ) : (
              <Icon icon='arrowDown' color={palette.grey[500]} size={24} />
            )}
          </span>
        </div>
        {filterOpen && (
          <Grid container direction='row'>
            <div>
              <div className={clsx('am-subtitle2', classes.filterTitle)}>
                Status
              </div>
              <div className={classes.filterMenu}>
                <DropdownMenu
                  menuItems={activeMenuItems}
                  selectedItem={find(activeMenuItems, {
                    value: filterActiveSelected,
                  })}
                  handleSelection={handleActiveSelect}
                />
              </div>
            </div>
            <div>
              <div className={clsx('am-subtitle2', classes.filterTitle)}>
                Severity
              </div>
              <div className={classes.filterMenu}>
                <DropdownMenu
                  menuItems={severityMenuItems}
                  selectedItem={find(severityMenuItems, {
                    value: filterSeveritySelected,
                  })}
                  handleSelection={handleSeveritySelect}
                />
              </div>
            </div>
          </Grid>
        )}
        <div className={classes.divider}>
          <Divider classes={{ root: classes.dividerRoot }} />
        </div>
      </Box>
      <Box className={classes.listWrapper}>
        <ThreatCardList
          isActiveThreatSignature={isActiveThreatSignature}
          setThreatSignatureDetailViewAnchorEl={
            setThreatSignatureDetailViewAnchorEl
          }
        />
        <Popover
          open={threatSignatureDetailViewAnchorEl !== null}
          anchorEl={threatSignatureDetailViewAnchorEl}
          onClose={() => setThreatSignatureDetailViewAnchorEl(null)}
          anchorOrigin={{
            vertical: 'center',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'center',
            horizontal: 'right',
          }}
          classes={{ paper: classes.detailPopoverPaper }}
        >
          <ThreatSignatureDetailView
            onCancel={() => setThreatSignatureDetailViewAnchorEl(null)}
          />
        </Popover>
      </Box>
      {!isDeployOpen && (
        <Box
          display='flex'
          flexDirection='row'
          borderRight={1}
          alignItems='center'
          justifyContent='center'
          className={classes.createAlert}
          style={{ color: palette.grey[300] }}
        >
          {!previewMode && !isMobileOnly && (
            <Can I='is_internal' on='Admin'>
              <Box p={1}>
                <MuiButton
                  // color='inherit'
                  color='default'
                  startIcon={<IconKit icon={plus} size={18} />}
                  fullWidth
                  onClick={() => dispatch(setCreateDefaultAlertOpen(true))}
                >
                  {/* <span className={cursorClasses.clickableText}> */}
                  Create
                  {/* </span> */}
                </MuiButton>
              </Box>
            </Can>
          )}
          {!previewMode && (
            <Can I='update' on='ContextGraph'>
              <Box ml={5}>
                <MuiButton
                  // color='inherit'
                  color='default'
                  startIcon={
                    <Icon
                      icon='deployment'
                      color={palette.text.primary}
                      fill={palette.text.primary}
                      size={20}
                      viewBox='0 0 128 128'
                    />
                  }
                  fullWidth
                  onClick={() => dispatch(setCreateAlertOpen(true))}
                >
                  {/* <span className={cursorClasses.clickableText}> */}
                  Deploy
                  {/* </span> */}
                </MuiButton>
              </Box>
            </Can>
          )}
        </Box>
      )}
      <Modal
        open={createDefaultAlertOpen}
        onClose={() => dispatch(setCreateDefaultAlertOpen(false))}
      >
        <div>
          <CreateAlertForm />
        </div>
      </Modal>
    </Paper>
  )
}

export default ContextGraphToolbar
