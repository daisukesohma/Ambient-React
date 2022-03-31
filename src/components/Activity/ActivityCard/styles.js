import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  accordionRoot: ({ darkMode }) => ({
    cursor: 'pointer !important',
    borderBottom: `1px solid ${palette.grey[darkMode ? 700 : 300]} !important`,
    backgroundColor: `${palette.grey[darkMode ? 900 : 100]} !important`,
    paddingLeft: spacing(1),
  }),
  expanded: {
    margin: '0 !important',
  },
  title: ({ darkMode }) => ({
    color: palette.grey[darkMode ? 500 : 700],
  }),
  highlight: {
    backgroundColor: palette.primary[200],
  },
  body: {
    padding: spacing(1),
  },
  footer: {
    color: palette.grey[700],
    paddingLeft: spacing(1),
  },
  truncate: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: '100%',
  },
  pointer: {
    cursor: 'pointer',
  },
  accordionSummaryDisabled: {
    opacity: '1 !important',
  },
  accordionSummary: ({ darkMode }) => ({
    padding: 0,
    '&:hover': {
      background: darkMode ? palette.grey[700] : palette.primary[50],
    },
  }),
  accordionDetails: {
    padding: 0,
  },
  buttons: {
    color: palette.primary.main,
    opacity: 0.7,
    '&:hover': {
      opacity: 1.0,
      background: 'transparent !important',
    },
  },
}))
