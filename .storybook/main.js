const custom = require('../config/webpack.config.js')('development')

module.exports = {
  // stories: ['../src/ambient_ui/components/**/*.stories.(js|mdx)']
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-notes', // or register the notes addon as a panel. Only one can be used! // import '@storybook/addon-notes/register'; // register the notes addon as a tab
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-knobs',
    '@storybook/addon-docs',
    '@storybook/addon-viewport',
    '@storybook/addon-backgrounds/',
  ],
  // NOTE: we need to have same webpack configs as for main application
  webpackFinal: config => ({
    ...config,
    resolve: custom.resolve,
    module: { ...config.module, rules: custom.module.rules },
  }),
}
