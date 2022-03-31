import React from 'react'
import ReactDOM from 'react-dom'
import {
  StylesProvider,
  createGenerateClassName,
} from '@material-ui/core/styles'
import mixpanel from 'mixpanel-browser'
import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'

// src
import App from './App'
import ErrorBoundary from './components/ErrorBoundary'
import * as serviceWorker from './serviceWorker'
import './main.css'
import config from './config'

mixpanel.init(config.apiKeys.MIXPANEL_KEY, { debug: config.settings.devTools })

if (window.location.hostname !== 'localhost') {
  Sentry.init({
    dsn:
      'https://71e14dd49edb4588bfb1f5a045b80b90@o275180.ingest.sentry.io/5731994',
    release: `product@${process.env.npm_package_version}`,
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 1.0,
  })
}

const generateClassName = createGenerateClassName({
  productionPrefix: 'ambient-product-',
})

ReactDOM.render(
  <StylesProvider generateClassName={generateClassName} injectFirst>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StylesProvider>,
  document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
