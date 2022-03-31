import React from 'react'
import PropTypes from 'prop-types'

import useStyles from './styles'

const NodeServiceStatus = ({ nodeDetail, darkMode, isConnected }) => {
  const classes = useStyles({ darkMode })

  if (nodeDetail) {
    const services = Object.keys(nodeDetail.services)
    const healthyServices = services.reduce((sm, key) => {
      // Introduced by graphql, we want to remove this since it is not a service
      if (key !== '__typename') {
        return sm + nodeDetail.services[key]
      }
      return sm
    }, 0)

    const totalServices = services.reduce((total, service) => {
      // Introduced by graphql, we want to remove this since it is not a service
      if (service !== '__typename') {
        return total + 1
      }
      return total
    }, 0)
    const hasServices = healthyServices > 0 && totalServices > 0

    let servicesStatus
    if (!isConnected) {
      servicesStatus = 'Not connected'
    } else if (hasServices && healthyServices === totalServices) {
      servicesStatus = 'Healthy'
    } else {
      servicesStatus = 'Unhealthy'
    }

    return <div className={classes.root}>{servicesStatus}</div>
  }
  return <div />
}

export default NodeServiceStatus

NodeServiceStatus.defaultProps = {
  darkMode: false,
  nodeDetail: {
    services: {},
  },
}

NodeServiceStatus.propTypes = {
  darkMode: PropTypes.bool,
  nodeDetail: PropTypes.shape({
    services: PropTypes.object,
  }),
}
