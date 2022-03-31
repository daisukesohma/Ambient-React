import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    width: '200px',
    height: '200px',
    padding: '15px',
    borderRadius: '5px',
    boxShadow: '0 0px 5px 1px rgba(0, 0, 0, .3)',
  },
  title: {
    fontSize: 24,
  },
  body: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  description: {
    fontSize: 12,
    color: theme.palette.grey['900'],
    flex: 1,
    marginTop: '20px',
  },
  number: {
    fontSize: 100,
    fontWeight: 700,
    flex: 1,
  },
}))

const Gauge = ({ title, description, number }) => {
  const classes = useStyles()
  return (
    <div className={classes.container}>
      <div className={classes.title}>{title}</div>
      <div className={classes.body}>
        <div className={classes.description}>{description}</div>
        <div className={classes.number}>{number}</div>
      </div>
    </div>
  )
}

Gauge.defaultProps = {
  title: '',
  description: '',
  number: 0,
}

Gauge.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  number: PropTypes.number,
}

export default Gauge
