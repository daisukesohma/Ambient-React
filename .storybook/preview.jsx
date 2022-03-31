import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles'
import Theme from '../src/theme'
import { addParameters, addDecorator } from '@storybook/react'
import { DocsPage, DocsContainer } from '@storybook/addon-docs/blocks'
import { withInfo } from '@storybook/addon-info'
import { colors } from '../src/ambient_ui/shared/styles'
import './styles.css'

function ThemeWrapper(storyFn) {
  return <ThemeProvider theme={Theme}>{storyFn()}</ThemeProvider>
}

addDecorator(ThemeWrapper)
addDecorator(withInfo)

const newViewports = {
  mobile: {
    name: 'Mobile',
    styles: {
      width: '320px',
      height: '568px',
    },
  },
  tablet: {
    name: 'Tablet',
    styles: {
      width: '768px',
      height: '1024px',
    },
  },
  laptop: {
    name: 'Laptop',
    styles: {
      width: '1200px',
      height: '1024px',
    },
  },
  desktop: {
    name: 'Desktop',
    styles: {
      width: '1366px',
      height: '1024px',
    },
  },
  wide: {
    name: 'Wide',
    styles: {
      width: '1920px',
      height: '1080px',
    },
  },
}

addParameters({
  docs: {
    container: DocsContainer,
    page: DocsPage,
  },
  viewport: {
    viewports: newViewports, // newViewports would be an ViewportMap. (see below for examples)
    defaultViewport: 'someDefault',
  },
  backgrounds: [
    { name: 'Grey100', value: colors.grey100, default: true },
    { name: 'Black', value: colors.black },
    { name: 'Grey700', value: colors.grey700 },
    { name: 'Grey300', value: colors.grey300 },
    { name: 'White', value: colors.white },
    { name: 'Primary', value: colors.primary },
  ],
})
