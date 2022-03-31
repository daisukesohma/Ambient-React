import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  button: {
    background: theme.palette.primary.main,
    fontSize: theme.typography.button.fontSize,
    color: theme.palette.primary.contrastText,
    cursor: 'pointer',
    border: 0,
    '&:focus': {
      outline: 'none',
    },
  },
  small: {
    height: '30px',
    padding: '0 15px',
    borderRadius: '15px',
  },
  default: {
    height: '48px',
    padding: '0 45px',
    borderRadius: '24px',
  },
}))

export default ({ text, type }) => {
  const classes = useStyles()
  return (
    <button className={`${classes.button} ${classes[type]}`}>{text}</button>
  )
}
