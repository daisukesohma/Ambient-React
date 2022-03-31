import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import { ErrorPanel as AmErrorPanel } from 'ambient_ui'

const useStyles = makeStyles(theme => ({
  errorContainer: {
    '&&&': {
      '& .MuiPaper-root': {
        '& >div': {
          marginTop: 20,
        },
      },
      '& h6': {
        margin: 0,
        fontSize: 20,
        fontFamily: "'Aeonik-Light', 'Roboto'",
      },
    },
  },
}))

const ErrorPanel = ({ title }) => {
  const classes = useStyles()

  return (
    <div className={classes.errorContainer}>
      <AmErrorPanel title={title} />
    </div>
  )
}

ErrorPanel.defaultProps = {
  title: '',
}

ErrorPanel.propTypes = {
  title: PropTypes.string,
}

export default ErrorPanel
