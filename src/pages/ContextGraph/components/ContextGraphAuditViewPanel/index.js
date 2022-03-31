import React, { useState } from 'react'
import { useTheme } from '@material-ui/core/styles'
import { Icons } from 'ambient_ui'
import { Grid, IconButton } from '@material-ui/core'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'

import ContextGraphAuditView from 'pages/ContextGraphAuditView'

import useStyles from './styles'

const { ArrowUp, ArrowDown } = Icons

function ContextGraphAuditViewPanel({ siteSlug, siteName }) {
  const { palette } = useTheme()
  const darkMode = useSelector(state => state.settings.darkMode)

  const [isExpanded, setIsExpanded] = useState(false)
  const classes = useStyles({ darkMode, isExpanded })

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <Grid item className={classes.root} lg={12} md={12} sm={12} xs={12}>
      <Grid className={classes.expandContainer}>
        <IconButton onClick={toggleExpand} classes={{ root: classes.expander }}>
          {isExpanded ? (
            <ArrowDown stroke={palette.text.primary} width={40} height={40} />
          ) : (
            <ArrowUp stroke={palette.text.primary} width={40} height={40} />
          )}
        </IconButton>
      </Grid>
      <div className={classes.containderDiv}>
        <Grid className={classes.instancesContainer}>
          <ContextGraphAuditView
            siteSlug={siteSlug}
            siteName={siteName}
            isExpanded={isExpanded}
          />
        </Grid>
      </div>
    </Grid>
  )
}

ContextGraphAuditViewPanel.propTypes = {
  siteSlug: PropTypes.string,
  siteName: PropTypes.string,
}

ContextGraphAuditViewPanel.defaultProps = {
  siteSlug: null,
  siteName: null,
}

export default ContextGraphAuditViewPanel
