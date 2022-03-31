import React, { useState } from 'react'
import { Carousel } from 'react-responsive-carousel'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
// src
import EvidenceGif from 'components/EvidenceGif'

import 'react-responsive-carousel/lib/styles/carousel.min.css'
import './carousel.override.css'

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    '& .slider': {
      height: '100%',
      opacity: 1,
    },
  },
}))

const propTypes = {
  onChange: PropTypes.func,
  alertEventId: PropTypes.number,
  alertInstances: PropTypes.array,
}

const defaultProps = {
  onChange: () => {},
}

const Evidence = ({ alertInstances, onChange }) => {
  const classes = useStyles()

  const [selectedIndex, setSelectedIndex] = useState(0)

  const handleChange = index => {
    setSelectedIndex(index)
    onChange(alertInstances[index])
  }

  return (
    <div className={classes.root}>
      <Carousel
        showThumbs={false}
        showIndicators={false}
        selectedItem={selectedIndex}
        onChange={handleChange}
      >
        {(alertInstances || []).map((alertInstance, i) => {
          const {
            id,
            alert_hash,
            alertHash,
            eventHash,
            clip,
            tsIdentifier,
            ts_identifier,
            tsCreated,
          } = alertInstance
          return (
            <div key={`evidence-${alertInstance.id}`}>
              <EvidenceGif
                id={id}
                alert_hash={alert_hash}
                alertHash={alertHash}
                eventHash={eventHash}
                clip={clip}
                tsIdentifier={tsIdentifier}
                ts_identifier={ts_identifier}
                tsCreated={tsCreated}
                selected={selectedIndex === i}
              />
            </div>
          )
        })}
      </Carousel>
    </div>
  )
}

Evidence.propTypes = propTypes
Evidence.defaultProps = defaultProps

export default Evidence
