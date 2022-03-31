import React, { useState, useEffect } from 'react'
import { useTheme } from '@material-ui/core/styles'
import { isMobileOnly } from 'react-device-detect'
import { useParams } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import { DropdownMenu, SearchableSelectDropdown } from 'ambient_ui'
import { useSelector, useDispatch } from 'react-redux'
import isEmpty from 'lodash/isEmpty'
import filter from 'lodash/filter'
import find from 'lodash/find'
import get from 'lodash/get'
import { edit2 } from 'react-icons-kit/feather/edit2'
import { trash2 } from 'react-icons-kit/feather/trash2'
import { plus } from 'react-icons-kit/feather/plus'
import { uploadCloud } from 'react-icons-kit/feather/uploadCloud'
import { Icon } from 'react-icons-kit'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import Alert from '@material-ui/lab/Alert'
import Typography from '@material-ui/core/Typography'
import AlertTitle from '@material-ui/lab/AlertTitle'
import clsx from 'clsx'
// src
import useGlobalSelectedSite from 'common/hooks/useGlobalSelectedSite'
import SimpleLabel from '../../../../components/Label/SimpleLabel'
import Tooltip from '../../../../components/Tooltip'
import { Can } from '../../../../rbac'
import {
  alertsFetchSucceeded,
  // SP
  unSetPreviewMode,
  selectSecurityProfile,
} from '../../../../redux/contextGraph/actions'
import dropDownOptions from '../../../../selectors/sites/dropDownOptions'
import securityProfilesDropDownOptions from '../../../../selectors/contextGraph/dropDownOptions'
import { useFlexStyles } from '../../../../common/styles/commonStyles'

import DeleteSecurityProfileDialog from './components/DeleteSecurityProfileDialog'
import CreateSecurityProfilePopover from './components/CreateSecurityProfilePopover'
import RenameSecurityProfile from './components/RenameSecurityProfile'
import CreateSecurityProfile from './components/CreateSecurityProfile'
import SaveSecurityProfile from './components/SaveSecurityProfile'
import useStyles from './styles'

