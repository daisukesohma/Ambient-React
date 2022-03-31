import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Icons } from 'ambient_ui'

import DataPointDescription from './DataPointDescription'
import CardInfo from './CardInfo'
import DataPointVideo from './DataPointVideo'
import useStyles from './styles'

const getReadableTimeWithFormat = (unixTs, format) => {
  return moment.unix(unixTs).format(format)
}

const defaultProps = {
  dataPoint: {},
  cardSize: 'medium',
  tsIdentifierStart: '',
  tsIdentifierEnd: '',
  sourceType: '',
  source: '',
  streamId: '',
  tsCreated: '',
  videoArchive: {},
  metadataArchive: {},
  id: 0,
}

const propTypes = {
  dataPoint: PropTypes.object,
  cardSize: PropTypes.oneOf(['medium', 'small']),
  tsIdentifierStart: PropTypes.string,
  tsIdentifierEnd: PropTypes.string,
  sourceType: PropTypes.string,
  source: PropTypes.string,
  streamId: PropTypes.string,
  tsCreated: PropTypes.string,
  videoArchive: PropTypes.object,
  metadataArchive: PropTypes.object,
  id: PropTypes.number,
}

function DataPointCard({
  dataPoint,
  id,
  tsIdentifierStart,
  tsIdentifierEnd,
  sourceType,
  source,
  streamId,
  tsCreated,
  videoArchive,
  metadataArchive,
  cardSize,
}) {
  DataPointCard.handleClickOutside = () => setIsHover(false)
  const darkMode = useSelector(state => state.settings.darkMode)
  const [isHover, setIsHover] = useState(false)
  const isMini = cardSize === 'small'
  const classes = useStyles({ darkMode, isHover, isMini })

  const shortReadableTime = getReadableTimeWithFormat(tsCreated, 'ddd hh:mm:ss')
  const longReadableTime = getReadableTimeWithFormat(
    tsCreated,
    'ddd MM/DD/YY HH:mm:ssA',
  )
  const createDate = moment.unix(tsCreated).format('ddd MM/DD/YY HH:mm:ssA')

  const exactServed =
    videoArchive.videoArchive == null
      ? {}
      : videoArchive.videoArchive.exactServed

  const AlertIcon = Icons.Info

  return (
    <div key={id} className={classes.root}>
      <div
        id='video-container'
        style={{ display: 'flex', position: 'relative' }}
        onMouseOver={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        onMouseEnter={() => setIsHover(true)}
        onTouchStart={() => setIsHover(true)}
      >
        <DataPointVideo
          videoArchive={videoArchive.videoArchive}
          size={cardSize}
        />
        <span className={classes.nameContainer}>
          <div className={classes.name}>
            <div className={'am-caption'}>
              {exactServed ? 'Exact Frames' : 'Not Exact Frames'}
            </div>
          </div>
        </span>
        <span className={classes.infoContainer}>
          <CardInfo
            createDate={createDate}
            tsIdentifierStart={tsIdentifierStart}
            tsIdentifierEnd={tsIdentifierEnd}
            sourceType={sourceType}
            source={source}
            streamId={streamId}
            id={id}
            videoStatus={videoArchive.status}
            metadataStatus={metadataArchive.status}
            isMini={isMini}
            AlertIcon={AlertIcon}
          />
        </span>
      </div>
      <DataPointDescription
        dataPoint={dataPoint}
        alert={videoArchive}
        isMini={isMini}
        readableTime={isMini ? shortReadableTime : longReadableTime}
        videoArchive={videoArchive}
        metadataArchive={metadataArchive}
      />
    </div>
  )
}

DataPointCard.prototype = {}
DataPointCard.propTypes = propTypes
DataPointCard.defaultProps = defaultProps

export default DataPointCard
