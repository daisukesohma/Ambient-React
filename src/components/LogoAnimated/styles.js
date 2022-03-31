import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(() => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -24,
  },
  logoText: ({ logoTextColor, logoTextSize }) => ({
    color: logoTextColor,
    willChange: 'transform, opacity',
    fontSize: `${logoTextSize}px !important`, // using non-standard font-size here FUTURE @eric
  }),
  logo: ({ logoWidth }) => ({
    width: logoWidth,
    willChange: 'opacity',
    marginBottom: 4,
  }),
}))
