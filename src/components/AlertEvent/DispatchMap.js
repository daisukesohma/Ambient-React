import React from 'react'
import GoogleMapReact from 'google-map-react'
import RoomTwoToneIcon from '@material-ui/icons/RoomTwoTone'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import { isMobile } from 'react-device-detect'

import config from 'config'

const useStyles = makeStyles(theme => ({
  DispatchMapColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    backgroundColor: 'white',
    '& >div': {
      marginBottom: isMobile ? '260px !important' : 0,
      '& >div': {
        height: isMobile ? '250px !important' : '100%',
      },
    },
  },
}))

const DispatchMap = ({ lat, lng, zoom }) => {
  const classes = useStyles()
  const center = { lat: parseFloat(lat), lng: parseFloat(lng) }

  if (lat && lng) {
    return (
      <div className={classes.DispatchMapColumn}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: config.apiKeys.GOOGLE_MAP_KEY }}
          defaultCenter={center}
          center={center}
          defaultZoom={zoom}
          zoom={zoom}
        >
          <RoomTwoToneIcon color='error' lat={lat} lng={lng} />
        </GoogleMapReact>
      </div>
    )
  }

  return null
  // return (
  //   // Important! Always set the container height explicitly
  //   <div className={classes.DispatchMapColumn}>
  //     <ErrorIcon color='error' />
  //     <Typography display='block'>Site location not available</Typography>
  //   </div>
  // )
}

DispatchMap.defaultProps = {
  lat: 59.95,
  lng: 30.33,
  zoom: 12,
}

DispatchMap.propTypes = {
  lat: PropTypes.number,
  lng: PropTypes.number,
  zoom: PropTypes.number,
}

export default DispatchMap
