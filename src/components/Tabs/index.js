/* eslint-disable react/jsx-props-no-spreading  */
import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

// different examples: https://material-ui.com/components/tabs/
// TODO: is it possible to move it to styles, instead of creating new styled-components

const StyledTabs = withStyles(({ palette }) => ({
  indicator: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    '& > div': {
      maxWidth: 50,
      width: '100%',
      backgroundColor: palette.secondary.main,
    },
  },
}))(props => <Tabs {...props} TabIndicatorProps={{ children: <div /> }} />)

const StyledTab = withStyles(({ spacing, typography, palette }) => ({
  root: {
    minWidth: 72,
    textTransform: 'none',
    color: '#fff',
    fontFamily: 'Aeonik-Light',
    fontWeight: typography.fontWeightLight,
    fontSize: typography.pxToRem(12),
    marginRight: spacing(1),
    '&:focus': {
      opacity: 1,
    },
    '&$selected': {
      color: palette.secondary.main,
    },
  },
}))(props => <Tab disableRipple {...props} />)

function AmbientTabs({ labels, handleChange, activeIndex }) {
  return (
    <div>
      <StyledTabs
        value={activeIndex}
        onChange={handleChange}
        aria-label='ambient tabs'
      >
        {labels.map(label => (
          <StyledTab key={label} label={label} />
        ))}
      </StyledTabs>
    </div>
  )
}

export default AmbientTabs
