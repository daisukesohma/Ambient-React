import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { connect } from 'react-redux'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import PropTypes from 'prop-types'

import { getAccountSlug } from '../../utils'

import SiteEditorToolbar from './components/SiteEditorToolbar'
import useStyles from './styles'
import AccessEditorDetails from './components/AccessEditorDetails'

const MODES = ['Access', 'Streams']

const SiteEditor = ({ accountSlug }) => {
  const classes = useStyles()
  const [mode, setMode] = useState('Access')

  return (
    <Grid container style={{ width: '100%', height: '100vh' }}>
      <Grid item lg={3} md={3} sm={3} xs={3} className={classes.drawerWrapper}>
        <SiteEditorToolbar
          accountSlug={accountSlug}
          currentMode={mode}
          modeOptions={MODES}
          onModeChange={m => {
            setMode(m)
          }}
        />
      </Grid>
      <Grid item lg={9} md={9} sm={9} xs={9}>
        <Box pl={1} pr={1}>
          {mode === 'Access' && (
            <AccessEditorDetails accountSlug={accountSlug} />
          )}
        </Box>
      </Grid>
    </Grid>
  )
}

const mapStateToProps = state => {
  return {
    accountSlug: getAccountSlug(state),
  }
}

SiteEditor.propTypes = {
  accountSlug: PropTypes.string,
}

export default compose(
  connect(
    mapStateToProps,
    null,
  ),
  withRouter,
)(SiteEditor)
