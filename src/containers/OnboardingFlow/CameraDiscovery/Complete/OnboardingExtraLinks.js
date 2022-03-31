import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const OnboardingExtraLinks = ({ siteSlug, nodeId, accountSlug }) => (
  <>
    <>
      <a href={`/accounts/${accountSlug}/sites/${siteSlug}/live`}>
        Go see live cameras at site
      </a>
    </>
    <>
      <Link to={`/accounts/${accountSlug}/infrastructure/sites`}>
        Manage my Sites
      </Link>{' '}
      or{' '}
      <Link to={`/accounts/${accountSlug}/infrastructure/sites/new`}>
        Add Another Site
      </Link>
    </>
    <>
      <Link
        to={`/accounts/${accountSlug}/infrastructure/sites/${siteSlug}/appliances/${nodeId}/cameras/discover`}
      >
        View Camera Discovery Status
      </Link>
    </>
  </>
)

OnboardingExtraLinks.propTypes = {
  siteSlug: PropTypes.string,
  accountSlug: PropTypes.string,
  nodeId: PropTypes.string,
}

OnboardingExtraLinks.defaultTypes = {
  siteSlug: '',
  accountSlug: '',
  nodeId: '',
}

export default OnboardingExtraLinks
