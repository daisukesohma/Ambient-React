import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import Popover from '@material-ui/core/Popover'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import { Icon } from 'react-icons-kit'
import Divider from '@material-ui/core/Divider'
import { plus } from 'react-icons-kit/feather/plus'
import Box from '@material-ui/core/Box'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import clsx from 'clsx'
import get from 'lodash/get'
import map from 'lodash/map'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
// src
import useGlobalSelectedSite from 'common/hooks/useGlobalSelectedSite'
import { useCursorStyles } from 'common/styles/commonStyles'
import { setPreview } from 'redux/contextGraph/actions'

import useStyles from './styles'

function CreateSecurityProfilePopover({
  createProfileAnchorEl,
  setCreateProfileAnchorEl,
  setCreateProfileOpen,
  setSelectedDefaultProfile,
  threatModelColumns,
}) {
  const { palette } = useTheme()
  const [globalSelectedSite] = useGlobalSelectedSite()
  const dispatch = useDispatch()
  const { account } = useParams()

  const classes = useStyles({ darkMode: true })
  const cursorClasses = useCursorStyles()

  const handleAdd = () => {
    setSelectedDefaultProfile(null)
    setCreateProfileOpen(true)
    setCreateProfileAnchorEl(null)
  }

  const handleSelect = threat => {
    setSelectedDefaultProfile(threat)
    dispatch(
      setPreview({
        accountSlug: account,
        siteSlug: globalSelectedSite,
        name: threat.name,
        defaultSecurityProfileId: get(threat, 'id'),
        alerts: threat.defaultAlerts
          ? map(threat.defaultAlerts, alert => {
              return {
                name: alert.threatSignature.name,
                streams: [],
                ...alert,
              }
            })
          : [],
      }),
    )

    // setSelectedDefaultProfile(threat)
    // setCreateProfileOpen(true)
    setCreateProfileAnchorEl(null)
  }

  return (
    <Popover
      open={Boolean(createProfileAnchorEl)}
      anchorEl={createProfileAnchorEl}
      onClose={() => {
        setCreateProfileAnchorEl(null)
      }}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      classes={{ paper: classes.root }}
    >
      <Grid
        container
        style={{ minWidth: 400, maxWidth: 600, textAlign: 'center' }}
      >
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <Button
            color='default'
            startIcon={
              <span style={{ marginTop: -4 }}>
                <Icon icon={plus} size={14} />
              </span>
            }
            fullWidth
            onClick={handleAdd}
          >
            <div
              className={clsx(
                'am-subtitle2',
                classes.addNewButton,
                cursorClasses.clickableText,
              )}
            >
              Add New Security Profile
            </div>
          </Button>
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <Divider variant='fullWidth' light />
        </Grid>
        {map(threatModelColumns, (column, index) => (
          <Grid item lg={6} md={6} sm={6} xs={6} key={`col-${index}`}>
            <Box
              display='flex'
              flexDirection='column'
              alignItems='center'
              borderColor={palette.grey[500]}
            >
              <Box p={1}>
                <div className='am-overline'>
                  {column.title}
                </div>
              </Box>
              <Box>
                <List>
                  {column.threatModels &&
                    map(column.threatModels, (threatModel, modelIndex) => (
                      <ListItem
                        style={{ paddingTop: 0, paddingBottom: 0 }}
                        key={`threat-${modelIndex}`}
                      >
                        <ListItemText>
                          <Button
                            color='primary'
                            fullWidth
                            onClick={() => handleSelect(threatModel)}
                          >
                            {threatModel.name}
                          </Button>
                        </ListItemText>
                      </ListItem>
                    ))}
                </List>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Popover>
  )
}

CreateSecurityProfilePopover.propTypes = {
  createProfileAnchorEl: PropTypes.object,
  setCreateProfileAnchorEl: PropTypes.func,
  setCreateProfileOpen: PropTypes.func,
  setSelectedDefaultProfile: PropTypes.func,
  threatModelColumns: PropTypes.array,
}

export default CreateSecurityProfilePopover
