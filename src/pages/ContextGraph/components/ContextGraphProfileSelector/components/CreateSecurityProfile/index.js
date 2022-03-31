import React from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import Box from '@material-ui/core/Box'
import Modal from '@material-ui/core/Modal'
import Paper from '@material-ui/core/Paper'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from 'ambient_ui'
import get from 'lodash/get'
import clsx from 'clsx'
// src
import useGlobalSelectedSite from 'common/hooks/useGlobalSelectedSite'
import { securityProfileCreateRequested } from 'redux/contextGraph/actions'

import useStyles from './styles'

function CreateSecurityProfile({
  createProfileOpen,
  newProfileName,
  selectedDefaultProfile,
  setCreateProfileOpen,
  setNewProfileName,
}) {
  const { account } = useParams()
  const classes = useStyles({ darkMode: true })
  const dispatch = useDispatch()
  const [globalSelectedSite] = useGlobalSelectedSite()
  const activeSecurityProfile = useSelector(
    state => state.contextGraph.activeProfile,
  )
  const previewMode = useSelector(state => state.contextGraph.previewMode)

  return (
    <Modal open={createProfileOpen} onClose={() => setCreateProfileOpen(false)}>
      <Paper className={classes.modal}>
        <Box display='flex' flexDirection='column'>
          <div className={clsx('am-h5', classes.title)}>
            Create{' '}
            {selectedDefaultProfile
              ? `Security Profile from "${selectedDefaultProfile.name}" Threat Model`
              : `New`}
          </div>
          <Box width={1} mt={1.5}>
            <FormControl fullWidth>
              <Input
                autoFocus
                placeholder='New Security Profile Name'
                value={newProfileName}
                label={
                  selectedDefaultProfile
                    ? `Rename "${selectedDefaultProfile.name}" as...`
                    : null
                }
                onChange={e => {
                  setNewProfileName(e.target.value)
                }}
                classes={{
                  input: classes.inputText,
                }}
              />
            </FormControl>
          </Box>
          <Box
            display='flex'
            flexDirection='row'
            alignItems='flex-end'
            justifyContent='flex-end'
            mt={2.0}
          >
            <Box ml={2}>
              <Button
                variant='text'
                color='primary'
                onClick={() => {
                  setCreateProfileOpen(false)
                }}
              >
                Cancel
              </Button>
            </Box>
            <Box>
              <Button
                color='primary'
                variant='contained'
                disabled={!newProfileName}
                onClick={() => {
                  if (previewMode) {
                    dispatch(
                      securityProfileCreateRequested({
                        ...activeSecurityProfile,
                        name: newProfileName,
                      }),
                    )
                  } else {
                    dispatch(
                      securityProfileCreateRequested({
                        accountSlug: account,
                        siteSlug: globalSelectedSite,
                        name: newProfileName,
                        defaultSecurityProfileId: get(
                          selectedDefaultProfile,
                          'id',
                        ),
                      }),
                    )
                  }

                  setCreateProfileOpen(false)
                  setNewProfileName(null)
                }}
              >
                Save
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Modal>
  )
}

CreateSecurityProfile.propTypes = {
  createProfileOpen: PropTypes.bool,
  newProfileName: PropTypes.string,
  selectedDefaultProfile: PropTypes.object,
  setCreateProfileOpen: PropTypes.func,
  setNewProfileName: PropTypes.func,
}

export default CreateSecurityProfile
