import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  regionCardWrapper: {
    display: 'flex',
    alignItems: 'center',
    textTransform: 'uppercase',
  },
  regionList: {
    width: '100%',
  },
  regionListItem: {
    '&&': {
      padding: 0,
    },
  },
  regionListItemHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    paddingTop: 8,
    textTransform: 'none',
  },
  sectionSubtext: {
    textTransform: 'none',
  },
  streamsWrapper: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    maxHeight: 150,
    overflowY: 'scroll',
    '&::-webkit-scrollbar': {
      width: 6,
    },
    marginBottom: spacing(2),
    marginLeft: spacing(3),
  },
  streamChip: {
    padding: '4px 8px',
    borderRadius: 4,
    marginTop: 12,
    marginRight: 8,
    cursor: 'pointer',
    textTransform: 'none',
    fontSize: `12px !important`,
  },
  streamChipDisabled: {
    border: `1px solid ${palette.text.disabled}`,
    color: palette.text.disabled,
  },
  streamChipUnauth: {
    cursor: 'default !important',
  },
}))
