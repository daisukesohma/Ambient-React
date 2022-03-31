import { createMuiTheme } from '@material-ui/core/styles'
import extend from 'lodash/extend'

import light from './palette/light'
import dark from './palette/dark'
import typography from './typography'
import overrides from './overrides'

const theme = {
  palette: light,
  // layout: {
  //   contentWidth: 1236,
  // },
  typography,
  // zIndex: {
  //   appBar: 1200,
  //   drawer: 1100,
  // },
  overrides,
}

export { light }
export { dark }
// export {
//   default as colors,
// } from '../ambient_ui/components/design_system/colors'

// export default responsiveFontSizes(createMuiTheme(theme))

export function getTheme({ darkMode = false }) {
  return createMuiTheme(extend({}, theme, { palette: darkMode ? dark : light }))
}

export default createMuiTheme(theme)
