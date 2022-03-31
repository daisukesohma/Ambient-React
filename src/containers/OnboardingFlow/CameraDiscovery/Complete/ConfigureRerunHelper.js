import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const ConfigureRerunHelper = ({ siteSlug, nodeId, accountSlug }) => {
  return (
    <div style={{ marginTop: 20 }}>
      <div>
        Haven't found all your cameras? Input incorrect camera credentials or
        IP/IP Ranges or Subnets?
      </div>
      <Link
        to={`/accounts/${accountSlug}/sites/${siteSlug}/appliances/${nodeId}/cameras/config`}
      >
        Configure cameras again
      </Link>
    </div>
  )
}

ConfigureRerunHelper.propTypes = {
  siteSlug: PropTypes.string,
  accountSlug: PropTypes.string,
  nodeId: PropTypes.string,
}

ConfigureRerunHelper.defaultTypes = {
  accountSlug: '',
  siteSlug: '',
  nodeId: '',
}

export default ConfigureRerunHelper
