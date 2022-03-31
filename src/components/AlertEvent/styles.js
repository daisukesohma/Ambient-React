import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  carouselWrapper: {
    width: '100%',
    height: '100%',
    '& >div': {
      height: '100%',
    },
    '& .slider-wrapper': {
      height: '100%',
    },
  },
  root: ({ darkMode }) => ({
    height: '100%',
    background: palette.common.white,
    borderRadius: 4,
    backgroundColor: darkMode ? palette.common.black : palette.common.white,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  }),
  titleContainer: ({ darkMode }) => ({
    color: darkMode ? palette.common.white : palette.common.black,
    padding: spacing(1, 2),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  }),
  title: ({ darkMode }) => ({
    color: darkMode ? palette.common.white : palette.common.black,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  }),
  subTitle: ({ darkMode }) => ({
    color: palette.grey[darkMode ? 100 : 700],
  }),
  halfWidthContainer: {
    flex: 1,
  },
  textTruncate: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  rowContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowEnd: {
    display: 'flex',
    justifyContent: 'flex-end',
    textAlign: 'right',
  },
  videoIcon: ({ darkMode }) => ({
    color: palette.grey[darkMode ? 800 : 300],
    fontSize: 100,
  }),
  iconContainer: {
    margin: 'auto',
  },
}))
