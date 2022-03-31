// author: rodaan@ambient.ai
// Configuration file
// You can edit this but nothing else!
const hostname = 'localhost.ambient.ai'
// const local = {
//   api: {
//     HOST: hostname,
//     SECURE: false,
//   },
//   socket: {
//     HOST: hostname,
//     PORT: 9001,
//     SECURE: false,
//     PATH: '',
//   },
//   signalBridge: {
//     HOST: hostname,
//     PORT: 9004,
//     SECURE: false,
//     PATH: '',
//   },
//   verificationServer: {
//     HOST: hostname,
//     PORT: 9005,
//     SECURE: false,
//   },
//   signalBridgeOwt: `http://${hostname}:8095`,
//   apiKeys: {
//     GOOGLE_MAP_KEY: 'AIzaSyDxkuV4_lHyxUORq5EHCrGlQYPS2rsuyb4',
//     MIXPANEL_KEY: '4ecb77e4b72ec336d5295b108c06709a',
//   },
//   settings: {
//     demo: true,
//     renderLog: false,
//     devTools: true,
//   },
// }

const local = {
  api: {
    HOST: 'neo.ambient.ai',
    SECURE: false,
  },
  socket: {
    HOST: 'neo.ambient.ai',
    PORT: 9001,
    SECURE: false,
    PATH: '',
  },
  signalBridge: {
    HOST: 'neo.ambient.ai',
    PORT: 9004,
    SECURE: false,
    PATH: '',
  },
  verificationServer: {
    HOST: 'neo.ambient.ai',
    PORT: 9005,
    SECURE: false,
  },
  signalBridgeOwt: 'https://signal-staging.ambient.ai',
  apiKeys: {
    GOOGLE_MAP_KEY: 'AIzaSyDxkuV4_lHyxUORq5EHCrGlQYPS2rsuyb4',
    MIXPANEL_KEY: 'cc824fdf541e250d2b2252506a7a4b8a',
  },
  settings: {
    demo: false,
    renderLog: true,
    devTools: true,
  },
}

const onprem = {
  api: {
    HOST: 'localhost.ambient.ai',
    SECURE: false,
  },
  socket: {
    HOST: 'localhost.ambient.ai',
    PORT: 9001,
    SECURE: false,
    PATH: '',
  },
  signalBridge: {
    HOST: 'localhost.ambient.ai',
    PORT: 9004,
    SECURE: false,
    PATH: '',
  },
  verificationServer: {
    HOST: 'localhost.ambient.ai',
    PORT: 9005,
    SECURE: false,
  },
  signalBridgeOwt: 'http://localhost.ambient.ai:8095',
  apiKeys: {
    GOOGLE_MAP_KEY: 'AIzaSyDxkuV4_lHyxUORq5EHCrGlQYPS2rsuyb4',
    MIXPANEL_KEY: '4ecb77e4b72ec336d5295b108c06709a',
  },
  settings: {
    demo: false,
    renderLog: false,
    devTools: false,
  },
}

const test = {
  api: {
    HOST: 'test.ambient.ai',
    SECURE: false,
  },
  socket: {
    HOST: 'test.ambient.ai',
    PORT: 9001,
    SECURE: false,
    PATH: '',
  },
  signalBridge: {
    HOST: 'test.ambient.ai',
    PORT: 9004,
    SECURE: false,
    PATH: '',
  },
  verificationServer: {
    HOST: 'test.ambient.ai',
    PORT: 9005,
    SECURE: false,
  },
  signalBridgeOwt: 'http://test.ambient.ai:8095',
  apiKeys: {
    GOOGLE_MAP_KEY: 'AIzaSyDxkuV4_lHyxUORq5EHCrGlQYPS2rsuyb4',
    MIXPANEL_KEY: '4ecb77e4b72ec336d5295b108c06709a',
  },
  settings: {
    demo: false,
    renderLog: false,
    devTools: true,
  },
}

const remote = {
  api: {
    HOST: 'remote.ambient.ai',
    SECURE: false,
  },
  socket: {
    HOST: 'remote.ambient.ai',
    PORT: 9001,
    SECURE: false,
    PATH: '',
  },
  signalBridge: {
    HOST: 'remote.ambient.ai',
    PORT: 9004,
    SECURE: false,
    PATH: '',
  },
  verificationServer: {
    HOST: 'remote.ambient.ai',
    PORT: 9005,
    SECURE: false,
  },
  signalBridgeOwt: 'http://remote.ambient.ai:8095',
  apiKeys: {
    GOOGLE_MAP_KEY: 'AIzaSyDxkuV4_lHyxUORq5EHCrGlQYPS2rsuyb4',
    MIXPANEL_KEY: '4ecb77e4b72ec336d5295b108c06709a',
  },
  settings: {
    demo: true,
    renderLog: true,
    devTools: true,
  },
}

