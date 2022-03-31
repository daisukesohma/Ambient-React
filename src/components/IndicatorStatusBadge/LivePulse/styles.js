import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ palette }) => ({
  '@keyframes rippleWhite': {
    '0%': {
      boxShadow: '0 0 0 0 rgba(256,256, 256, 0.6)',
    },
    '70%': {
      boxShadow: '0 0 0 4px rgba(256,256, 256, 0.05)',
    },
    '80%': {
      boxShadow: '0 0 0 1px rgba(256,256, 256, 0)',
    },
    '100%': {
      boxShadow: '0 0 0 1px rgba(256,256, 256, 0)',
    },
  },
  '@keyframes rippleRed': {
    '0%': {
      boxShadow: '0 0 0 0 rgba(253,35, 92, 0.6)',
    },
    '70%': {
      boxShadow: '0 0 0 4px rgba(253,35, 92, 0.05)',
    },
    '80%': {
      boxShadow: '0 0 0 1px rgba(253,35, 92, 0)',
    },
    '100%': {
      boxShadow: '0 0 0 1px rgba(253,35, 92, 0)',
    },
  },
  '@keyframes rippleSecondary': {
    '0%': {
      boxShadow: '0 0 0 0 rgba(10, 191, 252, 0.6)',
    },
    '70%': {
      boxShadow: '0 0 0 4px rgba(10, 191, 252, 0.05)',
    },
    '80%': {
      boxShadow: '0 0 0 1px rgba(10, 191, 252, 0.0)',
    },
    '100%': {
      boxShadow: '0 0 0 1px rgba(10, 191, 252, 0)',
    },
  },
  '@keyframes rippleYellow': {
    '0%': {
      boxShadow: '0 0 0 0 rgba(255, 200, 3, 0.6)',
    },
    '70%': {
      boxShadow: '0 0 0 4px rgba(255, 200, 3, 0.05)',
    },
    '80%': {
      boxShadow: '0 0 0 1px rgba(255, 200, 3, 0.0)',
    },
    '100%': {
      boxShadow: '0 0 0 1px rgba(255, 200, 3, 0)',
    },
  },
  '@keyframes rippleWhiteSmall': {
    '0%': {
      boxShadow: '0 0 0 0 rgba(256,256, 256, 0.6)',
    },
    '70%': {
      boxShadow: '0 0 0 2px rgba(256,256, 256, 0.05)',
    },
    '80%': {
      boxShadow: '0 0 0 1px rgba(256,256, 256, 0)',
    },
    '100%': {
      boxShadow: '0 0 0 1px rgba(256,256, 256, 0)',
    },
  },
  '@keyframes rippleRedSmall': {
    '0%': {
      boxShadow: '0 0 0 0 rgba(253,35, 92, 0.6)',
    },
    '70%': {
      boxShadow: '0 0 0 2px rgba(253,35, 92, 0.05)',
    },
    '80%': {
      boxShadow: '0 0 0 1px rgba(253,35, 92, 0)',
    },
    '100%': {
      boxShadow: '0 0 0 1px rgba(253,35, 92, 0)',
    },
  },
  '@keyframes rippleSecondarySmall': {
    '0%': {
      boxShadow: '0 0 0 0 rgba(10, 191, 252, 0.6)',
    },
    '70%': {
      boxShadow: '0 0 0 2px rgba(10, 191, 252, 0.05)',
    },
    '80%': {
      boxShadow: '0 0 0 1px rgba(10, 191, 252, 0.0)',
    },
    '100%': {
      boxShadow: '0 0 0 1px rgba(10, 191, 252, 0)',
    },
  },
  '@keyframes rippleYellowSmall': {
    '0%': {
      boxShadow: '0 0 0 0 rgba(255, 200, 3, 0.6)',
    },
    '70%': {
      boxShadow: '0 0 0 2px rgba(255, 200, 3, 0.05)',
    },
    '80%': {
      boxShadow: '0 0 0 1px rgba(255, 200, 3, 0.0)',
    },
    '100%': {
      boxShadow: '0 0 0 1px rgba(255, 200, 3, 0)',
    },
  },
  live: ({ pulseSize }) => ({
    marginRight: 5,
    display: 'block',
    width: pulseSize,
    height: pulseSize,
    borderRadius: '50%',
    background: palette.error.main,
    cursor: 'pointer',
  }),
  rippleRed: {
    boxShadow: '0 0 0 rgba(253,35, 92, 0.6)',
    animation: '$rippleRed 1s infinite',
  },
  rippleWhite: {
    boxShadow: '0 0 0 rgba(256,256, 256, 0.6)',
    animation: `$rippleWhite 1s infinite`,
  },
  rippleYellow: {
    boxShadow: '0 0 0 rgba(255, 200, 3, 0.6)',
    animation: `$rippleYellow 1s infinite`,
  },
  rippleSecondary: {
    boxShadow: '0 0 0 rgba(10, 191, 252, 0.6)',
    animation: `$rippleSecondary 1s infinite`,
  },
  rippleRedSmall: {
    boxShadow: '0 0 0 rgba(253,35, 92, 0.6)',
    animation: '$rippleRedSmall 1s infinite',
  },
  rippleWhiteSmall: {
    boxShadow: '0 0 0 rgba(256,256, 256, 0.6)',
    animation: `$rippleWhite 1s infinite`,
  },
  rippleYellowSmall: {
    boxShadow: '0 0 0 rgba(255, 200, 3, 0.6)',
    animation: `$rippleYellowSmall 1s infinite`,
  },
  rippleSecondarySmall: {
    boxShadow: '0 0 0 rgba(10, 191, 252, 0.6)',
    animation: `$rippleSecondarySmall 1s infinite`,
  },
}))
