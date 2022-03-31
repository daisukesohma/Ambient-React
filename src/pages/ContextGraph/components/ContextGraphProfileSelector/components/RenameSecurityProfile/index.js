import React from 'react'
import PropTypes from 'prop-types'
import Box from '@material-ui/core/Box'
import Modal from '@material-ui/core/Modal'
import Paper from '@material-ui/core/Paper'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from 'ambient_ui'
import get from 'lodash/get'
import clsx from 'clsx'

import { securityProfileUpdateRequested } from '../../../../../../redux/contextGraph/actions'
import { useFlexStyles } from '../../../../../../common/styles/commonStyles'

import useStyles from './styles'

function RenameSecurityProfile({
  newProfileName,
  renameProfileOpen,
  setNewProfileName,
  setRenameProfileOpen,
}) {
  const classes = useStyles({ darkMode: true })
  const flexClasses = useFlexStyles()
  const dispatch = useDispatch()
  const activeSecurityProfile = useSelector(
    state => state.contextGraph.activeProfile,
  )

  const handleSave = () => {
    dispatch(
      securityProfileUpdateRequested({
        securityProfileId: activeSecurityProfile.id,
        name: newProfileName,
      }),
    )
    setRenameProfileOpen(false)
    setNewProfileName(null)
  }

  return (
    <Modal
      open={renameProfileOpen}
      onClose={() => {
        setRenameProfileOpen(false)
      }}
    >
      <Paper className={classes.modal}>
        <div>
          <div className={clsx('am-h5', classes.title)}>
            Rename Security Profile
          </div>
          <div>
            <span className={clsx('am-subtitle2', classes.label)}>
              Current Name
            </span>
            <span className={clsx('am-body1', classes.value)}>
              {' '}
              {get(activeSecurityProfile, 'name')}
            </span>
          </div>
          <div className={clsx(flexClasses.row, flexClasses.centerStart)}>
            <span
              className={clsx(
                'am-subtitle2',
                classes.label,
                classes.renameLabel,
              )}
            >
              Rename To
            </span>
            <span className={classes.input}>
              <FormControl>
                <Input
                  autoFocus
                  value={newProfileName}
                  onChange={e => {
                    setNewProfileName(e.target.value)
                  }}
                  classes={{
                    input: classes.inputText,
                  }}
                />
              </FormControl>
            </span>
          </div>
        </div>
        <Box
          display='flex'
          flexDirection='row'
          alignItems='center'
          justifyContent='flex-end'
          mt={2.0}
        >
          <Box mr={2}>
            <Button
              variant='text'
              color='primary'
              onClick={() => {
                setRenameProfileOpen(false)
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
              onClick={handleSave}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Paper>
    </Modal>
  )
}

RenameSecurityProfile.propTypes = {
  newProfileName: PropTypes.string,
  renameProfileOpen: PropTypes.bool,
  setNewProfileName: PropTypes.func,
  setRenameProfileOpen: PropTypes.func,
}

RenameSecurityProfile.defaultProps = {
  newProfileName: null,
  renameProfileOpen: true,
  setNewProfileName: () => {},
  setRenameProfileOpen: () => {},
}

export default RenameSecurityProfile
