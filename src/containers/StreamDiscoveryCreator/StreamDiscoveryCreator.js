import React from 'react'
// import PropTypes from 'prop-types'

import PageTitle from '../../components/Page/Title'

import RequestTableContainer from './components/RequestTableContainer'

export default function DiscoveryCreate() {
  return (
    <div>
      <PageTitle title='Stream Discovery' />
      <RequestTableContainer />
    </div>
  )
}
