import React, { useState } from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter, Redirect } from 'react-router-dom'
import get from 'lodash/get'

import { getAccountSlug } from '../../../../utils'

import ConfigureRerunHelper from './ConfigureRerunHelper'
import OnboardingExtraLinks from './OnboardingExtraLinks'
import RestartNodeButton from './RestartNodeButton'

const styles = {
  mainContainer: {
    minHeight: 300,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
}

const OnboardingComplete = ({
  match: {
    params: { site: siteSlug, nodeId },
  },
  isInternal,
  accountSlug,
}) => {
  const { palette } = useTheme()
  const [restarted, setRestarted] = useState(false) // did user restart container? Eventually have restart state from db here.
  if (restarted) {
    // Redirect if Restarted
    return <Redirect to='/health/sites' />
  }

  return (
    <div style={styles.mainContainer}>
      <div
        style={{
          border: `1px solid ${palette.error.light}`,
          borderRadius: 5,
          padding: 20,
          marginBottom: 20,
        }}
      >
        <div style={{ fontSize: 16, fontWeight: 600 }}>
          Your Ambient.ai node needs a restart to complete activating your new
          camera streams.
        </div>
        <div style={{ marginTop: 20, color: palette.error.main }}>
          <div>Restarting will take this node offline for up to 1 minute.</div>
          {isInternal ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: 20,
              }}
            >
              <RestartNodeButton
                id={nodeId}
                onRestart={() => setRestarted(true)}
              />
            </div>
          ) : (
            <div style={{ color: palette.error.main }}>
              Contact your Ambient.ai administrator to begin the restart
              process.
            </div>
          )}
        </div>
      </div>
      <OnboardingExtraLinks
        accountSlug={accountSlug}
        siteSlug={siteSlug}
        nodeId={nodeId}
      />
      <ConfigureRerunHelper
        accountSlug={accountSlug}
        siteSlug={siteSlug}
        nodeId={nodeId}
      />
    </div>
  )
}

OnboardingComplete.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      site: PropTypes.string,
      nodeId: PropTypes.string,
    }),
  }),
  isInternal: PropTypes.bool,
  accountSlug: PropTypes.string,
}

OnboardingComplete.defaultTypes = {
  match: {
    params: {
      site: '',
      nodeId: '',
    },
  },
  isInternal: false,
}

const mapStateToProps = state => ({
  isInternal: get(state, 'auth.user.internal'),
  accountSlug: getAccountSlug(state),
})

export default connect(
  mapStateToProps,
  null,
)(withRouter(OnboardingComplete))
