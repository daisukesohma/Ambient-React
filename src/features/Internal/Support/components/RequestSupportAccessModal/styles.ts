import { makeStyles } from '@material-ui/core/styles'

interface StyleArguments {
  darkMode: boolean
}

export const useStyles = makeStyles(({ spacing, palette }) => ({
  root: ({ darkMode }: StyleArguments) => ({
    top: '50%',
    left: '50%',
    width: '60%',
    height: 'auto',
    backgroundColor: darkMode ? palette.grey[900] : palette.common.white,
    color: darkMode ? palette.common.white : palette.common.black,
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    boxSizing: 'border-box',
    boxShadow: '0px 1px 50px rgba(98, 100, 105, 0.15)',
    border: `1px solid ${palette.grey[100]}`,
    borderRadius: 4,
    '&:focus': {
      outline: 'none',
    },
    padding: spacing(2, 2, 2, 2),
    flexDirection: 'column',
    maxHeight: '100%',
    overflowY: 'auto',
  }),
  nonModal: ({ darkMode }: StyleArguments) => ({
    backgroundColor: darkMode ? palette.grey[900] : palette.common.white,
    color: darkMode ? palette.common.white : palette.common.black,
    flexDirection: 'column',
    maxHeight: '100%',
    margin: 'auto',
    // width: '60%',
    border: `1px solid ${palette.grey[200]}`,
    borderRadius: 4,
    '&:focus': {
      outline: 'none',
    },
    padding: spacing(2, 2, 2, 2),
  }),
  title: {
    fontSize: 24,
    margin: spacing(2, 0, 3),
  },
  subTitle: {
    fontSize: 18,
    paddingLeft: spacing(0.9),
  },
  content: {
    padding: spacing(0, 2, 2, 2),
  },
  textField: ({ darkMode }: StyleArguments) => ({
    '&:hover:not($disabled):not($focused):not($error) $notchedOutline': {
      borderColor: darkMode ? palette.common.white : palette.common.black,
    },
    color: darkMode ? palette.common.white : palette.common.black,
    borderColor: darkMode ? palette.common.white : palette.common.black,
    '& hover': {
      // - The Input-root, inside the TextField-root
      borderColor: darkMode ? palette.common.white : palette.common.black,
    },
    '& input': {
      color: 'white',
    },
    '& label': {
      color: palette.grey[500],
      fontSize: 12,
      fontFamily: 'Aeonik',
    },
  }),
  notchedOutline: ({ darkMode }: StyleArguments) => ({
    borderColor: darkMode ? palette.common.white : palette.common.black,
    '& hover': {
      // - The Input-root, inside the TextField-root
      borderColor: darkMode ? palette.common.white : palette.common.black,
    },
  }),
  focused: ({ darkMode }: StyleArguments) => ({
    '& $notchedOutline': {
      borderColor: darkMode ? palette.common.white : palette.common.black,
    },
    '& hover': {
      // - The Input-root, inside the TextField-root
      borderColor: darkMode ? palette.common.white : palette.common.black,
    },
  }),
  attachments: {
    paddingBottom: 8,
  },
  upload: {
    paddingRight: 8,
  },
  required: {
    paddingLeft: 4,
    color: palette.error.main,
  },
  dropdown: {
    marginLeft: -8,
  },
}))
