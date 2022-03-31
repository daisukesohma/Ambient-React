import { makeStyles } from '@material-ui/core/styles'

interface StylesProps {
  darkMode: boolean
  isExpanded: boolean
}

export default makeStyles(({ palette }) => ({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  contentWrapper: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    overflowY: 'hidden',
  },
  mainPanel: ({ darkMode }: StylesProps) => ({
    width: '100%',
    height: '100%',
    background: darkMode ? palette.common.black : palette.grey[300],
    overflowY: 'auto',
    borderTop: `1px solid ${
      darkMode ? palette.grey[800] : palette.common.black
    }`,
  }),
  rightPanel: ({ darkMode, isExpanded }: StylesProps) => ({
    display: 'flex',
    width: isExpanded ? '100%' : 0,
    height: '100%',
    background: darkMode ? palette.common.black : palette.grey[100],
  }),
}))
