import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import Box from '@material-ui/core/Box'
import Modal from '@material-ui/core/Modal'
import Paper from '@material-ui/core/Paper'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import { Button } from 'ambient_ui'
import clsx from 'clsx'

import useStyles from './styles'

function NewEscalation({
  newEscalationFormVisible,
  setNewEscalationFormVisible,
  createNewEscalation,
}) {
  const darkMode = useSelector(state => state.settings.darkMode)

  const classes = useStyles({ darkMode })
  const [newPolicyName, setNewPolicyName] = useState('')

  return (
    <Modal
      open={newEscalationFormVisible}
      onClose={() => setNewEscalationFormVisible(false)}
    >
      <Paper className={classes.modal}>
        <Box display='flex' flexDirection='column'>
          <div className={clsx('am-h5', classes.title)}>
            Create New Escalation
          </div>
          <Box width={1} mt={1.5} display='flex'>
            <FormControl fullWidth classes={{ root: classes.inputRoot }}>
              <Input
                autoFocus
                placeholder='New Escalation Policy Name'
                value={newPolicyName}
                onChange={e => {
                  setNewPolicyName(e.target.value)
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
                  setNewEscalationFormVisible(false)
                }}
              >
                Cancel
              </Button>
            </Box>
            <Box>
              <Button
                color='primary'
                variant='contained'
                disabled={!newPolicyName}
                onClick={() => {
                  createNewEscalation({ policyName: newPolicyName })
                  setNewEscalationFormVisible(false)
                  setNewPolicyName(null)
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

NewEscalation.propTypes = {
  newEscalationFormVisible: PropTypes.bool,
  setNewEscalationFormVisible: PropTypes.func,
  createNewEscalation: PropTypes.func,
}

export default NewEscalation
