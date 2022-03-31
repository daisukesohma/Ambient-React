import React from 'react'
// src
import ErrorBoundary from 'components/ErrorBoundary'

const withLayout = (Layout, layoutProps = {}) => View => props => {
  return (
    <Layout {...layoutProps}>
      <ErrorBoundary>
        <View {...props} />
      </ErrorBoundary>
    </Layout>
  )
}

export default withLayout
