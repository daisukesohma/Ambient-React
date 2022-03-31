/* eslint-disable import/no-cycle */
import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import { createMigrate, persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
// src
import config from 'config'

import verificationMiddleware from 'pages/VerificationPortal/redux/socketMiddleware'

import migrations from './migrations'
import rootReducer from './reducers'
import wsMiddleware from './websocket/middleware'
import ssMiddleware from './signal/middleware'

const sagaMiddleware = createSagaMiddleware()

const persistedReducer = persistReducer(
  {
    key: 'root',
    storage,
    whitelist: ['settings'],
    version: 5,
    migrate: createMigrate(migrations, { debug: false }),
  },
  rootReducer,
)

const store = configureStore({
  reducer: persistedReducer,
  middleware: [
    wsMiddleware,
    ssMiddleware,
    verificationMiddleware,
    sagaMiddleware,
  ],
  devTools: config.settings.devTools,
  // true/false. if you pass object - devTools will be enabled with next options: https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md
  // devTools: {
  //  actionsBlacklist: ['<action type>']
  //  ...
  // }
})

const persistor = persistStore(store)

export { store, persistor, sagaMiddleware }
