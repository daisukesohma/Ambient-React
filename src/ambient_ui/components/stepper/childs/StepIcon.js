import React from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'

const useStepIconStyles = makeStyles(({ palette }) => ({
  root: {
    backgroundColor: palette.grey[300],
    zIndex: 1,
    color: palette.common.white,
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  active: {
    backgroundColor: palette.primary.main,
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  },
  completed: {
    backgroundColor: palette.primary.main,
  },
}))

const StepIcon = props => {
  const classes = useStepIconStyles()
  const { active, completed, iconComponent } = props
  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
    >
      {iconComponent}
    </div>
  )
}

StepIcon.propTypes = {
  active: PropTypes.bool,
  completed: PropTypes.bool,
  icon: PropTypes.node,
}

export default StepIcon
