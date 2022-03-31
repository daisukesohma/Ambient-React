import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ palette }) => ({
  root: {
    width: '100%',
    margin: 0,
  },
  header: {
    display: 'flex',
    justifyContent: 'center',
    padding: 10,
  },
  profileEditHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    '& .title': {
      display: 'flex',
      alignItems: 'center',
    },
    '& .am-h5': {
      marginRight: 18,
    },
    '& .checkin': {
      fontSize: 14,
      color: palette.secondary.main,
    },
  },
  checkinCircle: {
    display: 'inline-block',
    width: 8,
    height: 8,
    borderRadius: 50,
    backgroundColor: palette.secondary.main,
    marginRight: 8,
    marginBottom: 1,
  },
  federationIdWrapper: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 12px',
    boxSizing: 'border-box',
    height: 32,
    borderRadius: 4,
    backgroundColor: palette.grey[200],
    marginRight: 50,
    fontSize: 10,
    fontWeight: 500,
    lineHeight: '16px',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    color: palette.common.black,
  },
  textField: {
    width: '100%',
    '& .MuiOutlinedInput-input': {
      padding: '18.5px 14px',
    },
  },
  label: {
    fontWeight: 'normal',
    fontSize: 16,
    lineHeight: '24px',
    letterSpacing: '0.5px',
    color: palette.grey[500],
    marginBottom: 16,
  },
  fieldText: {
    fontWeight: 'normal',
    fontSize: '20px',
    lineHeight: '24px',
    display: 'flex',
    alignItems: 'center',
    letterSpacing: '0.02em',
    color: palette.common.black,
    marginBottom: 32,
  },
  phoneText: {
    width: '100%',
    '& .MuiOutlinedInput-input': {
      padding: '18.5px 14px',
    },
    '& .MuiInputLabel-root': {
      marginLeft: '50%',
    },
    '& .MuiInputLabel-root.MuiInputLabel-shrink': {
      marginLeft: 0,
    },
    '& .MuiInputBase-input': {
      paddingLeft: 'calc(50% + 16px)',
    },
  },
  phoneNumber: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
  },
  countryWrapper: {
    width: '50%',
    padding: '0 8px',
  },
  phoneWrapper: {
    flex: 1,
    marginBottom: 10,
  },
  sitesWrapper: {
    marginTop: 10,
    marginBottom: 10,
  },
  imgWrapper: {
    marginBottom: 10,
    display: 'flex',
    justifyContent: 'center',
  },
  divider: {
    width: '100%',
  },
}))
