import { makeStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles(({ spacing, palette }) => ({
  titleContainer: {
    marginBottom: spacing(4),
  },
  toolContainer: {
    marginBottom: spacing(3),
  },
  dateWrapper: ({ isMobile }) => ({
    width: isMobile ? '100%' : 'unset',
    margin: isMobile ? 5 : 'unset',
    '& .MuiInputBase-input': {
      fontFamily: '"Aeonik-Regular", "Roboto"',
    },
  }),
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 100,
  },
  topBarItem: ({ isMobile }) => ({
    width: isMobile ? '100%' : 'unset',
    margin: isMobile ? 4 : 'unset',
    '& .MuiFormControl-root': {
      width: isMobile ? '100%' : 'unset',
      '& > div': {
        margin: isMobile ? 0 : '0px 8px',
      },
    },
  }),
  downloadBtn: ({ isMobile }) => ({
    '&&': {
      padding: isMobile ? '0px 16px' : '6px 16px',
    },
  }),
  gaugeClickable: {
    cursor: 'pointer',
  },
  alertPanel: {
    padding: spacing(0, 1),
    margin: spacing(1, 0),
  },
  maxHeight: {
    height: '100%',
  },
  border: {
    borderRadius: 4,
    boxSizing: 'border-box',
    border: `1px solid ${palette.border.default}`,
  },
  selected: {
    borderRadius: 4,
    boxSizing: 'border-box',
    border: `1px solid ${palette.primary.main}`,
  },
}))
