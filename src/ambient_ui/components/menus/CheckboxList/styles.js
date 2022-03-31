import { makeStyles } from '@material-ui/core/styles'

import { shadows } from '../../../shared/styles'

export default makeStyles(({ palette }) => ({
  root: {
    width: 160,
    zIndex: 20,
    background: palette.common.white,
    boxShadow: shadows.soft,
    position: 'relative',
  },
  labelWrapper: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    justifyContent: 'space-between',
    boxSizing: 'border-box',
    width: '100%',
    height: 40,
    background: palette.grey[50],
    borderRadius: 4,
    padding: '4px 9px',
    color: palette.grey[700],
    cursor: 'pointer',
  },
  labelSpan: {
    width: 'calc(100% - 20px)',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  icon: {
    position: 'absolute',
    right: 5,
    fontSize: 16,
  },

  list: {
    width: '100%',
    padding: 0,
    position: 'absolute',
  },

  listItem: {
    background: palette.common.white,
    boxSizing: 'border-box',
    borderTop: '1px solid',
    borderColor: palette.grey[100],
    height: 40,
    padding: 10,
    '&:hover': {
      background: palette.primary[50],
    },
  },
  listItemSelected: {
    background: palette.grey[50],
  },
  listItemCheckbox: {
    width: 18,
    height: 18,
    minWidth: 18,
    marginRight: 12,
  },
  listItemText: {
    '&&': {
      color: palette.grey[700],
      '& > span': {
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
      },
    },
  },
  listItemTextSelected: {
    '&&': {
      color: palette.primary.main,
    },
  },
}))
