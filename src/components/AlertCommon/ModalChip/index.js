import React, { memo } from 'react'
import PropTypes from 'prop-types'
import Chip from '@material-ui/core/Chip'
import Typography from '@material-ui/core/Typography'
import clsx from 'clsx'
// src
import UserAvatar from 'components/UserAvatar'

import useStyles from './styles'

const ModalChip = ({
  primaryLabel,
  secondaryLabel,
  status,
  disabled,
  img,
  onDelete,
}) => {
  const classes = useStyles({ status })
  const labelNode = (
    <div className={classes.ModalChipLabel}>
      <Typography variant='subtitle2'>{primaryLabel}</Typography>
      <Typography variant='overline' className={clsx(classes.secondaryLabel)}>
        {secondaryLabel}
      </Typography>
    </div>
  )

  return (
    <Chip
      className={clsx({ [classes[status]]: status }, classes.chipContainer)}
      style={{ height: 'fit-content' }}
      disabled={disabled}
      label={labelNode}
      avatar={
        <div style={{ marginLeft: 8 }}>
          <UserAvatar img={img} name={primaryLabel} size={24} />
        </div>
      }
      onDelete={onDelete}
    />
  )
}

ModalChip.defaultProps = {
  disabled: false,
  img: null,
  onDelete: null,
  primaryLabel: 'Poppy',
  secondaryLabel: 'Poppyseed',
  status: 'declined',
}

ModalChip.propTypes = {
  disabled: PropTypes.bool,
  img: PropTypes.string,
  onDelete: PropTypes.func,
  primaryLabel: PropTypes.string,
  secondaryLabel: PropTypes.string,
  status: PropTypes.string,
}

export default memo(ModalChip)
