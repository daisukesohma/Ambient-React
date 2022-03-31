import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'
import { Grid, Box } from '@material-ui/core'
import { get } from 'lodash'
// src
import { SettingsOptionMenu } from 'ambient_ui'
import { Can } from 'rbac'
import { setEditableTable } from 'redux/cameras/actions'

import PageTitle from 'components/Page/Title'

import SiteSelector from './components/SiteSelector'
import CameraTableContainer from './components/CameraTableContainer'
import CameraStatusContainer from './components/CameraStatusContainer'
import useStyles from './styles'

export default function Endpoints() {
  const { palette } = useTheme()
  const { account } = useParams()
  const dispatch = useDispatch()
  const history = useHistory()
  const darkMode = useSelector(state => state.settings.darkMode)
  const isInternal = useSelector(state => get(state, 'auth.user.internal'))
  const editable = useSelector(state => state.cameras.editable)
  const classes = useStyles()

  const staffMenuOption = isInternal
    ? [
        {
          label: editable ? 'Cancel Edit Sites' : 'Edit Sites',
          value: 'EditSites',
          onClick: () => {
            dispatch(setEditableTable({ editable: !editable }))
          },
          hoverColor: palette.secondary.main,
        },
      ]
    : [{}]

  const settingsMenuOptions = [
    {
      label: 'Stream Configuration',
      value: 'StreamConfiguration',
      onClick: () =>
        history.push(
          `/accounts/${account}/infrastructure/cameras/stream-configuration`,
        ),
      hoverColor: palette.secondary.main,
    },
    ...staffMenuOption,
  ]

  return (
    <div>
      <Grid container justify='space-between'>
        <Box mb={3}>
          <PageTitle title='Cameras' darkMode={darkMode} />
        </Box>
        <Box mb={3}>
          <Can I='view' on='StreamConfiguration'>
            <SettingsOptionMenu
              menuItems={settingsMenuOptions}
              darkMode={darkMode}
              textClass='am-caption'
            />
          </Can>
        </Box>
      </Grid>
      <div className={classes.statusContainer}>
        <SiteSelector classOverride={classes.siteSelectorContainer} />
        <CameraStatusContainer />
      </div>
      <CameraTableContainer />
    </div>
  )
}
