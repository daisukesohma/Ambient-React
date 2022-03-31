import React from 'react'
import PropTypes from 'prop-types'

import DataPointCard from './DataPointsCard'

const defaultProps = {
  dataPoint: {},
  idx: 0,
  key: 0,
}

const propTypes = {
  dataPoint: PropTypes.object,
  idx: PropTypes.number,
  key: PropTypes.string,
}

function DataPointContainer({ dataPoint, idx }) {
  const {
    id,
    tsIdentifierStart,
    tsIdentifierEnd,
    sourceType,
    source,
    streamId,
    tsCreated,
    videoArchive,
    metadataArchive,
  } = dataPoint

  return (
    <DataPointCard
      dataPoint={dataPoint}
      id={id}
      tsIdentifierStart={tsIdentifierStart}
      tsIdentifierEnd={tsIdentifierEnd}
      sourceType={sourceType}
      source={source}
      streamId={streamId}
      tsCreated={tsCreated}
      videoArchive={videoArchive}
      metadataArchive={metadataArchive}
      idx={idx}
    />
  )
}

DataPointContainer.propTypes = propTypes
DataPointContainer.defaultProps = defaultProps

export default DataPointContainer
