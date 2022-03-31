/* eslint-disable */
import React, { Component } from 'react'
import PropTypes from 'prop-types'

// src
import ErrorPage from '../pages/ErrorPage'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    //     return { hasError: true  };
    //
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    //     logErrorToMyService(error, errorInfo);
    //
    console.error(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      //       return <h1>Something went wrong.</h1>;
      //
      return <ErrorPage />
    }

    return this.props.children
  }
}

ErrorBoundary.defaultProps = {
  children: undefined,
}

ErrorBoundary.propTypes = {
  children: PropTypes.object,
}

export default ErrorBoundary
