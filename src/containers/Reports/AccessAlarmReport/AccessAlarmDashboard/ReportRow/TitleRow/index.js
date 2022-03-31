import React from 'react'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import { useSelector } from 'react-redux'

import useStyles from './styles'

function TitleRow({ title }) {
  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({ darkMode })
  return (
    <Grid
      item
      sm={12}
      xs={12}
      md={12}
      lg={12}
      xl={12}
      className={classes.titleContainer}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <div className='am-h4' style={{ textAlign: 'left' }}>
          {title}
        </div>
      </div>
    </Grid>
  )
}

TitleRow.defaultProps = {
  title: '',
}

TitleRow.propTypes = {
  title: PropTypes.string,
}

export default TitleRow
