import AeonikWoff2Regular from 'ambient_ui/components/design_system/fonts/Aeonik-Regular.woff2'
import AeonikWoff2Medium from 'ambient_ui/components/design_system/fonts/Aeonik-Medium.woff2'
import AeonikWoff2Thin from 'ambient_ui/components/design_system/fonts/Aeonik-Thin.woff2'
import AeonikWoff2Light from 'ambient_ui/components/design_system/fonts/Aeonik-Light.woff2'

const aeonikRegular = {
  fontFamily: 'Aeonik-Regular',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 400,
  src: `
      local('Aeonik-Regular'),
      url(${AeonikWoff2Regular}) format('woff2')
    `,
  unicodeRange:
    'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF',
}

const aeonikMedium = {
  fontFamily: 'Aeonik-Medium',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 600,
  src: `
      local('Aeonik-Medium'),
      url(${AeonikWoff2Medium}) format('woff2')
    `,
  unicodeRange:
    'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF',
}

const aeonikThin = {
  fontFamily: 'Aeonik-Thin',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 600,
  src: `
      local('Aeonik-Thin'),
      url(${AeonikWoff2Thin}) format('woff2')
    `,
  unicodeRange:
    'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF',
}

const aeonikLight = {
  fontFamily: 'Aeonik-Light',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 300,
  src: `
      local('Aeonik-Light'),
      url(${AeonikWoff2Light}) format('woff2')
    `,
  unicodeRange:
    'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF',
}

const typography = {
  REGULAR: {
    fontFamily: '"Aeonik-Regular", "Roboto"',
    fontFace: aeonikRegular,
  },
  thin: {
    fontFamily: '"Aeonik-Thin", "Roboto"',
    fontFace: aeonikThin,
  },
  LIGHT: {
    fontFamily: '"Aeonik-Light", "Roboto"',
    fontFace: aeonikLight,
  },
  MEDIUM: {
    fontFamily: '"Aeonik-Medium", "Roboto"',
    fontFace: aeonikMedium,
  },
}

export default {
  fontFamily: typography.REGULAR.fontFamily,
  overrides: {
    MuiCssBaseline: {
      '@global': {
        '@font-face': [
          typography.REGULAR.fontFace,
          typography.MEDIUM.fontFace,
          typography.LIGHT.fontFace,
        ],
      },
    },
  },
  htmlFontSize: 20,
  fontSize: 20,
  h1: {
    fontSize: '96px',
    fontFamily: typography.LIGHT.fontFamily,
    lineHeight: '120px',
    letterSpacing: '-1.5px',
  },
  h2: {
    fontSize: '60px',
    fontFamily: typography.LIGHT.fontFamily,
    lineHeight: '72px',
    letterSpacing: '-0.5px',
  },
  h3: {
    fontSize: '40px',
    fontFamily: typography.REGULAR.fontFamily,
    lineHeight: '48px',
  },
  h4: {
    fontSize: '34px',
    fontFamily: typography.LIGHT.fontFamily,
    lineHeight: '41px',
    letterSpacing: '0.25px',
  },
  h5: {
    fontSize: '20px',
    fontFamily: typography.MEDIUM.fontFamily,
    lineHeight: '24px',
  },
  h6: {
    fontSize: '20px',
    fontWeight: 300,
    fontFamily: typography.LIGHT.fontFamily,
    lineHeight: '24px',
    letterSpacing: '0.15px',
  },
  subtitle1: {
    fontSize: '14px',
    fontWeight: 500,
    fontFamily: typography.MEDIUM.fontFamily,
    lineHeight: '20px',
    letterSpacing: '0.15px',
  },
  subtitle2: {
    fontSize: '14px',
    fontWeight: 400,
    fontFamily: typography.REGULAR.fontFamily,
    lineHeight: '20px',
  },
  body1: {
    fontSize: '16px',
    fontWeight: 400,
    fontFamily: typography.REGULAR.fontFamily,
    lineHeight: '24px',
    letterSpacing: '0.5px',
  },
  body2: {
    fontSize: '16px',
    fontWeight: 300,
    fontFamily: typography.LIGHT.fontFamily,
    lineHeight: '24px',
    letterSpacing: '0.25px',
  },
  caption: {
    fontSize: '12px',
    fontWeight: 400,
    fontFamily: typography.REGULAR.fontFamily,
    lineHeight: '16px',
    letterSpacing: '0.4px',
  },
  overline: {
    fontSize: '10px',
    fontWeight: 600,
    fontFamily: typography.MEDIUM.fontFamily,
    lineHeight: '16px',
    letterSpacing: '1.5px',
  },
  button: {
    fontSize: '14px',
    fontWeight: 500,
    fontFamily: typography.MEDIUM.fontFamily,
    lineHeight: '16px',
    letterSpacing: '0.75px',
  },
}