const remote2 = {
  api: {
    HOST: 'remote2.ambient.ai',
    SECURE: false,
  },
  socket: {
    HOST: 'remote2.ambient.ai',
    PORT: 9001,
    SECURE: false,
    PATH: '',
  },
  signalBridge: {
    HOST: 'remote2.ambient.ai',
    PORT: 9004,
    SECURE: false,
    PATH: '',
  },
  verificationServer: {
    HOST: 'remote.ambient.ai',
    PORT: 9005,
    SECURE: false,
  },
  signalBridgeOwt: 'http://remote2.ambient.ai:8095',
  apiKeys: {
    GOOGLE_MAP_KEY: 'AIzaSyDxkuV4_lHyxUORq5EHCrGlQYPS2rsuyb4',
    MIXPANEL_KEY: '4ecb77e4b72ec336d5295b108c06709a',
  },
  settings: {
    demo: false,
    renderLog: true,
    devTools: true,
  },
}

const alpha = {
  api: {
    HOST: 'staging.ambient.ai',
    SECURE: true,
  },
  socket: {
    HOST: 'staging.ambient.ai',
    PORT: 443,
    SECURE: true,
    PATH: '/socket/node',
  },
  signalBridge: {
    HOST: 'staging.ambient.ai',
    PORT: 443,
    SECURE: true,
    PATH: '/socket/signal',
  },
  // TODO: Use 443 on prod-like environments
  verificationServer: {
    HOST: 'alpha.ambient.ai',
    PORT: 9005,
    SECURE: true,
  },
  signalBridgeOwt: 'https://signal-staging.ambient.ai',
  apiKeys: {
    GOOGLE_MAP_KEY: 'AIzaSyDxkuV4_lHyxUORq5EHCrGlQYPS2rsuyb4',
    MIXPANEL_KEY: 'cc824fdf541e250d2b2252506a7a4b8a',
  },
  settings: {
    demo: !!window.Cypress,
    renderLog: true,
    devTools: true,
  },
}

const ondeck = {
  api: {
    HOST: 'ondeck.ambient.ai',
    SECURE: false,
  },
  socket: {
    HOST: 'ondeck.ambient.ai',
    PORT: 9001,
    SECURE: false,
    PATH: '',
  },
  signalBridge: {
    HOST: 'ondeck.ambient.ai',
    PORT: 9004,
    SECURE: false,
    PATH: '',
  },
  verificationServer: {
    HOST: 'ondeck.ambient.ai',
    PORT: 9005,
    SECURE: false,
  },
  signalBridgeOwt: 'https://signal-staging.ambient.ai',
  apiKeys: {
    GOOGLE_MAP_KEY: 'AIzaSyDxkuV4_lHyxUORq5EHCrGlQYPS2rsuyb4',
    MIXPANEL_KEY: 'cc824fdf541e250d2b2252506a7a4b8a',
  },
  settings: {
    demo: false,
    renderLog: true,
    devTools: true,
  },
}

const neo = {
  api: {
    HOST: 'neo.ambient.ai',
    SECURE: false,
  },
  socket: {
    HOST: 'neo.ambient.ai',
    PORT: 9001,
    SECURE: false,
    PATH: '',
  },
  signalBridge: {
    HOST: 'neo.ambient.ai',
    PORT: 9004,
    SECURE: false,
    PATH: '',
  },
  verificationServer: {
    HOST: 'neo.ambient.ai',
    PORT: 9005,
    SECURE: false,
  },
  signalBridgeOwt: 'https://signal-staging.ambient.ai',
  apiKeys: {
    GOOGLE_MAP_KEY: 'AIzaSyDxkuV4_lHyxUORq5EHCrGlQYPS2rsuyb4',
    MIXPANEL_KEY: 'cc824fdf541e250d2b2252506a7a4b8a',
  },
  settings: {
    demo: false,
    renderLog: true,
    devTools: true,
  },
}

const demo = {
  api: {
    HOST: 'dev.ambient.ai',
    SECURE: true,
  },
  socket: {
    HOST: 'dev.ambient.ai',
    PORT: 9001,
    SECURE: true,
    PATH: '',
  },
  signalBridge: {
    HOST: 'dev.ambient.ai',
    PORT: 9004,
    SECURE: true,
    PATH: '',
  },
  verificationServer: {
    HOST: 'dev.ambient.ai',
    PORT: 9005,
    SECURE: true,
  },
  signalBridgeOwt: 'https://signal-demo.ambient.ai',
  apiKeys: {
    GOOGLE_MAP_KEY: 'AIzaSyDxkuV4_lHyxUORq5EHCrGlQYPS2rsuyb4',
    MIXPANEL_KEY: '421e40f302392b9b0cbfe67ab3e69dc5',
  },
  settings: {
    demo: true,
    renderLog: false,
    devTools: false,
  },
}

const demo_backup = {
  api: {
    HOST: 'demo-backup.ambient.ai',
    SECURE: true,
  },
  socket: {
    HOST: 'demo-backup.ambient.ai',
    PORT: 9001,
    SECURE: true,
    PATH: '',
  },
  signalBridge: {
    HOST: 'demo-backup.ambient.ai',
    PORT: 9004,
    SECURE: true,
    PATH: '',
  },
  verificationServer: {
    HOST: 'demo-backup.ambient.ai',
    PORT: 9005,
    SECURE: true,
  },
  signalBridgeOwt: 'https://signal-demo.ambient.ai',
  apiKeys: {
    GOOGLE_MAP_KEY: 'AIzaSyDxkuV4_lHyxUORq5EHCrGlQYPS2rsuyb4',
    MIXPANEL_KEY: '421e40f302392b9b0cbfe67ab3e69dc5',
  },
  settings: {
    demo: true,
    renderLog: false,
    devTools: false,
  },
}

