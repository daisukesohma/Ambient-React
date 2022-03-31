import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useQuery } from '@apollo/react-hooks'
import { withRouter } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import get from 'lodash/get'
import { redirectUrl as redirectUrlAction } from 'redux/slices/settings'

import Logo from '../../assets/logo_icon.png'

import { GET_FEDERATION_PROFILES } from './gql'
import { useStyles } from './styles'

const IdentitySourceLanding = ({
  history,
  redirectUrl,
  identitySourceId,
  redirect,
}) => {
  const classes = useStyles()

  // second workflow on both cases.
  const { data } = useQuery(GET_FEDERATION_PROFILES)

  // check to see whether user goes to Federation/index or IdentitySources/index.
  useEffect(() => {
    if (data && data.getFederationProfiles) {
      const federationProfiles = data.getFederationProfiles
      const hasFederationProfiles =
        federationProfiles &&
        Array.isArray(federationProfiles) &&
        federationProfiles.length > 0
      if (redirectUrl) {
        if (hasFederationProfiles) {
          redirect({ syncId: identitySourceId, redirectUrl })
          // syncIdentitySource()
          let temp = redirectUrl
          if (!temp.includes('identity-sources')) {
            if (temp.includes('users/')) {
              temp += 'identity-sources'
            } else {
              temp += '/identity-sources'
            }
          }
          history.push(temp)
        } else {
          redirect({ syncId: identitySourceId, redirectUrl })
          if (redirectUrl.includes('identity-sources')) {
            history.push(
              redirectUrl.replace('identity-sources', 'select-federation'),
            )
          } else {
            const usersRedirectUrl =
              redirectUrl[redirectUrl.length - 1] === '/'
                ? `${redirectUrl}identity-sources}`
                : `${redirectUrl}/identity-sources}`
            redirect({
              syncId: identitySourceId,
              redirectUrl: usersRedirectUrl,
            })
            const selectUrl =
              redirectUrl[redirectUrl.length - 1] === '/'
                ? 'select-federation'
                : '/select-federation'
            history.push(`${redirectUrl}${selectUrl}`)
          }
        }
      }
    }
    // eslint-disable-next-line
  }, [data])

  return (
    <Grid container className={`${classes.logoutRoot}`}>
      <Grid
        item
        xs={12}
        sm={12}
        md={12}
        lg={12}
        xl={12}
        className={classes.logoutRootBlock}
      >
        <img src={Logo} alt='Ambient' className={classes.logo} />
        <Typography variant='h3'>Welcome Back to Ambient.ai</Typography>
        <br />
        <Typography variant='h4'>Redirecting...</Typography>
      </Grid>
    </Grid>
  )
}

IdentitySourceLanding.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  identitySourceId: PropTypes.string,
  redirect: PropTypes.func,
  redirectUrl: PropTypes.string,
}

IdentitySourceLanding.defaultProps = {
  identitySourceId: '',
  redirect: () => {},
  redirectUrl: '',
}

const mapStateToProps = state => ({
  redirectUrl: get(state, 'settings.redirectUrl.redirectUrl'),
  identitySourceId: get(state, 'settings.redirectUrl.identitySourceId'),
})

const mapDispatchToProps = dispatch => ({
  redirect: data => dispatch(redirectUrlAction(data)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(IdentitySourceLanding))
