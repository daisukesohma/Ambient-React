import React from 'react'
import PropTypes from 'prop-types'

function NodeServiceStatus(props) {
  const { nodeDetail } = props

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

    let servicesColor
    let servicesStatus
    if (hasServices && healthyServices === totalServices) {
      servicesColor = 'text-navy'
      servicesStatus = 'Healthy'
    } else {
      servicesColor = 'text-danger'
      servicesStatus = 'Unhealthy'
    }

    return (
      <>
        <i
          className={`fa fa-circle ${servicesColor} appliancehealthpanel__statusBubble`}
        />
        &nbsp;
        {servicesStatus}
      </>
    )
  }
  return <div />
}

export default NodeServiceStatus

NodeServiceStatus.defaultProps = {
  nodeDetail: {
    services: {},
  },
}

NodeServiceStatus.propTypes = {
  nodeDetail: PropTypes.shape({
    services: PropTypes.object,
  }),
}