const beta = {
  api: {
    HOST: 'home.ambient.ai',
    SECURE: true,
  },
  socket: {
    HOST: 'home.ambient.ai',
    PORT: 443,
    SECURE: true,
    PATH: '/socket/node',
  },
  signalBridge: {
    HOST: 'home.ambient.ai',
    PORT: 443,
    SECURE: true,
    PATH: '/socket/signal',
  },
  // TODO: Use port 443 for prod-like environments
  verificationServer: {
    HOST: 'home.ambient.ai',
    PORT: 9005,
    SECURE: true,
  },
  signalBridgeOwt: 'https://signal.ambient.ai',
  apiKeys: {
    GOOGLE_MAP_KEY: 'AIzaSyDxkuV4_lHyxUORq5EHCrGlQYPS2rsuyb4',
    MIXPANEL_KEY: 'cb840322e874572a118d8d4216748519',
  },
  settings: {
    demo: false,
    renderLog: false,
    devTools: true,
  },
}

const internal = {
  api: {
    HOST: 'home.ambient.ai',
    SECURE: true,
  },
  socket: {
    HOST: 'home.ambient.ai',
    PORT: 443,
    SECURE: true,
    PATH: '/socket/node',
  },
  signalBridge: {
    HOST: 'home.ambient.ai',
    PORT: 443,
    SECURE: true,
    PATH: '/socket/signal',
  },
  // TODO: Use port 443 for prod-like environments
  verificationServer: {
    HOST: 'home.ambient.ai',
    PORT: 9005,
    SECURE: true,
  },
  signalBridgeOwt: 'https://signal.ambient.ai',
  apiKeys: {
    GOOGLE_MAP_KEY: 'AIzaSyDxkuV4_lHyxUORq5EHCrGlQYPS2rsuyb4',
    MIXPANEL_KEY: 'cb840322e874572a118d8d4216748519',
  },
  settings: {
    demo: false,
    renderLog: false,
    devTools: true,
  },
}

// app is AWS production
const app = {
  api: {
    HOST: 'home.ambient.ai',
    SECURE: true,
  },
  socket: {
    HOST: 'home.ambient.ai',
    PORT: 443,
    SECURE: true,
    PATH: '/socket/node',
  },
  signalBridge: {
    HOST: 'home.ambient.ai',
    PORT: 443,
    SECURE: true,
    PATH: '/socket/signal',
  },
  // TODO: Use port 443 for prod-like environments
  verificationServer: {
    HOST: 'home.ambient.ai',
    PORT: 9005,
    SECURE: true,
  },
  signalBridgeOwt: 'https://signal.ambient.ai',
  apiKeys: {
    GOOGLE_MAP_KEY: 'AIzaSyDxkuV4_lHyxUORq5EHCrGlQYPS2rsuyb4',
    MIXPANEL_KEY: 'cb840322e874572a118d8d4216748519',
  },
  settings: {
    demo: false,
    renderLog: false,
    devTools: false,
  },
}

// azure_app is Azure production
const azure_app = {
  api: {
    HOST: 'azure-prod.ambient.ai',
    SECURE: true,
  },
  socket: {
    HOST: 'azure-prod.ambient.ai',
    PORT: 443,
    SECURE: true,
    PATH: '/socket/node',
  },
  signalBridge: {
    HOST: 'azure-prod.ambient.ai',
    PORT: 443,
    SECURE: true,
    PATH: '/socket/signal',
  },
  verificationServer: {
    HOST: 'azure-vs.ambient.ai',
    PORT: 443,
    SECURE: true,
  },
  signalBridgeOwt: 'https://azure-signal.ambient.ai',
  apiKeys: {
    GOOGLE_MAP_KEY: 'AIzaSyDxkuV4_lHyxUORq5EHCrGlQYPS2rsuyb4',
    MIXPANEL_KEY: 'cb840322e874572a118d8d4216748519',
  },
  settings: {
    demo: false,
    renderLog: false,
    devTools: false,
  },
}

const generateConfiguration = env => {
  let config = null
  switch (env) {
    case 'local':
      config = local
      break
    case 'onprem':
      config = onprem
      break
    case 'remote':
      config = remote
      break
    case 'remote2':
      config = remote2
      break
    case 'staging':
      config = alpha
      break
    case 'ondeck':
      config = ondeck
      break
    case 'neo':
      config = neo
      break
    case 'demo':
      config = demo
      break
    case 'demo_backup':
      config = demo_backup
      break
    case 'beta':
      config = beta
      break
    case 'internal':
      config = internal
      break
    case 'app':
      config = app
      break
    case 'azure_app':
    case 'azure_beta':
      config = azure_app
      break
    default:
      config = test
      break
  }

  return config
}

const config = generateConfiguration(process.env.REACT_APP_ENV)

export default config
