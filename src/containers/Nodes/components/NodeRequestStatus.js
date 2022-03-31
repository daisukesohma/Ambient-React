/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import CircularProgress from '@material-ui/core/CircularProgress'
import Chip from '@material-ui/core/Chip'
import DoneIcon from '@material-ui/icons/Done'
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline'
import { makeStyles } from '@material-ui/core/styles'

import { NodeRequestStatusEnum } from '../../../enums'

const useStyles = makeStyles({
  label: {
    fontSize: 14,
  },
})

const NodeRequestStatusChip = ({
  type,
  status,
  incompleteLabel,
  inprogressLabel,
  completeLabel,
}) => {
  const classes = useStyles()
  let icon
  let label
  const compareStatus = status ? status.toLowerCase() : status

  if (compareStatus === NodeRequestStatusEnum.INCOMPLETE) {
    icon = <ErrorOutlineIcon />
    label = incompleteLabel || 'Awaiting'
  } else if (compareStatus === NodeRequestStatusEnum.INPROGRESS) {
    icon = <CircularProgress size={18} />
    label = inprogressLabel || 'In Progress'
  } else if (compareStatus === NodeRequestStatusEnum.COMPLETE) {
    icon = <DoneIcon />
    label = completeLabel || 'Complete'
  } else {
    label = `${compareStatus}`
  }

  return (
    <>
      <Chip
        variant="outlined"
        label={label}
        icon={icon}
        classes={{ label: classes.label }}
      />
    </>
  )
}

NodeRequestStatusChip.defaultProps = {
  type: '',
  status: '',
  incompleteLabel: '',
  inprogressLabel: '',
  completeLabel: '',
}

NodeRequestStatusChip.propTypes = {
  type: PropTypes.string,
  status: PropTypes.string,
  incompleteLabel: PropTypes.string,
  inprogressLabel: PropTypes.string,
  completeLabel: PropTypes.string,
}

export default NodeRequestStatusChip
