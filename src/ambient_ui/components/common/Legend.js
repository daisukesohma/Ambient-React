import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'

import makeUniqueId from 'utils/makeUniqueId'

const useStyles = makeStyles(theme => ({
  am_title: {
    fontSize: '18px',
    marginBottom: '10px',
  },
  am_legend: {
    padding: '0',
    display: 'flex',
    alignItems: 'center',
    margin: '5px 0',
  },
  am_root: {
    padding: '15px 32px',
  },
  am_mark: {
    width: 15,
    height: 15,
    marginRight: 10,
    transform: 'rotate(45deg)',
  },
  am_label: {
    fontSize: '18px',
  },
}))

const Legend = ({ title, data }) => {
  const classes = useStyles()

  return (
    <Paper classes={{ root: classes.am_root }}>
      <div className={classes.am_title}>{title}</div>
      <div>
        {data.map(({ label, color }) => {
          const uniqueKey = makeUniqueId('legend_element')
          return (
            <div className={classes.am_legend} key={uniqueKey}>
              <div
                className={classes.am_mark}
                style={{ backgroundColor: color }}
              />
              <div className={classes.am_label}>{label}</div>
            </div>
          )
        })}
      </div>
    </Paper>
  )
}

Legend.defaultProps = {
  data: [],
  title: 'KEY',
}

Legend.propTypes = {
  data: PropTypes.array,
  title: PropTypes.string,
}

export default Legend
