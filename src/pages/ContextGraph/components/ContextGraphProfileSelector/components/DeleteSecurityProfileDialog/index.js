import React from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import get from 'lodash/get'
import clsx from 'clsx'

import SimpleLabel from 'components/Label/SimpleLabel'
import ConfirmDialog from 'components/ConfirmDialog'
import { securityProfileDestroyRequested } from 'redux/contextGraph/actions'

import useStyles from './styles'

DeleteSecurityProfileDialog.propTypes = {
  deleteConfirmation: PropTypes.bool,
  setDeleteConfirmation: PropTypes.func,
  activeSecurityProfile: PropTypes.object,
}

function DeleteSecurityProfileDialog({
  deleteConfirmation,
  setDeleteConfirmation,
  activeSecurityProfile,
}) {
  const classes = useStyles()
  const dispatch = useDispatch()
  return (
    <ConfirmDialog
      open={deleteConfirmation}
      onClose={() => setDeleteConfirmation(false)}
      onConfirm={() => {
        dispatch(securityProfileDestroyRequested(activeSecurityProfile.id))
        setDeleteConfirmation(false)
      }}
      content={
        <>
          <div className='am-body1'>
            Are you sure you want to delete the
            <div>
              {get(activeSecurityProfile, 'name')}
              <SimpleLabel>Security Profile</SimpleLabel>?
            </div>
          </div>
          <div className={clsx('am-caption', classes.subText)}>
            This will remove the security profile and all threat signatures
            deployed in this security profile.
          </div>
          <div className={clsx('am-overline', classes.warningText)}>
            This action cannot be undone.
          </div>
        </>
      }
    />
  )
}

export default DeleteSecurityProfileDialog