const ContextGraphProfileSelector = () => {
  const { palette } = useTheme()
  const { account } = useParams()
  const flexClasses = useFlexStyles()
  const [deleteConfirmation, setDeleteConfirmation] = useState(false)
  const [renameProfileOpen, setRenameProfileOpen] = useState(false)
  const [newProfileName, setNewProfileName] = useState(null)

  const [createProfileAnchorEl, setCreateProfileAnchorEl] = useState(null)
  const [createProfileOpen, setCreateProfileOpen] = useState(false)

  const [saveThreatModelOpen, setSaveThreatModelOpen] = useState(false)
  const [isThreatModelPublic, setIsThreatModelPublic] = useState(false)

  const [selectedDefaultProfile, setSelectedDefaultProfile] = useState(null)

  const [globalSelectedSite, setGlobalSelectedSite] = useGlobalSelectedSite()
  const dispatch = useDispatch()
  const classes = useStyles({ isMobileOnly })

  const darkMode = useSelector(state => state.settings.darkMode)
  const siteOptions = useSelector(
    dropDownOptions([state => state.contextGraph.sites]),
  )
  const profileOptions = useSelector(securityProfilesDropDownOptions)
  const securityProfiles = useSelector(
    state => state.contextGraph.securityProfiles,
  )
  const activeSecurityProfile = useSelector(
    state => state.contextGraph.activeProfile,
  )
  const defaultSecurityProfiles = useSelector(
    state => state.contextGraph.defaultProfiles,
  )

  const previewMode = useSelector(state => state.contextGraph.previewMode)

  useEffect(() => {
    dispatch(alertsFetchSucceeded([]))
  }, [dispatch, activeSecurityProfile])

  const activeSite = find(siteOptions, { value: globalSelectedSite })

  const handleSiteChange = item => {
    if (isEmpty(item)) return
    const { value } = item
    setGlobalSelectedSite(value)
    dispatch(selectSecurityProfile(null))
  }

  const handleProfileChange = item => {
    if (isEmpty(item)) return
    dispatch(selectSecurityProfile(find(securityProfiles, { id: item.value })))
  }

  const threatModelColumns = [
    {
      title: 'Ambient library',
      threatModels:
        defaultSecurityProfiles &&
        filter(defaultSecurityProfiles, threatModel => !threatModel.account),
    },
    {
      title: `${account} library`,
      threatModels:
        defaultSecurityProfiles &&
        filter(defaultSecurityProfiles, threatModel => threatModel.account),
    },
  ]

  return (
    <Grid
      container
      direction='row'
      justify='space-between'
      alignItems='center'
      className={classes.wrapper}
      id='profile-selector-root'
    >
      <Grid item xs={isMobileOnly ? 12 : 'auto'}>
        {previewMode ? (
          <Box
            className={clsx(flexClasses.row, flexClasses.centerStart)}
            ml={2.5}
          >
            <span
              className='am-overline'
              style={{ color: palette.common.greenBluePastel, marginRight: 16 }}
            >
              Currently Previewing
            </span>
            <span>{get(activeSecurityProfile, 'name')}</span>
            <span>
              <SimpleLabel>Security Profile</SimpleLabel>
            </span>
            <span style={{ marginRight: 4 }}>on</span>
            <span>{activeSite.label}</span>
          </Box>
        ) : (
          <SearchableSelectDropdown
            id='threatSignatures-siteSelector'
            options={siteOptions}
            value={find(siteOptions, { value: globalSelectedSite })}
            onChange={handleSiteChange}
            classOverride={classes.graphDropDowns}
          />
        )}
      </Grid>

      {!isEmpty(globalSelectedSite) && (
        <Grid item>
          <Grid
            container
            alignItems='center'
            justify='center'
            style={{
              paddingRight: activeSecurityProfile && !isMobileOnly ? 10 : 0,
            }}
          >
            {previewMode ? (
              <>
                <Box mr={2.0}>
                  <Button
                    variant='outlined'
                    color='primary'
                    onClick={() => dispatch(unSetPreviewMode())}
                  >
                    Cancel
                  </Button>
                </Box>

                <Box>
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={() => {
                      setCreateProfileOpen(true)
                    }}
                  >
                    Deploy
                  </Button>
                </Box>
              </>
            ) : (
              <>
                <Grid item>
                  <DropdownMenu
                    id='threatSignatures-profileSelector'
                    menuItems={profileOptions}
                    selectedItem={find(profileOptions, {
                      value: get(activeSecurityProfile, 'id'),
                    })}
                    handleSelection={handleProfileChange}
                    classOverride={classes.graphDropDowns}
                  />
                </Grid>
                {!isMobileOnly && (
                  <Grid item>
                    <Can I='update' on='ContextGraph'>
                      <Grid container alignItems='center'>
                        <Box ml={1.0}>
                          <Tooltip content='Rename'>
                            <span>
                              <IconButton
                                disabled={!activeSecurityProfile}
                                className={classes.securityProfileControlIcon}
                                onClick={() => setRenameProfileOpen(true)}
                              >
                                <Icon icon={edit2} size={16} />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </Box>
                        <Box>
                          <Tooltip content='Add New'>
                            <span>
                              <IconButton
                                className={classes.securityProfileControlIcon}
                                onClick={e =>
                                  setCreateProfileAnchorEl(e.currentTarget)
                                }
                              >
                                <Icon icon={plus} size={16} />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </Box>
                        <Box>
                          <Tooltip content='Save'>
                            <span>
                              <IconButton
                                disabled={!activeSecurityProfile}
                                className={classes.securityProfileControlIcon}
                                onClick={() => setSaveThreatModelOpen(true)}
                              >
                                <Icon icon={uploadCloud} size={16} />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </Box>
                        <Box>
                          <Tooltip content='Delete'>
                            <span>
                              <IconButton
                                disabled={!activeSecurityProfile}
                                onClick={() => {
                                  setDeleteConfirmation(true)
                                }}
                                className={classes.securityProfileControlIcon}
                              >
                                <Icon
                                  icon={trash2}
                                  size={16}
                                  style={{ color: palette.error.main }}
                                />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </Box>
                      </Grid>
                    </Can>
                  </Grid>
                )}
                {isMobileOnly && (
                  <Alert severity='warning' className={classes.alertPanel}>
                    <AlertTitle>You are not allowed to:</AlertTitle>
                    <Typography className={classes.alertText}>
                      Create a signature
                    </Typography>
                    <Typography className={classes.alertText}>
                      Edit security profiles
                    </Typography>
                  </Alert>
                )}
              </>
            )}
          </Grid>
        </Grid>
      )}
      <DeleteSecurityProfileDialog
        deleteConfirmation={deleteConfirmation}
        setDeleteConfirmation={setDeleteConfirmation}
        activeSecurityProfile={activeSecurityProfile}
      />
      <CreateSecurityProfilePopover
        createProfileAnchorEl={createProfileAnchorEl}
        setCreateProfileAnchorEl={setCreateProfileAnchorEl}
        setSelectedDefaultProfile={setSelectedDefaultProfile}
        setCreateProfileOpen={setCreateProfileOpen}
        threatModelColumns={threatModelColumns}
      />
      <RenameSecurityProfile
        setRenameProfileOpen={setRenameProfileOpen}
        renameProfileOpen={renameProfileOpen}
        newProfileName={newProfileName}
        setNewProfileName={setNewProfileName}
      />
      <CreateSecurityProfile
        createProfileOpen={createProfileOpen}
        newProfileName={newProfileName}
        selectedDefaultProfile={selectedDefaultProfile}
        setCreateProfileOpen={setCreateProfileOpen}
        setNewProfileName={setNewProfileName}
      />
      <SaveSecurityProfile
        activeSecurityProfile={activeSecurityProfile}
        isThreatModelPublic={isThreatModelPublic}
        newProfileName={newProfileName}
        saveThreatModelOpen={saveThreatModelOpen}
        setIsThreatModelPublic={setIsThreatModelPublic}
        setNewProfileName={setNewProfileName}
        setSaveThreatModelOpen={setSaveThreatModelOpen}
      />
    </Grid>
  )
}

export default ContextGraphProfileSelector
