import { makeStyles } from '@material-ui/core/styles'

interface StyleArguments {
  darkMode: boolean
  fontSize: number
  borderSize: number
  contentWidth: string | number
}

export default makeStyles(({ spacing, palette }) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: spacing(0.5),
    paddingRight: spacing(0.5),
  },
  border: ({ darkMode, borderSize }: StyleArguments) => ({
    borderBottom: `${borderSize}px solid ${
      darkMode ? palette.common.white : palette.common.black
    }`,
    width: '100%',
  }),
  content: ({ darkMode, fontSize, contentWidth }: StyleArguments) => ({
    paddingTop: spacing(0.5),
    paddingBottom: spacing(0.5),
    width: contentWidth,
    fontSize,
    color: darkMode ? palette.common.white : palette.common.black,
  }),
}))
