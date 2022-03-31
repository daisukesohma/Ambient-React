import React from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import Box from '@material-ui/core/Box'
import Modal from '@material-ui/core/Modal'
import Paper from '@material-ui/core/Paper'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import { useDispatch, useSelector } from 'react-redux'
import get from 'lodash/get'
import clsx from 'clsx'
import { Can } from 'rbac'
// src
import { Button } from 'ambient_ui'
import {
  securityProfileCreateRequested,
  saveThreatModelRequested,
} from 'redux/contextGraph/actions'

import useStyles from './styles'

function SaveSecurityProfile({
  activeSecurityProfile,
  isThreatModelPublic,
  newProfileName,
  saveThreatModelOpen,
  setIsThreatModelPublic,
  setNewProfileName,
  setSaveThreatModelOpen,
}) {
  const { account } = useParams()
  const classes = useStyles({ darkMode: true })
  const dispatch = useDispatch()

  const handleSave = () => {
    if (activeSecurityProfile.id) {
      dispatch(
        saveThreatModelRequested({
          securityProfileId: activeSecurityProfile.id,
          name: newProfileName,
          isPublic: isThreatModelPublic,
        }),
      )
    } else {
      dispatch(
        securityProfileCreateRequested({
          name: newProfileName,
          isPublic: isThreatModelPublic,
          ...activeSecurityProfile,
        }),
      )
    }

    setSaveThreatModelOpen(false)
    setNewProfileName(null)
  }

  return (
    <Modal
      open={saveThreatModelOpen}
      onClose={() => setSaveThreatModelOpen(false)}
    >
      <Paper className={classes.modal}>
        <Box display='flex' flexDirection='column'>
          <div className={clsx('am-h5', classes.title)}>Save Threat Model</div>
          <Box width={1} mt={1.5}>
            <FormControl fullWidth>
              <Input
                autoFocus
                onChange={e => {
                  setNewProfileName(e.target.value)
                }}
                placeholder={
                  activeSecurityProfile
                    ? `Rename "${activeSecurityProfile.name}" as...`
                    : null
                }
                fullWidth
                classes={{
                  input: classes.inputText,
                }}
              />
            </FormControl>
          </Box>
          <Can I='is_internal' on='Admin'>
            <Box mt={1} mb={1}>
              <Box>
                <FormControlLabel
                  control={
                    <Checkbox
                      classes={{ root: classes.checkboxRoot }}
                      checked={isThreatModelPublic}
                      disableRipple
                      size='small'
                      onChange={e => {
                        setIsThreatModelPublic(e.target.checked)
                      }}
                    />
                  }
                  label={
                    <span
                      className={clsx(
                        'am-subtitle2',
                        classes.checkboxLabelText,
                      )}
                    >
                      Public
                    </span>
                  }
                />
              </Box>
              <Box>
                {isThreatModelPublic ? (
                  <div className={clsx('am-caption', classes.subtitleText)}>
                    Public signatures are part of the Ambient library and can be
                    applied on any account and any site.
                  </div>
                ) : (
                  <div className={clsx('am-caption', classes.subtitleText)}>
                    Private. This threat signature definition will be available
                    only on sites within the {account} account.
                  </div>
                )}
              </Box>
            </Box>
          </Can>
          <Box
            display='flex'
            flexDirection='row'
            alignItems='center'
            justifyContent='flex-end'
            mt={2.0}
          >
            <Box ml={2}>
              <Button
                variant='text'
                color='primary'
                onClick={() => {
                  setSaveThreatModelOpen(false)
                }}
              >
                Cancel
              </Button>
            </Box>
            <Box>
              <Button
                color='primary'
                variant='contained'
                disabled={
                  !!(!newProfileName && get(activeSecurityProfile, 'id', false))
                }
                onClick={handleSave}
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

SaveSecurityProfile.propTypes = {
  activeSecurityProfile: PropTypes.object,
  isThreatModelPublic: PropTypes.bool,
  newProfileName: PropTypes.string,
  saveThreatModelOpen: PropTypes.bool,
  setIsThreatModelPublic: PropTypes.func,
  setNewProfileName: PropTypes.func,
  setSaveThreatModelOpen: PropTypes.func,
}

export default SaveSecurityProfile
