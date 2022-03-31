import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  root: ({ ratio, width, orientation, wrap }) => ({
    display: 'flex',
    flexDirection: orientation === 'vertical' ? 'column' : 'row',
    flexWrap: wrap ? 'wrap' : null,
    '& canvas': {
      height: width / ratio,
      width,
      marginRight: orientation === 'vertical' ? 0 : theme.spacing(1.5),
      marginBottom: orientation === 'vertical' ? theme.spacing(1.5) : 0,
      clipPath: 'inset(0px 0px 0px 0px round 4px)',
    },
  }),
}))

export default useStyles
