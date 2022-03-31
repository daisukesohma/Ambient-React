import { makeStyles, createStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) =>
  createStyles({
    inputBaseInput: {
      border: `1px solid ${palette.grey[700]}`,
      borderRadius: spacing(0.5),
      padding: spacing(1.5),
      fontSize: 14,
    },
    textFieldRoot: {
      width: '100%',
      '& .Mui-disabled': {
        color: palette.grey[500],
      },
    },
    outlinedInputNotchedOutline: {
      visibility: 'hidden',
    },
    inputLabelOutlined: {
      '& .MuiInputLabel-shrink': {
        transform: 'translate(0px, -20px) scale(0.75) !important',
      },
    },
    inputLabelShrink: {
      transform: 'translate(0px, -20px) scale(0.75) !important',
      display: 'flex',
      flexDirection: 'row-reverse',
    },
    inputLabelAsterisk: {
      color: palette.error.main,
    },
    link: {
      color: palette.primary.main,
    },
    sectionHeader: {},
    subtitleHeader: {},
    // rename this to inputSpacing or something
    textFieldSpacing: {
      marginBottom: spacing(2),
      paddingTop: spacing(2),
    },
    section: {
      marginBottom: spacing(2),
    },
  }),
)
