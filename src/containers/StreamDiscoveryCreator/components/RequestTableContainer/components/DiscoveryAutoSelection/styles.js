import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  gridRoot: {
    marginTop: 200,
  },
  headerDescription: {
    marginBottom: theme.spacing(6),
    color: theme.palette.grey[700],
  },
  choiceRoot: {
    background: `linear-gradient(135deg, ${theme.palette.primary[100]}, ${
      theme.palette.secondary[100]
    }, ${theme.palette.error.light})`,
    width: '100%',
    height: 300,
    borderRadius: theme.spacing(0.5),
    border: `1px solid ${theme.palette.grey[300]}`,
    boxSizing: 'border-box',
    color: theme.palette.grey[800],
    padding: theme.spacing(2, 4),
    '&:hover': {
      background: `linear-gradient(135deg, ${theme.palette.primary[400]}, ${
        theme.palette.common.tertiary
      }, ${theme.palette.error.main})`,
      color: theme.palette.common.white,
    },
  },
  centerColumn: {
    width: '100%',
    height: 300,
  },
  centerText: {
    color: theme.palette.grey[700],
  },
  choiceTitleOne: ({ isHoveringOne }) => ({
    color: isHoveringOne ? theme.palette.common.white : theme.palette.grey[900],
  }),
  choiceTitleTwo: ({ isHoveringTwo }) => ({
    color: isHoveringTwo ? theme.palette.common.white : theme.palette.grey[900],
  }),
  choiceTitle: {
    marginBottom: `${theme.spacing(2)}px !important`,
  },
  choiceDescription: {
    marginBottom: `${theme.spacing(4)}px !important`,
  },
  choiceSubTextOne: ({ isHoveringOne }) => ({
    color: isHoveringOne ? theme.palette.grey[200] : 'transparent',
  }),
  choiceSubTextTwo: ({ isHoveringTwo }) => ({
    color: isHoveringTwo ? theme.palette.grey[200] : 'transparent',
  }),
}))
