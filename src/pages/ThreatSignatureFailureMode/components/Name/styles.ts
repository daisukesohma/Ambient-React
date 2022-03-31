import { makeStyles } from '@material-ui/core/styles'

interface StyleProps {
  selected: boolean
}

export const useStyles = makeStyles(({ spacing, palette }) => ({
  cell: ({ selected }: StyleProps) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: selected ? palette.primary.main : 'transparent',
    color: selected ? palette.common.white : 'inherit',
    height: '100%',
    width: '100%',
    margin: '-16px',
    padding: spacing(2),
    borderRadius: spacing(0.5),
    outline: 'none',
  }),
}))
