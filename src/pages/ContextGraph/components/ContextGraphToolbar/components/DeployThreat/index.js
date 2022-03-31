import React from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import clsx from 'clsx'

import { createAlertRequested } from '../../../../../../redux/contextGraph/actions'
import { useCursorStyles } from '../../../../../../common/styles/commonStyles'

import useStyles from './styles'

function DeployThreat({ id }) {
  const cursorClasses = useCursorStyles()
  const classes = useStyles()
  const dispatch = useDispatch()

  const activeSecurityProfile = useSelector(
    state => state.contextGraph.activeProfile,
  )

  const handleDeploy = () => {
    dispatch(
      createAlertRequested({
        defaultAlertId: id,
        securityProfileId: activeSecurityProfile.id,
      }),
    )
  }
  return (
    <div
      className={clsx(
        'am-overline',
        cursorClasses.pointer,
        classes.leftAdornmentAction,
      )}
      onClick={handleDeploy}
    >
      Deploy
    </div>
  )
}

DeployThreat.propTypes = {
  id: PropTypes.number,
}

export default DeployThreat
