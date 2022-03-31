import React from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { BrowserRouter, Route } from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params'
import { ApolloProvider } from '@apollo/react-hooks'
import whyDidYouRender from '@welldone-software/why-did-you-render'
import { store, persistor, sagaMiddleware } from 'redux/store'
// src
import WebSocketConnection from 'WebsocketConnection'
import VerifyCredentialsGate from 'VerifyCredentialsGate'
import WebRTCPeerConnection from 'webrtc/WebRTCPeerConnection'
import Apollo from 'providers/apollo'
import Router from 'Router'
import rootSaga from 'sagas'
import config from 'config'
import { getSocket } from 'utils'
import ability from 'rbac/ability' // initialize empty CASL ability
import { AbilityContext } from 'rbac'
import MainThemeProvider from 'providers/MainThemeProvider'
import mediaStreams from 'webrtc/mediaStreams'

declare global {
  interface Window {
    Cypress: any
    store: any
    mediaStreams: string[] 
  }
}

if (config.settings.renderLog) {
  whyDidYouRender(React, {
    trackAllPureComponents: false,
    trackHooks: true,
    trackExtraHooks: [],
    logOnDifferentValues: true,
    logOwnerReasons: true,
    hotReloadBufferMs: 500,
    onlyLogs: true,
    collapseGroups: false,
    titleColor: 'green',
    diffNameColor: 'darkturquoise',
    include: [], // include: [/VideoStreamControlsV2/]
  })
}

const appSocketHost = getSocket()

sagaMiddleware.run(rootSaga)

export default function App(): JSX.Element {
  // expose redux store when run in Cypress
  if (window.Cypress) {
    window.store = store
    window.mediaStreams = mediaStreams
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <MainThemeProvider>
          <BrowserRouter>
            <QueryParamProvider ReactRouterRoute={Route}>
              <ApolloProvider client={Apollo.client}>
                <VerifyCredentialsGate>
                  <WebRTCPeerConnection>
                    <WebSocketConnection host={appSocketHost}>
                      <AbilityContext.Provider value={ability}>
                        <Router />
                      </AbilityContext.Provider>
                    </WebSocketConnection>
                  </WebRTCPeerConnection>
                </VerifyCredentialsGate>
              </ApolloProvider>
            </QueryParamProvider>
          </BrowserRouter>
        </MainThemeProvider>
      </PersistGate>
    </Provider>
  )
}
